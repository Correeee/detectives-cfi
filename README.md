# detectives-cfi

Experiencia web interactiva de felicitación para las familias de los detectives de **5.º B** del Centro de Formación Integral. Al tocar un sobre animado se abre una solapa 3D, sale la foto grupal, suena un "whoosh" con música de fondo y termina en una tarjeta festiva de "¡Caso Resuelto!".

## ✨ Funcionalidad

- **Sobre interactivo**: apertura de solapa con animación 3D y revelación de la foto.
- **Apertura automática del lightbox** tras la animación de salida de la foto.
- **Tarjeta de celebración** con mensaje para las familias (tipografía *Fredoka*).
- **Pantalla de carga** con texto "Cargando" y puntos suspensivos animados, más barra de progreso que precarga foto, estampilla, fondo y audio; al completar, avanza sola hacia la experiencia.
- **Música de fondo** (`background.mp3`) con control flotante para pausar/reanudar.
- **Efecto de sonido de apertura** ("whoosh" sintetizado con Web Audio API, sin archivos extra).
- **Vibración** (feedback háptico) al abrir el sobre en dispositivos compatibles.
- **Sello "RESUELTO"** que cae en diagonal sobre la foto en el modal.
- **Micro-sacudida** del sobre cerrado para invitar a tocarlo.
- **Confetti** al abrir el sobre y lluvia festiva dentro del modal (componente reutilizable).
- **Focus trap** en el modal: el foco no puede escapar del lightbox con Tab.
- Uso de [`foto.webp`](public/foto.webp) (322 KB) en lugar de `foto.jpg` para reducir el peso de carga.
- **Compartir / descargar la tarjeta** como imagen JPEG generada en `<canvas>` vía `navigator.share` (share nativo del sistema, que incluye WhatsApp; fallback a descarga).
- **Preview OpenGraph** generada en runtime (`app/opengraph-image.tsx`, 1200×630).
- **Fondo temático** de detectives (`background.webp`) con velo cálido y ajuste para iOS/Safari.
- **Accesibilidad**: navegación por teclado, `aria-label`, `aria-live` en el aviso y respeto por `prefers-reduced-motion`.

## 🧱 Stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- TypeScript
- CSS puro (`app/envelope.css`) — sin dependencias de UI
- Despliegue en [Vercel](https://vercel.com/)

## 🚀 Requisitos previos

- Node.js 18.18+ (recomendado 20+)
- npm

No requiere variables de entorno.

## 🛠️ Scripts

```bash
npm install     # instalar dependencias
npm run dev     # entorno de desarrollo (http://localhost:3000)
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint    # lint con Next
```

## 📁 Estructura

```
app/
  layout.tsx           # metadatos SEO, Open Graph, viewport
  page.tsx             # sobre interactivo, audio, confetti y compartir
  envelope.css         # estilos de toda la experiencia
  basePath.ts          # helper de rutas de assets
  sfx.ts               # efecto "whoosh" (Web Audio API)
  shareCard.ts         # generación de la tarjeta PNG en canvas
  opengraph-image.tsx  # imagen de preview 1200x630 generada en runtime
components/
  Lightbox.tsx         # modal de celebración + acciones de compartir
  Confetti.tsx         # lluvia de confetti reutilizable
public/
  foto.webp, foto.jpg (solo para la imagen OpenGraph), estampilla.png, background.webp, background.mp3
```

## ♿ Notas de accesibilidad

- El sobre y la foto son operables con teclado (`Enter` / `Espacio`).
- Focus trap dentro del lightbox: `Tab`/`Shift+Tab` quedan contenidos y `Escape` cierra.
- Las acciones de compartir anuncian su resultado vía un aviso `aria-live="polite"`.
- Con `prefers-reduced-motion` se desactivan las animaciones (el sello queda visible igual).

## 📄 Estado del proyecto

Ver [`ROADMAP.md`](ROADMAP.md) para el progreso y los próximos pasos.
