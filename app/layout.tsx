import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digitalisierungs-Landkarte Niedersachsen',
  description: 'Interaktive Karte der Digitalisierungsakteure in Niedersachsen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
