'use client';

import { useEffect, useRef } from 'react';
import { getAssetPath } from '../app/basePath';

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

const CONFETTI_PIECES = 24;

export default function Lightbox({ src, alt, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="¡Caso Resuelto! - 5.º B"
      onClick={onClose}
    >
      {/* Lluvia festiva de confetti en el fondo */}
      <div className="confetti-rain" aria-hidden="true">
        {Array.from({ length: CONFETTI_PIECES }).map((_, i) => (
          <span key={i} className={`confetti-item confetti-c${(i % 6) + 1}`} />
        ))}
      </div>

      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        aria-label="Cerrar"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-photo-side">
          <img
            src={src}
            alt={alt}
            className="lightbox-photo"
            draggable={false}
          />
        </div>

        <div className="celebration-side">
          <div className="celebration-badge-case">
            <span>INFORME DE LOS DETECTIVES · 5.º B</span>
          </div>
          <h2 className="celebration-title">
            🎉 ¡CASO RESUELTO! 🎉
          </h2>

          <p className="celebration-highlight">
            ¡LO LOGRARON! 🔎 ¡DESCUBRIERON TODOS LOS MISTERIOS Y ENCONTRARON LA SALIDA!
          </p>

          <p className="celebration-family">
            💖 GRACIAS, FAMILIAS, POR ACOMPAÑARNOS SIEMPRE Y SER PARTE DE ESTA GRAN AVENTURA.
          </p>

          <div className="celebration-badge-mission">
            🥳 ¡MISIÓN CUMPLIDA! 🥳
          </div>

          <div className="celebration-grade">
            ¡5.º B! ❤️
          </div>
        </div>
      </div>
    </div>
  );
}
