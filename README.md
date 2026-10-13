# detectives-cfi

Experiencia web interactiva de felicitación para las familias de los detectives de **5.º B** del Centro de Formación Integral. Al tocar un sobre animado se abre una solapa 3D, sale la foto grupal, suena un "whoosh" con música de fondo y termina en una tarjeta festiva de "¡Caso Resuelto!".

## ✨ Funcionalidad

- **Sobre interactivo**: apertura de solapa con animación 3D y revelación de la foto.
- **Apertura automática del lightbox** tras la animación de salida de la foto.
- **Tarjeta de celebración** con mensaje para las familias (tipografía *Fredoka*).
- **Música de fondo** (`background.mp3`) con control flotante para pausar/reanudar.
- **Efecto de sonido de apertura** ("whoosh" sintetizado con Web Audio API, sin archivos extra).
- **Confetti** al abrir el sobre y lluvia festiva dentro del modal (componente reutilizable).
- **Compartir / descargar la tarjeta** como imagen PNG generada en `<canvas>` vía `navigator.share` (fallback a descarga).
- **Compartir el link** de la app (Web Share API, fallback a copiar al portapapeles).
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
  foto.jpg, foto.svg, estampilla.png, background.webp, background.mp3
```

## ♿ Notas de accesibilidad

- El sobre y la foto son operables con teclado (`Enter` / `Espacio`).
- Las acciones de compartir anuncian su resultado vía un aviso `aria-live="polite"`.
- Con `prefers-reduced-motion` se desactivan las animaciones.

## 📄 Estado del proyecto

Ver [`ROADMAP.md`](ROADMAP.md) para el progreso y los próximos pasos.
