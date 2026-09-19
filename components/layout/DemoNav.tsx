'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { LayoutDashboard, Smartphone, Compass, LogIn, ShieldAlert } from 'lucide-react';

export function DemoNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Landing Pública', icon: Compass, badge: 'Home' },
    { href: '/dashboard', label: 'Dashboard Dueño', icon: LayoutDashboard, badge: 'Roberto' },
    { href: '/app', label: 'Portal Miembro', icon: Smartphone, badge: 'María' },
    { href: '/login', label: 'Login', icon: LogIn, badge: 'Auth' },
    { href: '/admin', label: 'SuperAdmin', icon: ShieldAlert, badge: 'Nico' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE7DF] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#181D27] text-white shadow-sm'
                    : 'text-[#535862] hover:text-[#181D27] hover:bg-[#EBE7DF]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">{link.label}</span>
                <span className="md:hidden">{link.badge}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
