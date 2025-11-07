'use client';

import { useState } from 'react';

export default function InteractiveMap() {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Digitalisierungsakteure Niedersachsen</h1>
        <p className="text-sm mt-1">Karte und Verzeichnis</p>
      </div>
      
      <div className="flex-1 flex gap-4 p-4">
        <div className="flex-1 bg-white rounded-lg shadow">
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Karte wird geladen...</p>
          </div>
        </div>
        
        <div className="w-80 bg-white rounded-lg shadow p-4">
          <h2 className="font-bold text-lg mb-4">Akteure</h2>
          <p className="text-gray-500 text-sm">Daten werden geladen...</p>
        </div>
      </div>
    </div>
  );
}
