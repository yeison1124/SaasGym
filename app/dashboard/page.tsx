'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  Settings,
  Search,
  Bell,
  Activity,
  Trophy,
  AlertTriangle,
  DollarSign,
  Plus,
  CheckCircle2,
  UserCheck,
  LogOut,
  Building2,
  MapPin,
  MessageCircle,
  Phone,
  Filter,
  Shield,
} from 'lucide-react';
import { mockMembers } from '@/lib/mock-data';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'danger' | 'warning' | 'healthy'>('all');
  const [quickCheckinDone, setQuickCheckinDone] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [gymMembers, setGymMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*, gyms(*)')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
            if (profileData.gyms) {
              setGym(profileData.gyms);
              
              const { data: membersData } = await supabase
                .from('members')
                .select('*, profiles(*)')
                .eq('gym_id', profileData.gym_id);

              if (membersData && membersData.length > 0) {
                setGymMembers(membersData);
              } else {
                if (profileData.gyms.name?.toLowerCase().includes('iron')) {
                  setGymMembers(mockMembers);
                } else {
                  setGymMembers([]);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const filteredMembers = gymMembers
    .filter((m) => {
      if (selectedFilter === 'danger') return m.risk_band === 'en_riesgo';
      if (selectedFilter === 'warning') return m.risk_band === 'atencion';
      if (selectedFilter === 'healthy') return m.risk_band === 'saludable';
      return true;
    })
    .filter((m) => {
      if (!searchQuery.trim()) return true;
      return (
        m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const ownerFullName = profile?.full_name || 'Roberto Martínez';
  const ownerInitials = ownerFullName
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'RM';
  const ownerFirstName = ownerFullName.split(' ')[0] || 'Roberto';
  const gymDisplayName = gym?.name || 'Iron Strength Medellín';
  const gymPlan = (gym?.plan || 'starter').toUpperCase();
  const gymLocation = `${gym?.city || 'Medellín'}, ${gym?.country === 'CO' ? 'Colombia' : gym?.country === 'MX' ? 'México' : gym?.country === 'AR' ? 'Argentina' : gym?.country || 'LATAM'}`;

  // Métricas
  const totalMembersCount = gymMembers.length > 0 ? (gymMembers === mockMembers ? 284 : gymMembers.length) : 0;
  const inRiskCount = gymMembers.filter(m => m.risk_band === 'en_riesgo').length || (gymMembers === mockMembers ? 3 : 0);
  const avgScore = gymMembers.length > 0 ? Math.round(gymMembers.reduce((acc, m) => acc + (m.risk_score || 0), 0) / gymMembers.length) : (gymMembers === mockMembers ? 62 : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      {/* 1. LEFT SIDEBAR MENU (Matching Design System) */}
      <aside className="w-64 border-r border-[#EBE7DF] bg-[#FAF8F5] p-5 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Brand & Role Badge */}
          <div className="space-y-1">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-extrabold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              DUEÑO DE GIMNASIO
            </div>
          </div>

          {/* Tenant Gym Info Card */}
          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xs space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              GIMNASIO ACTIVO
            </div>
            <div className="text-xs font-bold text-[#181D27] truncate">
              {gymDisplayName}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#535862] pt-0.5">
              <span>{totalMembersCount} miembros</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#EBE7DF] text-[9px] font-black text-[#F26522]">
                {gymPlan}
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-5 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
                PLATAFORMA
              </div>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#F3EFEA] text-[#181D27] font-bold transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-[#181D27]" />
                Dashboard
              </Link>
              <a
                href="#miembros"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <Users className="w-4 h-4" />
                Miembros & Riesgo
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <Dumbbell className="w-4 h-4" />
                Rutinas
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <CalendarCheck className="w-4 h-4" />
                Asistencias
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
                NEGOCIO
              </div>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Pagos & Membresías
              </a>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Comunidad
              </a>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2">
                GENERAL
              </div>
              <a
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-[#535862] hover:text-[#181D27] hover:bg-[#F3EFEA] font-medium transition-all"
              >
                <Settings className="w-4 h-4" />
                Configuración
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom Active Session Widget */}
        <div className="p-3.5 rounded-2xl bg-[#181D27] text-white space-y-2 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <div className="text-[11px] font-bold text-[#F3EFEA]">Sesión activa</div>
          </div>
          <p className="text-[10px] text-[#9CA3AF] leading-tight">
            {ownerFullName}
          </p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-start gap-1.5 pt-1 text-[11px] font-semibold text-[#F26522] hover:text-[#FF8243] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar with Search, Notifications and Profile */}
        <header className="h-16 border-b border-[#EBE7DF] bg-[#FAF8F5] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar miembros por nombre o email..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:outline-none focus:border-[#181D27] shadow-2xs"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setQuickCheckinDone(true);
                setTimeout(() => setQuickCheckinDone(false), 2500);
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                quickCheckinDone
                  ? 'bg-[#ECFDF5] text-[#16A34A] border-[#16A34A]'
                  : 'bg-[#FFFFFF] hover:bg-[#F3EFEA] text-[#181D27] border-[#EBE7DF]'
              }`}
            >
              {quickCheckinDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  ¡Check-in registrado!
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#535862]" />
                  Check-in
                </>
              )}
            </button>

            <button className="p-2 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-[#535862] hover:text-[#181D27] shadow-2xs">
              <Bell className="w-4 h-4" />
            </button>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#EBE7DF]">
              <div className="w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {ownerInitials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#181D27] leading-tight">
                  {ownerFullName}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">
                  Dueño · {gymDisplayName.split(' ')[0]}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Cerrar sesión"
                className="p-2 rounded-full bg-[#FFFFFF] hover:bg-[#FEE4E2] text-[#535862] hover:text-[#D92D20] border border-[#EBE7DF] transition-all cursor-pointer ml-1 sm:hidden"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Top Operational Greeting */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F26522] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                RESUMEN OPERATIVO · {gymDisplayName.toUpperCase()}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#181D27]">
                Buen día, {ownerFirstName}.
              </h1>
              <p className="text-xs text-[#535862] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                {gymLocation} · Plan <strong className="text-[#181D27] font-bold">{gymPlan}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold shadow-sm transition-all">
                <Plus className="w-4 h-4" />
                Nuevo miembro
              </button>
            </div>
          </div>

          {/* The 4 Core Retention Metrics */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
              <div className="w-8 h-8 rounded-xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                SCORE PROMEDIO
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#181D27]">{avgScore}</span>
                <span className="text-xs font-semibold text-[#535862]">{avgScore > 50 ? 'Riesgo medio' : 'Saludable'}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center mb-3">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                RETENCIÓN MENSUAL
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#181D27]">{totalMembersCount > 0 ? '88%' : '100%'}</span>
                <span className="text-xs font-semibold text-[#16A34A]">Objetivo: 95%</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
              <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] text-[#535862] flex items-center justify-center mb-3 border border-[#EBE7DF]">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                MIEMBROS ACTIVOS
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#181D27]">{totalMembersCount}</span>
                <span className="text-xs font-semibold text-[#16A34A]">{gymDisplayName.split(' ')[0]}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center mb-3">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                ESTADO DE CUENTA
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#181D27] capitalize">{gym?.subscription_status || 'Trial'}</span>
                <span className="text-xs font-semibold text-[#535862]">Plan {gymPlan}</span>
              </div>
            </div>
          </section>

          {/* Retention Engine Priority Actions */}
          {gymMembers.length > 0 ? (
            <section className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#EBE7DF]">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F26522] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Motor de Retención · Para hacer hoy
                  </div>
                  <h2 className="text-2xl font-black text-[#181D27] mt-0.5">
                    Acciones prioritarias de retención
                  </h2>
                </div>
                <span className="text-xs text-[#535862]">
                  {inRiskCount} miembros críticos en <strong className="text-[#181D27]">{gymDisplayName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex flex-col justify-between hover:border-[#D6CEBF] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#F26522]">
                        Riesgo Alto 77/100
                      </span>
                      <span className="text-xs text-[#9CA3AF]">Hace 9 días</span>
                    </div>
                    <h3 className="text-base font-bold text-[#181D27] mt-3">Daniela Castro</h3>
                    <p className="text-xs text-[#535862] mt-0.5">
                      Sin asistir hace 9 días. Su cuota vence en 5 días y no completó su rutina.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#EBE7DF]">
                    <a
                      href={`https://wa.me/573124567890?text=Hola%20Daniela!%20Te%20escribimos%20de%20${encodeURIComponent(gymDisplayName)}.%20Notamos%20que%20hace%20d%C3%ADas%20no%20te%20vemos.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Abrir WhatsApp
                    </a>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex flex-col justify-between hover:border-[#D6CEBF] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#F26522]">
                        Riesgo Alto 68/100
                      </span>
                      <span className="text-xs text-[#9CA3AF]">Caída 60%</span>
                    </div>
                    <h3 className="text-base font-bold text-[#181D27] mt-3">Mariana Soto</h3>
                    <p className="text-xs text-[#535862] mt-0.5">
                      Frecuencia bajó 60% en las últimas dos semanas. Riesgo de enfriamiento.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#EBE7DF]">
                    <a
                      href={`https://wa.me/573152223344?text=Hola%20Mariana!%20Te%20dejamos%20un%20nuevo%20plan%20desde%20${encodeURIComponent(gymDisplayName)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF] text-xs font-bold text-center flex items-center justify-center gap-2 shadow-2xs transition-all"
                    >
                      <Dumbbell className="w-3.5 h-3.5 text-[#F26522]" />
                      Asignar nueva rutina
                    </a>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex flex-col justify-between hover:border-[#D6CEBF] transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#F26522]">
                        Riesgo Alto 82/100
                      </span>
                      <span className="text-xs text-[#F26522] font-semibold">Pago atrasado</span>
                    </div>
                    <h3 className="text-base font-bold text-[#181D27] mt-3">Pedro González</h3>
                    <p className="text-xs text-[#535862] mt-0.5">
                      Pago atrasado 12 días y no asiste desde hace 3 semanas.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#EBE7DF]">
                    <a
                      href={`https://wa.me/573109876543?text=Hola%20Pedro!%20Vimos%20que%20tu%20membres%C3%ADa%20en%20${encodeURIComponent(gymDisplayName)}%20est%C3%A1%20pendiente.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Llamar & Regularizar
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-8 sm:p-12 shadow-card text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-xl font-black text-[#181D27]">
                  ¡Tu gimnasio "{gymDisplayName}" está listo!
                </h3>
                <p className="text-xs text-[#535862] leading-relaxed">
                  Este tenant está completamente aislado en Supabase. En la siguiente fase podrás invitar a tus primeros entrenadores y miembros para que el motor de retención comience a operar en vivo.
                </p>
              </div>
              <div className="pt-2">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181D27] text-white text-xs font-bold shadow-sm hover:bg-[#2B313B] transition-all">
                  <Plus className="w-4 h-4" /> Crear mi primer miembro
                </button>
              </div>
            </section>
          )}

          {/* Members Table */}
          {gymMembers.length > 0 && (
            <section id="miembros" className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#181D27]">
                    Miembros de {gymDisplayName}
                  </h2>
                  <p className="text-xs text-[#535862] mt-0.5">
                    Monitoreo de asistencia, scores calculados y rutinas activas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedFilter === 'all'
                        ? 'bg-[#FFFFFF] text-[#181D27] shadow-2xs font-bold'
                        : 'text-[#535862] hover:text-[#181D27]'
                    }`}
                  >
                    Todos ({gymMembers.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('danger')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedFilter === 'danger'
                        ? 'bg-[#FFFFFF] text-[#F26522] shadow-2xs font-bold'
                        : 'text-[#535862] hover:text-[#F26522]'
                    }`}
                  >
                    🔴 En riesgo ({gymMembers.filter((m) => m.risk_band === 'en_riesgo').length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('warning')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedFilter === 'warning'
                        ? 'bg-[#FFFFFF] text-[#D97706] shadow-2xs font-bold'
                        : 'text-[#535862] hover:text-[#D97706]'
                    }`}
                  >
                    🟡 Atención ({gymMembers.filter((m) => m.risk_band === 'atencion').length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('healthy')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedFilter === 'healthy'
                        ? 'bg-[#FFFFFF] text-[#16A34A] shadow-2xs font-bold'
                        : 'text-[#535862] hover:text-[#16A34A]'
                    }`}
                  >
                    🟢 Saludables ({gymMembers.filter((m) => m.risk_band === 'saludable').length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                      <th className="pb-3 font-bold">Miembro</th>
                      <th className="pb-3 font-bold">Score de Riesgo</th>
                      <th className="pb-3 font-bold">Última Asistencia</th>
                      <th className="pb-3 font-bold">Estado de Pago</th>
                      <th className="pb-3 font-bold">Rutina Asignada</th>
                      <th className="pb-3 font-bold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE7DF]">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FAF8F5] transition-colors group">
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-[#181D27]">{m.full_name}</div>
                          <div className="text-[11px] text-[#9CA3AF]">{m.email}</div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              m.risk_band === 'en_riesgo'
                                ? 'bg-[#FFF4ED] text-[#F26522] border border-[#F26522]/20'
                                : m.risk_band === 'atencion'
                                ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#CA8A04]/20'
                                : 'bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/20'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                m.risk_band === 'en_riesgo'
                                  ? 'bg-[#F26522]'
                                  : m.risk_band === 'atencion'
                                  ? 'bg-[#CA8A04]'
                                  : 'bg-[#16A34A]'
                              }`}
                            />
                            {m.risk_score}/100
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-[#535862]">
                          {m.last_attendance ? m.last_attendance : `${m.days_since_last_visit} días`}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                              m.payment_status === 'overdue'
                                ? 'bg-[#FEF2F2] text-[#DC2626]'
                                : m.payment_status === 'due_soon'
                                ? 'bg-[#FEFCE8] text-[#CA8A04]'
                                : 'bg-[#ECFDF5] text-[#16A34A]'
                            }`}
                          >
                            {m.payment_status === 'overdue'
                              ? 'Vencido'
                              : m.payment_status === 'due_soon'
                              ? 'Por vencer'
                              : 'Al día'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-[#535862]">
                          {m.assigned_routine ? (
                            <span className="font-medium text-[#181D27]">{m.assigned_routine}</span>
                          ) : (
                            <span className="text-[#DC2626] font-semibold italic">Sin rutina</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => alert(`Abriendo detalle de ${m.full_name}`)}
                            className="px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#181D27] hover:text-white text-[#181D27] border border-[#EBE7DF] font-semibold text-[11px] transition-all cursor-pointer"
                          >
                            Ver perfil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
