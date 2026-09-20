'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutGrid,
  TrendingUp,
  Calendar,
  Users,
  Trophy,
  Dumbbell,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Activity
} from 'lucide-react';

interface MemberSidebarProps {
  gymName?: string;
  memberName?: string;
}

export function MemberSidebar({ gymName = 'Iron Strength', memberName = 'María Jiménez' }: MemberSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/member', icon: LayoutGrid },
    { label: 'Progreso', href: '/member/progress', icon: TrendingUp },
    { label: 'Agenda', href: '/member/schedule', icon: Calendar },
    { label: 'Comunidad', href: '/member/community', icon: Users },
    { label: 'Logros', href: '/member/achievements', icon: Trophy },
    { label: 'Plan de entreno', href: '/member/workout', icon: Dumbbell },
    { label: 'Encuestas', href: '/member/surveys', icon: MessageSquare }
  ];

  const generalItems = [
    { label: 'Configuración', href: '/member/settings', icon: Settings },
    { label: 'Ayuda', href: '/member/help', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-[#FAF8F5] border-r border-[#E9EAEB] flex flex-col justify-between shrink-0 select-none min-h-screen">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-[#181D27] text-white flex items-center justify-center font-black text-base shadow-sm">
            <Activity className="w-5 h-5 text-[#F26522]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#181D27] block leading-none">
              GymPulse
            </span>
            <span className="text-[10px] font-bold text-[#535862] tracking-wider uppercase block mt-1">
              MEMBER
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 pt-1">
          {/* Main Menu */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-[#717680] uppercase tracking-wider">
                MENÚ PRINCIPAL
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/member' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F4ECE1] text-[#181D27] font-bold shadow-xs'
                        : 'text-[#535862] hover:bg-[#F2ECE4]/70 hover:text-[#181D27]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#181D27]' : 'text-[#717680]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* General Menu */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-[#717680] uppercase tracking-wider">
                GENERAL
              </span>
            </div>
            <nav className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#F4ECE1] text-[#181D27] font-bold shadow-xs'
                        : 'text-[#535862] hover:bg-[#F2ECE4]/70 hover:text-[#181D27]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#181D27]' : 'text-[#717680]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Session Box */}
      <div className="p-4">
        <div className="bg-[#181D27] rounded-2xl p-4 text-white space-y-3 shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-white">Sesión activa</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">Vas a volver al inicio.</p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white pt-2 border-t border-neutral-700/60 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
