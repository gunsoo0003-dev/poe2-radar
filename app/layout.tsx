import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'POE2 SEARCH RADAR | Path of Exile 2 Trade Search Monitor',
    template: '%s | POE2 SEARCH RADAR',
  },
  description:
    'POE2 SEARCH RADAR is a Path of Exile 2 official trade search monitor. Register your POE2 trade search URL, watch new listings, and track lowest price changes while the web app is running.',
  keywords: [
    'POE2 SEARCH RADAR',
    'POE2 trade radar',
    'POE2 trade search monitor',
    'Path of Exile 2 trade search',
    'Path of Exile 2 trade monitor',
    'POE2 official trade search',
    'POE2 new listings',
    'POE2 lowest price changes',
    'POE2 거래소 감시',
    'POE2 거래소 검색',
    'POE2 공식 거래소',
    'POE2 신규 매물',
    'POE2 최저가 변화',
    '패스오브엑자일2 거래소',
    '패스오브엑자일2 검색조건',
  ],
  authors: [
    {
      name: 'POE2 SEARCH RADAR',
    },
  ],
  creator: 'POE2 SEARCH RADAR',
  publisher: 'POE2 SEARCH RADAR',
  applicationName: 'POE2 SEARCH RADAR',
  category: 'tool',
  metadataBase: new URL('https://poe2-search-radar.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'POE2 SEARCH RADAR | Path of Exile 2 Trade Search Monitor',
    description:
      'Register your POE2 official trade search URL, detect new listings, and monitor lowest price changes.',
    url: 'https://poe2-search-radar.com',
    siteName: 'POE2 SEARCH RADAR',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POE2 SEARCH RADAR | Path of Exile 2 Trade Search Monitor',
    description:
      'A Path of Exile 2 official trade search monitor for new listings and lowest price changes.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}