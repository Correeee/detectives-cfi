'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Lightbox from '../components/Lightbox';

// Foto grupal de los detectives (ubicada en /public/foto.jpg)
const FOTO = { src: '/foto.jpg', alt: 'Foto de los detectives' };

export default function Page() {
  const [abierto, setAbierto] = useState(false);
  const [ampliada, setAmpliada] = useState(false);
  const [sonando, setSonando] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const iniciarAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setSonando(true))
        .catch((err) => {
          console.warn('Audio play error:', err);
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
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setSonando(false);
    }
  }, []);

  const abrirSobre = useCallback(() => {
    if (abierto) return;
    setAbierto(true);
    iniciarAudio();
  }, [abierto, iniciarAudio]);

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
  }, []);

  // Al abrir el sobre, espera a que termine de salir la foto (~1.7s) y abre el lightbox automáticamente
  useEffect(() => {
    if (!abierto) return;

    timerRef.current = setTimeout(() => {
      setAmpliada(true);
    }, 1800);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [abierto]);

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
    <main className="stage">
      <audio ref={audioRef} src="/background.mp3" preload="auto" loop />

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
          <img src={FOTO.src} alt={FOTO.alt} draggable={false} />
        </div>
        <div className="flap" />
        <div className="body" />
        {!abierto ? (
          <p className="hint">Tocá para abrir</p>
        ) : (
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
        )}
      </div>

      {ampliada && (
        <Lightbox src={FOTO.src} alt={FOTO.alt} onClose={cerrarAmpliada} />
      )}
    </main>
  );
}
