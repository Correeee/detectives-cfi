// Genera, del lado del cliente, una tarjeta de celebración en JPEG (1080x1350)
// para que las familias la puedan guardar o compartir por WhatsApp.
//
// Notas de rendimiento/robustez:
// - Las imágenes se cachean por `src` para no re-descargarlas en cada generación.
// - No se usa `crossOrigin`: los assets son del mismo origen, así que no hace
//   falta una petición CORS extra (que forzaba un cache miss y marcaba lentitud).
// - La espera de fuentes está acotada con un timeout para no bloquear el render.
// - Cada paso tiene timeout para evitar cuelgues indefinidos.
// - La salida es JPEG (más rápido de codificar y más liviano que PNG en mobile).

const ANCHO = 1080;
const ALTO = 1350;

type CtxRedondeado = CanvasRenderingContext2D & {
    roundRect?: (x: number, y: number, w: number, h: number, radios: number | number[]) => void;
};

const FUENTE_BASE = "Fredoka, 'Comic Sans MS', system-ui, sans-serif";

const cacheImagenes = new Map<string, Promise<HTMLImageElement>>();

function conTimeout<T>(promesa: Promise<T>, ms: number, etiqueta: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => {
            reject(new Error(`Timeout en: ${etiqueta} (${ms}ms)`));
        }, ms);
        promesa.then(
            (valor) => {
                clearTimeout(id);
                resolve(valor);
            },
            (err) => {
                clearTimeout(id);
                reject(err);
            }
        );
    });
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
    const enCache = cacheImagenes.get(src);
    if (enCache) return enCache;

    const promesa = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => {
            cacheImagenes.delete(src);
            reject(new Error(`No se pudo cargar la imagen: ${src}`));
        };
        img.src = src;

        // Por si el navegador ya la tenía completa y no dispara onload
        if (img.complete && img.naturalWidth > 0) {
            resolve(img);
        }
    });

    const conTope = conTimeout(promesa, 15000, `cargarImagen(${src})`);
    cacheImagenes.set(src, conTope);
    return conTope;
}

/**
 * Espera solo las variantes de fuente que se usan, con un tope de tiempo,
 * para no bloquear la generación si la fuente todavía no está disponible.
 */
async function asegurarFuentes(): Promise<void> {
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    try {
        await Promise.race([
            Promise.all([
                document.fonts.load(`600 26px ${FUENTE_BASE}`),
                document.fonts.load(`700 76px ${FUENTE_BASE}`),
                document.fonts.load(`700 40px ${FUENTE_BASE}`),
            ]),
            new Promise((resolve) => setTimeout(resolve, 500)),
        ]);
    } catch {
        /* la tipografía es opcional para generar la tarjeta */
    }
}

function caminoRedondeado(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
): void {
    const ctxRedondeado = ctx as CtxRedondeado;
    ctx.beginPath();
    if (typeof ctxRedondeado.roundRect === 'function') {
        ctxRedondeado.roundRect(x, y, w, h, r);
        return;
    }
    const radio = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radio, y);
    ctx.arcTo(x + w, y, x + w, y + h, radio);
    ctx.arcTo(x + w, y + h, x, y + h, radio);
    ctx.arcTo(x, y + h, x, y, radio);
    ctx.arcTo(x, y, x + w, y, radio);
    ctx.closePath();
}

function dibujarCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
): void {
    const escala = Math.max(w / img.width, h / img.height);
    const dw = img.width * escala;
    const dh = img.height * escala;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function ajustarLineas(
    ctx: CanvasRenderingContext2D,
    texto: string,
    maxAncho: number
): string[] {
    const palabras = texto.split(' ');
    const lineas: string[] = [];
    let actual = '';
    for (const palabra of palabras) {
        const prueba = actual ? `${actual} ${palabra}` : palabra;
        if (ctx.measureText(prueba).width > maxAncho && actual) {
            lineas.push(actual);
            actual = palabra;
        } else {
            actual = prueba;
        }
    }
    if (actual) lineas.push(actual);
    return lineas;
}

function canvasABlob(canvas: HTMLCanvasElement, tipo: string, calidad: number): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
        const id = setTimeout(() => reject(new Error('Timeout en canvas.toBlob')), 10000);
        try {
            canvas.toBlob(
                (blob) => {
                    clearTimeout(id);
                    if (blob) resolve(blob);
                    else reject(new Error('canvas.toBlob devolvió null'));
                },
                tipo,
                calidad
            );
        } catch (err) {
            clearTimeout(id);
            reject(err instanceof Error ? err : new Error(String(err)));
        }
    });
}

/**
 * Genera la tarjeta como JPEG a partir de la foto y la estampilla del colegio.
 * Devuelve un Blob listo para compartir o descargar.
 */
