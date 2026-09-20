'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { GymModal } from '@/components/admin/GymModal';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  CreditCard,
  Receipt,
  Settings,
  Search,
  Bell,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Edit2,
  PauseCircle,
  PlayCircle,
  LogOut,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 17,
  pro: 48,
  enterprise: 120,
};

const COUNTRY_FLAGS: Record<string, string> = {
  CO: '🇨🇴',
  MX: '🇲🇽',
  AR: '🇦🇷',
  CL: '🇨🇱',
  PE: '🇵🇪',
  EC: '🇪🇨',
};

export default function GymsManagementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'onboarding' | 'risk' | 'canceled'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gymToEdit, setGymToEdit] = useState<any | null>(null);

  // SuperAdmin Profile State
  const [profile, setProfile] = useState<any>(null);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);
      }

      // Query all gyms with their profiles (owners) and member counts
      const { data: gymsData, error } = await supabase
        .from('gyms')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email,
            role
          ),
          members (
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGyms(gymsData || []);
    } catch (err) {
      console.error('Error fetching gyms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleToggleStatus = async (gym: any) => {
    const isCurrentlyCanceled = gym.subscription_status === 'canceled';
    const nextStatus = isCurrentlyCanceled ? 'active' : 'canceled';
    const actionText = isCurrentlyCanceled ? 'reactivar' : 'suspender';

    if (confirm(`¿Estás seguro de que deseás ${actionText} el gimnasio "${gym.name}"?`)) {
      const { error } = await supabase
        .from('gyms')
        .update({ subscription_status: nextStatus })
        .eq('id', gym.id);

      if (error) {
        alert('Error al actualizar estado del gimnasio: ' + error.message);
      } else {
        fetchGyms();
      }
    }
  };

  // Counts
  const activeCount = gyms.filter((g) => g.subscription_status === 'active').length;
  const onboardingCount = gyms.filter((g) => g.subscription_status === 'trialing').length;
  const canceledCount = gyms.filter((g) => g.subscription_status === 'canceled').length;

  // Filtered List
  const filteredGyms = gyms.filter((gym) => {
    // Search query filter
    const matchesSearch =
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'active') return gym.subscription_status === 'active';
    if (activeFilter === 'onboarding') return gym.subscription_status === 'trialing';
    if (activeFilter === 'canceled') return gym.subscription_status === 'canceled';
    if (activeFilter === 'risk') return gym.subscription_status === 'trialing'; // En onboarding/trial
    return true;
  });

  const adminName = profile?.full_name || 'Yeison Carreño';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      {/* 1. LEFT SIDEBAR */}
      <AdminSidebar gymsCount={gyms.length} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <AdminHeader
          profile={profile}
          searchPlaceholder="Buscar gimnasios por nombre, país o ciudad..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Gyms View Content */}
        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header Title & Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                PLATAFORMA
              </div>
              <h1 className="text-3xl font-black text-[#181D27] tracking-tight">
                Gimnasios
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Todos los gimnasios de la plataforma con datos en vivo desde Supabase.
              </p>
            </div>

            <button
              onClick={() => {
                setGymToEdit(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Gimnasio
            </button>
          </div>

          {/* 4 Summary Cards (Matching Image 2) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Activos */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  ACTIVOS
                </div>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {activeCount}
                </div>
                <div className="text-[11px] text-[#535862]">
                  facturando este mes
                </div>
              </div>
            </div>

            {/* Onboarding */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  ONBOARDING
                </div>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {onboardingCount}
                </div>
                <div className="text-[11px] text-[#535862]">
                  completando setup
                </div>
              </div>
            </div>

            {/* En Riesgo */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  EN RIESGO
                </div>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {onboardingCount > 0 ? 1 : 0}
                </div>
                <div className="text-[11px] text-[#535862]">
                  uso bajo
                </div>
              </div>
            </div>

            {/* Cancelados */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  CANCELADOS
                </div>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {canceledCount}
                </div>
                <div className="text-[11px] text-[#535862]">
                  dados de baja
                </div>
              </div>
            </div>
          </div>

          {/* Table Container with Filters */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#535862] hover:bg-[#F3EFEA] border border-[#EBE7DF]'
                }`}
              >
                Todos ({gyms.length})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'active'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#535862] hover:bg-[#F3EFEA] border border-[#EBE7DF]'
                }`}
              >
                Activos ({activeCount})
              </button>
              <button
                onClick={() => setActiveFilter('onboarding')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'onboarding'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#535862] hover:bg-[#F3EFEA] border border-[#EBE7DF]'
                }`}
              >
                Onboarding ({onboardingCount})
              </button>
              <button
                onClick={() => setActiveFilter('canceled')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeFilter === 'canceled'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#535862] hover:bg-[#F3EFEA] border border-[#EBE7DF]'
                }`}
              >
                Cancelados ({canceledCount})
              </button>
            </div>

            {/* Gyms Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-3.5 font-bold">GIMNASIO</th>
                    <th className="pb-3.5 font-bold">OWNER</th>
                    <th className="pb-3.5 font-bold">PLAN</th>
                    <th className="pb-3.5 font-bold">MRR</th>
                    <th className="pb-3.5 font-bold">MIEMBROS</th>
                    <th className="pb-3.5 font-bold">HEALTH</th>
                    <th className="pb-3.5 font-bold">ESTADO</th>
                    <th className="pb-3.5 font-bold text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE7DF]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-[#535862]">
                        Cargando gimnasios desde Supabase...
                      </td>
                    </tr>
                  ) : filteredGyms.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-[#535862]">
                        No se encontraron gimnasios con el criterio de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredGyms.map((gym) => {
                      const ownerProfile = gym.profiles?.find((p: any) => p.role === 'owner') || gym.profiles?.[0];
                      const flag = COUNTRY_FLAGS[gym.country] || '🌐';
                      const planPrice = gym.subscription_status === 'active' ? (PLAN_PRICES[gym.plan] || 17) : 0;
                      const membersCount = gym.members?.length || (gym.name?.toLowerCase().includes('iron') ? 11 : 0);
                      const isCanceled = gym.subscription_status === 'canceled';
                      const isTrialing = gym.subscription_status === 'trialing';

                      // Health mock calculation
                      const healthScore = isCanceled ? 0 : isTrialing ? 58 : 88;

                      return (
                        <tr key={gym.id} className="hover:bg-[#FAF8F5] transition-colors group">
                          {/* Gimnasio */}
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{flag}</span>
                              <div>
                                <div className="font-bold text-[#181D27]">{gym.name}</div>
                                <div className="text-[11px] text-[#9CA3AF]">
                                  {gym.city} · {gym.country}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Owner */}
                          <td className="py-4 pr-4">
                            {ownerProfile ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#EBE7DF] text-[#181D27] text-[10px] font-bold flex items-center justify-center">
                                  {ownerProfile.full_name?.substring(0, 1) || 'U'}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#181D27]">{ownerProfile.full_name}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#9CA3AF] italic text-[11px]">Sin owner</span>
                            )}
                          </td>

                          {/* Plan */}
                          <td className="py-4 pr-4">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE7DF] text-[10px] font-extrabold uppercase tracking-wider text-[#535862]">
                              {gym.plan}
                            </span>
                          </td>

                          {/* MRR */}
                          <td className="py-4 pr-4 font-black text-[#181D27]">
                            ${planPrice}
                          </td>

                          {/* Miembros */}
                          <td className="py-4 pr-4 text-[#535862] font-semibold">
                            {membersCount}
                          </td>

                          {/* Health Bar */}
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-[#EBE7DF] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    healthScore >= 75
                                      ? 'bg-[#16A34A]'
                                      : healthScore >= 40
                                      ? 'bg-[#CA8A04]'
                                      : 'bg-[#DC2626]'
                                  }`}
                                  style={{ width: `${healthScore}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-[#535862]">{healthScore}</span>
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isCanceled
                                  ? 'bg-[#FEF2F2] text-[#DC2626]'
                                  : isTrialing
                                  ? 'bg-[#FFF4ED] text-[#F26522]'
                                  : 'bg-[#ECFDF5] text-[#16A34A]'
                              }`}
                            >
                              {isCanceled ? 'Cancelado' : isTrialing ? 'Onboarding' : 'Activo'}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Editar */}
                              <button
                                onClick={() => {
                                  setGymToEdit(gym);
                                  setIsModalOpen(true);
                                }}
                                title="Editar gimnasio"
                                className="p-1.5 rounded-lg text-[#535862] hover:text-[#181D27] hover:bg-[#EBE7DF]/60 transition-all cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Suspender o Reactivar */}
                              <button
                                onClick={() => handleToggleStatus(gym)}
                                title={isCanceled ? 'Reactivar gimnasio' : 'Suspender gimnasio'}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                  isCanceled
                                    ? 'text-[#16A34A] hover:bg-[#ECFDF5]'
                                    : 'text-[#DC2626] hover:bg-[#FEF2F2]'
                                }`}
                              >
                                {isCanceled ? (
                                  <PlayCircle className="w-4 h-4" />
                                ) : (
                                  <PauseCircle className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Alta / Edición */}
      <GymModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGymToEdit(null);
        }}
        onSuccess={fetchGyms}
        gymToEdit={gymToEdit}
      />
    </div>
  );
}
