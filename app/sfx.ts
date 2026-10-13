// Efectos de sonido sintetizados con la Web Audio API.
// Evita depender de archivos de audio extra (solo existe `background.mp3`).

let contexto: AudioContext | null = null;

function obtenerContexto(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!contexto) contexto = new Ctor();
    return contexto;
}

function reanudar(ac: AudioContext): void {
    if (ac.state === 'suspended') {
        ac.resume().catch(() => {
            /* el navegador puede bloquear el audio hasta el primer gesto */
        });
    }
}

/**
 * "Whoosh" de papel al abrir el sobre: ruido blanco filtrado con un barrido
 * de frecuencia y una envolvente de volumen corta.
 */
export function reproducirWhoosh(): void {
    const ac = obtenerContexto();
    if (!ac) return;
    reanudar(ac);

    const ahora = ac.currentTime;
    const duracion = 0.55;
    const cantidad = Math.floor(ac.sampleRate * duracion);

    const buffer = ac.createBuffer(1, cantidad, ac.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < cantidad; i++) {
        datos[i] = Math.random() * 2 - 1;
    }

    const fuente = ac.createBufferSource();
    fuente.buffer = buffer;

    const filtro = ac.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.Q.value = 0.9;
    filtro.frequency.setValueAtTime(320, ahora);
    filtro.frequency.exponentialRampToValueAtTime(2600, ahora + duracion * 0.7);
    filtro.frequency.exponentialRampToValueAtTime(700, ahora + duracion);

    const ganancia = ac.createGain();
    ganancia.gain.setValueAtTime(0.0001, ahora);
    ganancia.gain.exponentialRampToValueAtTime(0.25, ahora + 0.08);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion);

    fuente.connect(filtro);
    filtro.connect(ganancia);
    ganancia.connect(ac.destination);

    fuente.start(ahora);
    fuente.stop(ahora + duracion);
}

/**
 * Aplausos/celebración sintetizados: varias ráfagas cortas de ruido filtrado
 * (bandpass alto) con volumen y tono levemente aleatorios, superpuestas.
 * Distinto de la música de fondo (que es un archivo en loop).
 */
export function reproducirAplausos(): void {
    const ac = obtenerContexto();
    if (!ac) return;
    reanudar(ac);

    const ahora = ac.currentTime;
    const cantidad = 22;
    const duracionRafaga = 0.085;

    for (let i = 0; i < cantidad; i++) {
        const inicio = ahora + i * 0.042 + Math.random() * 0.025;
        const n = Math.floor(ac.sampleRate * duracionRafaga);

        const buffer = ac.createBuffer(1, n, ac.sampleRate);
        const datos = buffer.getChannelData(0);
        for (let j = 0; j < n; j++) {
            // Envolvente por muestra para un "clap" seco
            datos[j] = (Math.random() * 2 - 1) * (1 - j / n);
        }

        const fuente = ac.createBufferSource();
        fuente.buffer = buffer;

        const filtro = ac.createBiquadFilter();
        filtro.type = 'bandpass';
        filtro.Q.value = 0.7;
        filtro.frequency.value = 1100 + Math.random() * 900;

        const ganancia = ac.createGain();
        const volumen = 0.1 + Math.random() * 0.08;
        ganancia.gain.setValueAtTime(0.0001, inicio);
        ganancia.gain.exponentialRampToValueAtTime(volumen, inicio + 0.005);
        ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracionRafaga);

        fuente.connect(filtro);
        filtro.connect(ganancia);
        ganancia.connect(ac.destination);

        fuente.start(inicio);
        fuente.stop(inicio + duracionRafaga);
    }
}
