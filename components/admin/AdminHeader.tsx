'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, Bell, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  profile?: any;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export function AdminHeader({
  profile,
  searchPlaceholder = 'Buscar gimnasios o usuarios...',
  onSearchChange,
  searchValue,
}: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const adminName = profile?.full_name || 'Yeison Carreño';
  const adminInitials =
    adminName
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'YC';

  return (
    <header className="h-16 border-b border-[#EBE7DF] bg-[#FAF8F5] px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:outline-none focus:border-[#181D27] shadow-2xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-[#535862] hover:text-[#181D27] shadow-2xs">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {adminInitials}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-[#181D27]">{adminName}</div>
            <div className="text-[10px] text-[#9CA3AF]">SuperAdmin</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          title="Cerrar sesión"
          className="p-2 rounded-full bg-[#FFFFFF] hover:bg-[#FEE4E2] text-[#535862] hover:text-[#D92D20] border border-[#EBE7DF] transition-all cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
