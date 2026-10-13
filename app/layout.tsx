import type { Metadata, Viewport } from 'next';
import './envelope.css';

const siteUrl = 'https://detectives-cfi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '¡Caso Resuelto! · Detectives de 5.º B | Centro de Formación Integral',
  description:
    '¡Misión cumplida! Los detectives de 5.º B del Centro de Formación Integral descubrieron todos los misterios. Descubrí la foto grupal y el mensaje especial para las familias.',
  keywords: [
    'Detectives CFI',
    'Centro de Formación Integral',
    '5to B',
    'Caso Resuelto',
    'Misión Cumplida',
    'Colegio',
    'Educación',
    'Familia',
  ],
  authors: [{ name: 'Centro de Formación Integral' }],
  creator: 'Centro de Formación Integral',
  publisher: 'Centro de Formación Integral',
  icons: {
    icon: [
      { url: '/estampilla.png' },
      { url: '/estampilla.png', type: 'image/png' },
    ],
    shortcut: '/estampilla.png',
    apple: '/estampilla.png',
  },
  openGraph: {
    title: '🎉 ¡Caso Resuelto! · Detectives de 5.º B | Centro de Formación Integral',
    description:
      '¡Lo lograron! Descubrieron todos los misterios y encontraron la salida. Mirá la foto y el mensaje especial.',
    url: siteUrl,
    siteName: 'Centro de Formación Integral',
    locale: 'es_AR',
    type: 'website',
    // La imagen la genera automáticamente `app/opengraph-image.tsx` (1200x630)
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎉 ¡Caso Resuelto! · Detectives de 5.º B | CFI',
    description:
      'Los detectives del Centro de Formación Integral resolvieron el caso. ¡Misión cumplida!',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f2d9c2',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Detectives 5.º B - Centro de Formación Integral',
  url: siteUrl,
  description:
    'Plataforma de felicitación para los detectives de 5.º B del Centro de Formación Integral',
  inLanguage: 'es',
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'Centro de Formación Integral',
    logo: `${siteUrl}/estampilla.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/estampilla.png" type="image/png" />
        <link rel="apple-touch-icon" href="/estampilla.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
