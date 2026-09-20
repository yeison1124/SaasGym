import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-5">
          <HelpCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-[#F26522] bg-orange-50 px-3 py-1 rounded-full inline-block mb-3">
          Error 404
        </span>

        <h1 className="text-2xl font-bold text-[#181D27] mb-2 font-display">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          La ruta a la que intentas acceder no existe o fue reubicada por seguridad.
        </p>

        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#F26522] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#d95516] transition-colors shadow-sm text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
