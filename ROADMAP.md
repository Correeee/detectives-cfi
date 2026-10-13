# Roadmap de Desarrollo — Detectives CFI (5.º B)

## 📋 Estado General del MVP
- Progreso Estimado: 100%
- Objetivo: Experiencia interactiva para las familias de los alumnos de 5.º B con apertura de sobre animada, revelación de foto grupal, música de fondo, mensaje festivo de "Caso Resuelto" y despliegue nativo en Vercel.

## 🚧 En Progreso / Siguiente
- [ ] Migrar las imágenes públicas a `next/image` para optimización automática (LCP).
- [ ] Aligerar los binarios: recomprimir `background.mp3` (3.5 MB) y `estampilla.png` (408 KB); evaluar si `foto.svg` (439 KB) es necesario.
- [ ] Aligerar `background.webp` (~427 KB) reimplementándolo como patrón SVG propio.
- [ ] Manifest PWA (`manifest.webmanifest` + íconos) para "Agregar a pantalla de inicio".
- [ ] Analytics liviano (Vercel Analytics) para medir visitas de las familias.
- [ ] `robots.txt` y `sitemap.xml` para completar el SEO técnico.

## ✅ Completado
- [x] Estructura base de Next.js y diseño de sobre con solapa interactiva.
- [x] Animación fluida de apertura de solapa y desplazamiento de la tarjeta.
- [x] Integración de la fotografía grupal de los detectives en `/public/foto.jpg`.
- [x] Apertura automática del lightbox tras la animación de salida de la foto.
- [x] Tarjeta de celebración con mensaje festivo y tipografía infantil/moderna (*Fredoka*).
- [x] Adaptabilidad completa y legibilidad óptima en desktop y mobile.
- [x] Lluvia festiva de confetti animado en el fondo del modal.
- [x] Integración de la estampilla postal del CFI pegada al sobre con sombreado realista y ajuste responsive.
- [x] Botón interactivo "Tocá para ver el mensaje" al abrir el sobre, configurado para aparecer **únicamente tras haber abierto el modal al menos una vez**.
- [x] Música de fondo interactiva (`background.mp3`) con control flotante para pausar/reanudar.
- [x] Logo del colegio en cabecera de la página, en el informe de detectives y favicon de pestaña.
- [x] Optimización SEO completa: Open Graph, Twitter Cards, Schema.org estructurado, metadatos descriptivos y tags semánticos.
- [x] Fondo temático de detectives (`background.webp`) aplicado como patrón repetido de toda la app, con velo cálido radial y ajuste para iOS/Safari.
- [x] Configuración optimizada para Vercel: rutas nativas en la raíz (`/`), metadatos hacia `detectives-cfi.vercel.app` y eliminación del prefijo de subdirectorio.
- [x] Componente `Confetti` reutilizable, extraído del lightbox para usarse también en la apertura.
- [x] Efecto de sonido "whoosh" al abrir el sobre (Web Audio API), sincronizado con la animación de apertura.
- [x] Ráfaga corta de confetti sobre el escenario en el instante de apertura del sobre.
- [x] Compartir/descargar la tarjeta final como imagen JPEG generada en canvas (`navigator.share` con fallback a descarga), con botón único estilo WhatsApp.
- [x] Imagen OpenGraph generada en runtime (`app/opengraph-image.tsx`, 1200x630) para una preview atractiva al compartir por WhatsApp.
- [x] Aviso flotante (toast) accesible para dar feedback de las acciones de compartir.
- [x] Feedback háptico (vibración) al abrir el sobre en dispositivos compatibles.
- [x] Sello "RESUELTO" animado que cae sobre la foto en el modal.
- [x] Micro-sacudida del sobre cerrado para reforzar la llamada a la acción.
- [x] Focus trap en el lightbox para contener el foco con teclado.
- [x] Pantalla de carga con barra de progreso que precarga foto, estampilla, fondo y audio, y avanza sola al completar (con red de seguridad de 12s).
- [x] Progreso combinado: piso real (recursos cargados) + avance automático creíble hasta 95%; salta a 100% solo cuando todo termina (evita quedar clavado en 75%).
- [x] Uso de `foto.webp` (322 KB) en vez de `foto.jpg` (657 KB) en la experiencia del cliente.
- [x] Texto de carga simple con puntos suspensivos animados ("Cargando · Cargando. · Cargando.. · Cargando...") y barra de progreso (se descartaron las frases rotativas a pedido).

*Última actualización: 13 de Octubre de 2026 (Pantalla de carga con mensajes rotativos temáticos que da paso automático al sobre, y foto principal en WebP)*
