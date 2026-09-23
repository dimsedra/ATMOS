import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://atmos.world'),
  title: 'ATMOS - Atmosphere, not spectacle.',
  description:
    'ATMOS is a music and culture house. Independent voices, good music, and things to live in. Rooted in Seoul. At home everywhere. Atmosphere, not spectacle.',
  openGraph: {
    title: 'ATMOS - Atmosphere, not spectacle.',
    description: 'A music & culture house. Everywhere, by nature.',
    type: 'website',
    images: ['/images/atmos-hero.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#f2f1e9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400&family=Inter+Tight:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
