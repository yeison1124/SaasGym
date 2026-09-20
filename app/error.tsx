'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log interno o envío seguro a servicio de telemetría sin exponerlo al cliente
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-5">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-[#181D27] mb-2 font-display">
          Algo no salió como esperábamos
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Ha ocurrido un error inesperado al procesar tu solicitud. Por tu seguridad, los detalles técnicos han sido resguardados.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F26522] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#d95516] transition-colors shadow-sm text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-200 transition-colors text-sm"
          >
            <Home className="w-4 h-4" /> Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
