import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { TopNav } from '@/components/Navigation/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digitalisierungs-Landkarte Niedersachsen',
  description: 'Interaktive Karte der Digitalisierungsakteure in Niedersachsen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <TopNav />
        <main className="h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
