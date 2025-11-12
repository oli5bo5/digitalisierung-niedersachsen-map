```typescript
'use client';

import Link from 'next/link';
import { Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNav() {
  const handleExport = () => {
    // TODO: CSV/JSON Export implementieren
    console.log('Export triggered');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400" />
            <span className="hidden font-semibold text-lg md:inline-block">
              Digitalisierungs-Landkarte Niedersachsen
            </span>
            <span className="font-semibold text-lg md:hidden">
              Digi-Map NS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Karte
          </Link>
          <Link 
            href="/liste" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Liste
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Über das Projekt
          </Link>
          <Link 
            href="/feedback" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Feedback
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="hidden sm:flex"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
