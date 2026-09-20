'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserCheck,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface OwnerSidebarProps {
  gymName?: string;
  gymLocation?: string;
  atRiskCount?: number;
  highRiskCount?: number;
}

export function OwnerSidebar({
  gymName = 'Iron Strength',
  gymLocation = 'Medellín · Colombia',
  atRiskCount,
  highRiskCount,
}: OwnerSidebarProps) {
  const currentRiskCount = highRiskCount !== undefined ? highRiskCount : atRiskCount !== undefined ? atRiskCount : 0;
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = {
    operation: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Miembros', href: '/dashboard/members', icon: Users, badge: currentRiskCount > 0 ? currentRiskCount : undefined },
      { name: 'Rutinas', href: '/dashboard/routines', icon: Dumbbell },
      { name: 'Entrenadores', href: '/dashboard/trainers', icon: UserCheck },
    ],
    business: [
      { name: 'Reportes', href: '/dashboard/reports', icon: FileText },
      { name: 'Pagos', href: '/dashboard/payments', icon: CreditCard },
    ],
    general: [
      { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
      { name: 'Ayuda', href: '/dashboard/help', icon: HelpCircle },
    ],
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-[#EBE7DF] bg-[#FAF8F5] p-5 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-6">
        {/* Logo & Role Badge */}
        <div className="space-y-1">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-extrabold uppercase tracking-wider">
            OWNER
          </div>
        </div>

        {/* Gym Tenant Card Matching Image 1 */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
            GIMNASIO
          </div>
          <div className="text-xs font-bold text-[#181D27] mt-0.5 truncate">
            {gymName}
          </div>
          <div className="text-[11px] text-[#535862] truncate">
            {gymLocation}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 text-xs">
          {/* OPERACIÓN */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
              OPERACIÓN
            </div>
            {navItems.operation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-2xl transition-all ${
                    active
                      ? 'bg-[#F3EFEA] text-[#181D27] font-bold shadow-2xs'
                      : 'text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#181D27]' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-[#F26522] text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {item.badge}
                    </span>
                  )}
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

      {/* Bottom Session Box Matching Image 4 */}
      <div className="space-y-3 pt-4">
        <div className="p-3.5 rounded-2xl bg-[#181D27] text-white space-y-2 shadow-card">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
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
          <span>Owner</span>
        </div>
      </div>
    </aside>
  );
}
