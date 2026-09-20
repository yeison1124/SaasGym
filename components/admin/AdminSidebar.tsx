'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  gymsCount?: number;
  usersCount?: number;
}

export function AdminSidebar({ gymsCount = 0, usersCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = {
    platform: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Gimnasios', href: '/admin/gyms', icon: Building2 },
      { name: 'Usuarios', href: '/admin/users', icon: Users },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
    business: [
      { name: 'Planes', href: '/admin/plans', icon: CreditCard },
      { name: 'Facturación', href: '/admin/billing', icon: Receipt },
    ],
    general: [
      { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ],
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-[#EBE7DF] bg-[#FAF8F5] p-5 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Logo & SuperAdmin Badge */}
        <div className="space-y-1">
          <Link href="/admin">
            <Logo />
          </Link>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-extrabold uppercase tracking-wider">
            ⭐ SUPERADMIN
          </div>
        </div>

        {/* Internal Console Card */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            CONSOLA INTERNA
          </div>
          <div className="text-xs font-bold text-[#181D27] mt-0.5">
            GymPulse Platform
          </div>
          <div className="text-[11px] text-[#535862]">
            {gymsCount > 0 ? `${gymsCount} gimnasios` : 'Plataforma activa'}
            {usersCount > 0 ? ` · ${usersCount} miembros` : ''}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 text-xs">
          {/* PLATAFORMA */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
              PLATAFORMA
            </div>
            {navItems.platform.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all ${
                    active
                      ? 'bg-[#F3EFEA] text-[#181D27] font-bold shadow-2xs'
                      : 'text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#181D27]' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* NEGOCIO */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
              NEGOCIO
            </div>
            {navItems.business.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all ${
                    active
                      ? 'bg-[#F3EFEA] text-[#181D27] font-bold shadow-2xs'
                      : 'text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#181D27]' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* GENERAL */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
              GENERAL
            </div>
            {navItems.general.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all ${
                    active
                      ? 'bg-[#F3EFEA] text-[#181D27] font-bold shadow-2xs'
                      : 'text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#181D27]' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Session Box Matching Image 2 & 3 */}
      <div className="space-y-3 pt-4">
        <div className="p-3.5 rounded-2xl bg-[#181D27] text-white space-y-2 shadow-card">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F26522]" />
            Sesión activa
          </div>
          <div className="text-[10px] text-[#9CA3AF]">
            Vas a volver al inicio.
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2A303C] hover:bg-[#374151] text-white text-[11px] font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>

        <div className="text-[10px] text-[#9CA3AF] px-2 flex justify-between items-center">
          <span>GymPulse v1.0.0</span>
          <span>Prod</span>
        </div>
      </div>
    </aside>
  );
}
