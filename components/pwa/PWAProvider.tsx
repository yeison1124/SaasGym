'use client';

import React, { useEffect, useState } from 'react';
import { registerServiceWorker, requestNotificationPermission } from '@/lib/pwa';
import { Download, WifiOff, X, Bell, Check, Smartphone } from 'lucide-react';

export function PWAProvider() {
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Registrar Service Worker
    registerServiceWorker();

    // 2. Comprobar si ya está instalado / modo standalone
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isAppStandalone);

    // 3. Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capturar evento de instalación de PWA (Android / Chrome / Desktop)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      if (!isAppStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detectar estado de conexión Online / Offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  return (
    <>
      {/* 1. Banner de Estado Offline */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md transition-transform duration-300">
          <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
            <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
            <span>
              <strong>Modo Sin Conexión activo:</strong> Podés seguir consultando tus rutinas y entrenamientos guardados.
            </span>
          </div>
        </div>
      )}

      {/* 2. Banner Flotante para Instalar App (iOS / Android) */}
      {showInstallBanner && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slide-up">
          <div className="bg-[#181D27] text-white p-4 rounded-2xl shadow-xl border border-slate-700/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26522] to-[#d95516] flex items-center justify-between p-2 flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white mx-auto" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">Instalá GymPulse</h4>
                <p className="text-xs text-slate-300">Acceso rápido y rutinas sin conexión.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-[#F26522] hover:bg-[#d95516] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Instalar
              </button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
