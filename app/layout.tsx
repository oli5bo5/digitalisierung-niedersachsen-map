import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Digitalisierungsakteure Niedersachsen',
  description: 'Manus Interactive Map - Digitalisierungsakteure in Niedersachsen mit CRUD-Funktionalität',
}

// FORCE VERCEL CACHE BYPASS - Layout v3.0 - MANUS VERSION
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
