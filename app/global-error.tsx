'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-[#FAF8F5] text-[#181D27] min-h-screen flex items-center justify-center p-6 antialiased font-sans">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-5">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-[#181D27] mb-2 font-display">
            Error Crítico de Aplicación
          </h1>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Se produjo un problema crítico al cargar la plataforma. Hemos registrado el incidente de forma segura.
          </p>

          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F26522] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#d95516] transition-colors shadow-sm text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Recargar Sistema
          </button>
        </div>
      </body>
    </html>
  );
}
