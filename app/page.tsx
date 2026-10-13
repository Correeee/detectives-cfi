'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Lightbox from '../components/Lightbox';
import Confetti from '../components/Confetti';
import { getAssetPath } from './basePath';
import { generarTarjeta } from './shareCard';
import { reproducirWhoosh } from './sfx';

export default function Page() {
  const [abierto, setAbierto] = useState(false);
  const [ampliada, setAmpliada] = useState(false);
  const [yaAbrioModal, setYaAbrioModal] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [compartiendo, setCompartiendo] = useState(false);
  const [aviso, setAviso] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const avisoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cache de la tarjeta generada: evita recalcular y permite que al tocar
  // "Compartir" el archivo ya esté listo (sin perder el gesto del usuario).
  const tarjetaRef = useRef<Blob | null>(null);
  const tarjetaPromesaRef = useRef<Promise<Blob> | null>(null);

  const fotoSrc = getAssetPath('/foto.jpg');
  const estampillaSrc = getAssetPath('/estampilla.png');
  const audioSrc = getAssetPath('/background.mp3');

  const iniciarAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setSonando(true))
        .catch(() => {
          /* el navegador puede bloquear el audio hasta el primer gesto */
        });
    }
  }, []);

  const toggleSonido = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setSonando(true))
        .catch(() => { });
    } else {
      audioRef.current.pause();
      setSonando(false);
    }
  }, []);

  const mostrarAviso = useCallback((mensaje: string) => {
    setAviso(mensaje);
    if (avisoTimerRef.current) clearTimeout(avisoTimerRef.current);
    avisoTimerRef.current = setTimeout(() => setAviso(''), 2800);
  }, []);

  // Devuelve la tarjeta ya generada, o la genera una sola vez (deduplicando
  // llamadas concurrentes) y la deja cacheada para las próximas veces.
  // Incluye un tope de tiempo para que NUNCA quede colgado en "Generando…".
  const obtenerBlobTarjeta = useCallback((): Promise<Blob> => {
    if (tarjetaRef.current) {
      return Promise.resolve(tarjetaRef.current);
    }
    if (tarjetaPromesaRef.current) {
      return tarjetaPromesaRef.current;
    }

    const generacion = generarTarjeta(fotoSrc, estampillaSrc);

    const promesa = new Promise<Blob>((resolve, reject) => {
      const id = setTimeout(() => {
        reject(new Error('La generación de la tarjeta tardó demasiado'));
      }, 15000);

      generacion.then(
        (blob) => {
          clearTimeout(id);
          tarjetaRef.current = blob;
          resolve(blob);
        },
        (err) => {
          clearTimeout(id);
          reject(err);
        }
      );
    }).finally(() => {
      tarjetaPromesaRef.current = null;
    });

    tarjetaPromesaRef.current = promesa;
    return promesa;
  }, [estampillaSrc, fotoSrc]);

  // Feedback táctil al abrir el sobre (solo si el dispositivo lo soporta)
  const vibrar = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([0, 40, 60, 40]);
      } catch {
        /* algunos navegadores ignoran la vibración sin gesto */
      }
    }
  }, []);

  // Ráfaga corta de confetti sobre el sobre al abrirlo
  const lanzarConfetti = useCallback(() => {
    const contenedor = confettiRef.current;
    if (!contenedor || contenedor.dataset.activo === '1') return;

    contenedor.dataset.activo = '1';
    const piezas = Array.from(contenedor.querySelectorAll<HTMLElement>('.confetti-item'));
    piezas.forEach((pieza, i) => {
      pieza.style.animationDelay = `${(i % 6) * 0.07}s`;
      pieza.style.animationDuration = `${1.2 + (i % 5) * 0.18}s`;
    });
    contenedor.classList.add('is-active');

    window.setTimeout(() => {
      contenedor.classList.remove('is-active');
      delete contenedor.dataset.activo;
    }, 2600);
  }, []);

  const abrirSobre = useCallback(() => {
    if (abierto) return;
    setAbierto(true);
    reproducirWhoosh();
    vibrar();
    lanzarConfetti();
    iniciarAudio();
  }, [abierto, iniciarAudio, lanzarConfetti, vibrar]);

  const cerrarAmpliada = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAmpliada(false);
  }, []);

  const abrirAmpliada = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setAmpliada(true);
    setYaAbrioModal(true);
  }, []);

  // Descarga directa (se dispara de forma sincrónica para no perder el gesto del usuario)
  const descargarBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'detectives-5b.jpg';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    mostrarAviso('📸 Imagen descargada. ¡Compartila con la familia!');
  }, [mostrarAviso]);

  // Comparte la tarjeta como imagen: en mobile usa el share nativo del sistema
  // (que incluye WhatsApp); si no está disponible, la descarga.
  const compartirTarjeta = useCallback(async () => {
    if (compartiendo) return;
    setCompartiendo(true);

    let archivo: File;
    try {
      const blob = await obtenerBlobTarjeta();
      archivo = new File([blob], 'detectives-5b.jpg', { type: 'image/jpeg' });
    } catch {
      setCompartiendo(false);
      mostrarAviso('No se pudo generar la imagen. Probá de nuevo.');
      return;
    }

    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    let puedeCompartir = false;
    if (nav && typeof nav.share === 'function') {
      try {
        puedeCompartir =
          typeof nav.canShare !== 'function' || nav.canShare({ files: [archivo] });
      } catch {
        puedeCompartir = false;
      }
    }

    if (nav && puedeCompartir) {
      try {
        await nav.share({
          files: [archivo],
          title: '¡Caso Resuelto! · Detectives de 5.º B',
          text: '¡Misión cumplida! 🔎',
          url: shareUrl,
        });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          mostrarAviso('No se pudo compartir. Probá de nuevo.');
        }
      }
    } else {
      descargarBlob(archivo);
    }

    setCompartiendo(false);
  }, [compartiendo, descargarBlob, obtenerBlobTarjeta, mostrarAviso]);

  // Al abrir el sobre, espera a que termine de salir la foto (~1.7s) y abre el lightbox automáticamente
  useEffect(() => {
    if (!abierto) return;

    timerRef.current = setTimeout(() => {
      setAmpliada(true);
      setYaAbrioModal(true);
    }, 1800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [abierto]);

  // Pre-genera la tarjeta en segundo plano al abrir el sobre, para que al tocar
  // "Compartir" el archivo ya esté listo y responda al instante.
  useEffect(() => {
    if (!abierto || tarjetaRef.current) return;

    const id = window.setTimeout(() => {
      obtenerBlobTarjeta().catch(() => {
        /* si falla, se reintenta al tocar "Compartir" */
      });
    }, 800);

    return () => window.clearTimeout(id);
  }, [abierto, obtenerBlobTarjeta]);

  useEffect(() => {
    return () => {
      if (avisoTimerRef.current) clearTimeout(avisoTimerRef.current);
    };
  }, []);

  const onSobreKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!abierto) {
        abrirSobre();
      } else {
        abrirAmpliada();
      }
    }
  };

  const onFotoKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirAmpliada();
    }
  };

  return (
    <main className="stage" ref={stageRef}>
      <audio ref={audioRef} src={audioSrc} preload="auto" loop />

      {/* Ráfaga de confetti al abrir el sobre */}
      <Confetti className="stage-confetti" pieces={20} />

      {/* Cabecera con logo del colegio y título semántico SEO */}
      <header className="page-header" id="page-header">
        {/*<div className="brand-pill">
          <img
            src={estampillaSrc}
            alt="Logo Centro de Formación Integral"
            className="brand-logo"
            width={28}
            height={38}
          />
          <div className="brand-text">
            <span className="brand-school">Centro de Formación Integral</span>
            <span className="brand-sub">Misión Detectives · 5.º B</span>
          </div>
        </div>*/}
        <h1 className="sr-only">
          ¡Caso Resuelto! Los detectives de 5.º B del Centro de Formación Integral
        </h1>
      </header>

      {/* Control flotante de música */}
      {abierto && (
        <button
          type="button"
          className="sound-toggle"
          aria-label={sonando ? 'Pausar música' : 'Reproducir música'}
          onClick={toggleSonido}
          title={sonando ? 'Pausar música' : 'Reproducir música'}
        >
          {sonando ? '🎵 Música activada' : '🔇 Música pausada'}
        </button>
      )}

      {/* Sobre interactivo */}
      <div
        className={`envelope ${abierto ? 'is-open' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={abierto ? 'Ver foto y mensaje' : 'Abrir sobre'}
        onClick={() => {
          if (!abierto) {
            abrirSobre();
          } else {
            abrirAmpliada();
          }
        }}
        onKeyDown={onSobreKey}
      >
        <div
          className="card"
          role={abierto ? 'button' : undefined}
          tabIndex={abierto ? 0 : undefined}
          aria-label={abierto ? 'Ver foto en grande' : undefined}
          onClick={(e) => {
            if (!abierto) return;
            e.stopPropagation();
            abrirAmpliada();
          }}
          onKeyDown={(e) => {
            if (abierto) onFotoKey(e);
          }}
        >
          <img src={fotoSrc} alt="Foto de los detectives" draggable={false} />
        </div>
        <div className="flap" />
        <div className="body" />
        <img
          src={estampillaSrc}
          alt="Estampilla postal CFI"
          className="stamp"
          draggable={false}
        />

        {/* Solo muestra botón de abrir al inicio, y el botón de ver mensaje SOLO tras haber abierto el modal al menos una vez */}
        {!abierto ? (
          <p className="hint">Tocá para abrir</p>
        ) : yaAbrioModal && !ampliada ? (
          <button
            type="button"
            className="hint hint-open"
            onClick={(e) => {
              e.stopPropagation();
              abrirAmpliada();
            }}
          >
            🔍 Tocá para ver el mensaje
          </button>
        ) : null}
      </div>

      {ampliada && (
        <Lightbox
          src={fotoSrc}
          alt="Foto de los detectives"
          onClose={cerrarAmpliada}
          onShare={compartirTarjeta}
          compartiendo={compartiendo}
        />
      )}

      {aviso && (
        <div className="toast-aviso" role="status" aria-live="polite">
          {aviso}
        </div>
      )}
    </main>
  );
}
