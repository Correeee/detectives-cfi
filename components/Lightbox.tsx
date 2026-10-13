'use client';

import { useEffect, useRef } from 'react';
import Confetti from './Confetti';

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
  /** Comparte o descarga la tarjeta como imagen */
  onShare: () => void | Promise<void>;
  /** Indica si la tarjeta se está generando */
  compartiendo?: boolean;
};

export default function Lightbox({
  src,
  alt,
  onClose,
  onShare,
  compartiendo = false,
}: Props) {
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
      <Confetti />

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

          <div className="lightbox-actions">
            <button
              type="button"
              className="lightbox-action whatsapp"
              onClick={onShare}
              disabled={compartiendo}
              aria-label="Compartir la tarjeta por WhatsApp"
            >
              {compartiendo ? (
                '🎨 Generando…'
              ) : (
                <>
                  <svg
                    className="wa-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"
                    />
                  </svg>
                  Compartir tarjeta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
