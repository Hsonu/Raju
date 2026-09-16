import { Cormorant_Garamond, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Riddhi Computer — Laptop Sales & Repair Services in Kharghar, Navi Mumbai',
  description: 'Buy laptops, computers, accessories and get professional repair services at Riddhi Computer, Kharghar, Navi Mumbai. Home visit repair available.',
  keywords: 'laptop, computer, repair, Kharghar, Navi Mumbai, laptop repair, computer accessories, home visit repair',
  openGraph: {
    title: 'Riddhi Computer — Your Trusted Laptop & Computer Partner',
    description: 'Buy laptops, computers, accessories and get professional repair services at Riddhi Computer, Kharghar, Navi Mumbai.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Riddhi Computer',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E1C19',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${ibmPlex.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
