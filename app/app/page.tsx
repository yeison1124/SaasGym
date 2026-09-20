'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/member');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-3 border-[#181D27] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[#535862]">Cargando portal del miembro...</p>
      </div>
    </div>
  );
}