export async function generarTarjeta(fotoSrc: string, estampillaSrc: string): Promise<Blob> {
    const foto = await cargarImagen(fotoSrc);
    await asegurarFuentes();
    const sello = await cargarImagen(estampillaSrc).catch(() => null);

    const canvas = document.createElement('canvas');
    canvas.width = ANCHO;
    canvas.height = ALTO;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas');

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Fondo degradado cálido
    const fondo = ctx.createLinearGradient(0, 0, ANCHO, ALTO);
    fondo.addColorStop(0, '#fff7ec');
    fondo.addColorStop(1, '#f2d9c2');
    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, ANCHO, ALTO);

    // Tarjeta principal
    const cardX = 60;
    const cardY = 60;
    const cardW = ANCHO - 120;
    const cardH = ALTO - 120;

    ctx.save();
    ctx.shadowColor = 'rgba(90, 50, 20, 0.25)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    caminoRedondeado(ctx, cardX, cardY, cardW, cardH, 48);
    ctx.fillStyle = '#fffdf9';
    ctx.fill();
    ctx.restore();

    caminoRedondeado(ctx, cardX, cardY, cardW, cardH, 48);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#edd5be';
    ctx.stroke();

    // Foto grupal
    const fotoX = cardX + 50;
    const fotoY = cardY + 50;
    const fotoW = cardW - 100;
    const fotoH = 560;

    ctx.save();
    caminoRedondeado(ctx, fotoX, fotoY, fotoW, fotoH, 36);
    ctx.clip();
    dibujarCover(ctx, foto, fotoX, fotoY, fotoW, fotoH);
    ctx.restore();

    caminoRedondeado(ctx, fotoX, fotoY, fotoW, fotoH, 36);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Estampilla postal (si se pudo cargar)
    if (sello) {
        const selloW = 120;
        const selloH = selloW * (582 / 432);
        const selloX = fotoX + fotoW - selloW - 6;
        const selloY = fotoY + fotoH - selloH + 24;
        ctx.save();
        ctx.shadowColor = 'rgba(50, 25, 10, 0.3)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        ctx.drawImage(sello, selloX, selloY, selloW, selloH);
        ctx.restore();
    }

    const cx = ANCHO / 2;

    // Etiqueta superior
    ctx.font = `600 26px ${FUENTE_BASE}`;
    const etiqueta = 'INFORME DE LOS DETECTIVES · 5.º B';
    const etiquetaW = ctx.measureText(etiqueta).width + 56;
    const etiquetaY = fotoY + fotoH + 60;

    caminoRedondeado(ctx, cx - etiquetaW / 2, etiquetaY - 26, etiquetaW, 52, 26);
    ctx.fillStyle = '#faecd9';
    ctx.fill();
    ctx.setLineDash([12, 8]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#dca574';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#9c511e';
    ctx.fillText(etiqueta, cx, etiquetaY + 2);

    // Título
    ctx.font = `700 76px ${FUENTE_BASE}`;
    ctx.fillStyle = '#d9480f';
    ctx.fillText('¡CASO RESUELTO!', cx, etiquetaY + 112);

    // Recuadro destacado
    const destacado = '¡Lo lograron! Descubrieron todos los misterios y encontraron la salida.';
    const cajaW = cardW - 140;
    const textoMax = cajaW - 64;
    ctx.font = `600 34px ${FUENTE_BASE}`;
    const lineas = ajustarLineas(ctx, destacado, textoMax);
    const interlineado = 44;
    const cajaH = lineas.length * interlineado + 44;
    const cajaY = etiquetaY + 180;

    caminoRedondeado(ctx, cx - cajaW / 2, cajaY, cajaW, cajaH, 24);
    ctx.fillStyle = '#fff4e6';
    ctx.fill();
    ctx.setLineDash([16, 12]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59f00';
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#3b2210';
    lineas.forEach((linea, i) => {
        ctx.fillText(linea, cx, cajaY + 42 + i * interlineado);
    });

    // Badge de misión cumplida
    ctx.font = `700 40px ${FUENTE_BASE}`;
    const mision = '¡MISIÓN CUMPLIDA!';
    const misionW = ctx.measureText(mision).width + 80;
    const misionH = 84;
    const misionY = cajaY + cajaH + 66;

    const grad = ctx.createLinearGradient(cx - misionW / 2, misionY, cx + misionW / 2, misionY + misionH);
    grad.addColorStop(0, '#f77f00');
    grad.addColorStop(1, '#d62828');
    caminoRedondeado(ctx, cx - misionW / 2, misionY, misionW, misionH, misionH / 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(mision, cx, misionY + misionH / 2 + 2);

    return await canvasABlob(canvas, 'image/jpeg', 0.9);
}
