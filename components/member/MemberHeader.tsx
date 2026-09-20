'use client';

import { useState } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface MemberHeaderProps {
  gymName?: string;
  memberName?: string;
}

export function MemberHeader({ gymName = 'Iron Strength', memberName = 'María Jiménez' }: MemberHeaderProps) {
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-[#FAF8F5] border-b border-[#E9EAEB] px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A4A7AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar rutinas, ejercicios o clases..."
            className="w-full pl-10 pr-4 py-2 bg-white/90 border border-[#D5D7DA] rounded-full text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white transition shadow-xs"
          />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full border border-[#D5D7DA] bg-white flex items-center justify-center text-[#535862] hover:text-[#181D27] hover:bg-neutral-50 transition shadow-xs relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#F26522] absolute top-2 right-2 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl p-4 shadow-xl border border-[#E9EAEB] space-y-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2F4F7]">
                <span className="text-xs font-bold text-[#181D27]">Notificaciones</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">1 nueva</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#181D27]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>Clase confirmada</span>
                </div>
                <p className="text-[#535862] text-[11px]">
                  Tenés reservada tu sesión de Funcional HIIT para este viernes a las 10:00 AM.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Member Profile Avatar & Info */}
        <Link href="/member/settings" className="flex items-center gap-2.5 pl-1 group">
          <div className="w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center overflow-hidden border border-neutral-200 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt={memberName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#181D27] group-hover:text-[#F26522] transition leading-tight">
              {memberName}
            </div>
            <div className="text-[10px] text-[#717680] leading-tight">
              {gymName}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
