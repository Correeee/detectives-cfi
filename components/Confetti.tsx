const PIEZAS_POR_DEFECTO = 24;

type Props = {
    /** Cantidad de piezas de confetti a renderizar */
    pieces?: number;
    /** Clase contenedora (por defecto `confetti-rain`) */
    className?: string;
};

/**
 * Lluvia de confetti reutilizable.
 * Se usa tanto dentro del lightbox como en la ráfaga al abrir el sobre.
 */
export default function Confetti({ pieces = PIEZAS_POR_DEFECTO, className = 'confetti-rain' }: Props) {
    return (
        <div className={className} aria-hidden="true">
            {Array.from({ length: pieces }).map((_, i) => (
                <span key={i} className={`confetti-item confetti-c${(i % 6) + 1}`} />
            ))}
        </div>
    );
}
