'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import { MemberModal } from '@/components/dashboard/MemberModal';
import { MemberDetailDrawer } from '@/components/dashboard/MemberDetailDrawer';
import {
  Users,
  Search,
  Plus,
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Dumbbell,
  Filter,
  Eye,
} from 'lucide-react';

export default function OwnerMembersPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') === 'risk' ? 'risk' : 'all';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'risk' | 'past_due' | 'paused' | 'new'>(
    initialFilter as any
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<any | null>(null);

  // Drawer State
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadMembersData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileData) setProfile(profileData);

      const gymId = profileData?.gym_id || 'a0000000-0000-0000-0000-000000000001';

      const { data: gymData } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gymId)
        .single();
      if (gymData) setGym(gymData);

      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select(`
          *,
          profiles:assigned_trainer_id (id, full_name, email),
          routines:assigned_routine_id (id, name, level)
        `)
        .eq('gym_id', gymId)
        .order('risk_score', { ascending: false });
      if (membersData) setMembers(membersData);

      // Fetch trainers
      const { data: trainersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('gym_id', gymId)
        .eq('role', 'trainer');
      if (trainersData) setTrainers(trainersData);

      // Fetch routines
      const { data: routinesData } = await supabase
        .from('routines')
        .select('*')
        .eq('gym_id', gymId);
      if (routinesData) setRoutines(routinesData);
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembersData();
  }, []);

  const handleOpenAddModal = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: any) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const handleOpenDrawer = (member: any) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Email', 'Telefono', 'Estado', 'Score de Riesgo', 'Objetivo', 'Entrenador', 'Rutina'];
    const rows = filteredMembers.map((m) => [
      `"${m.full_name}"`,
      `"${m.email}"`,
      `"${m.phone || ''}"`,
      `"${m.status}"`,
      m.risk_score,
      `"${m.goal || ''}"`,
      `"${m.profiles?.full_name || 'Sin asignar'}"`,
      `"${m.routines?.name || 'Sin asignar'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `miembros_${gym?.name || 'gym'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      (m.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.profiles?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'active') return m.status === 'active';
    if (activeFilter === 'risk') return m.risk_score >= 40;
    if (activeFilter === 'past_due') return new Date(m.membership_expires_at) < new Date() || m.status === 'churned';
    if (activeFilter === 'paused') return m.status === 'paused';
    if (activeFilter === 'new') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
      return new Date(m.joined_at) >= thirtyDaysAgo;
    }
    return true;
  });

  const gymName = gym?.name || 'Iron Strength';
  const gymLocation = `${gym?.city || 'Medellín'} · ${gym?.country || 'Colombia'}`;

  const activeMembersCount = members.filter((m) => m.status === 'active').length;
  const atRiskCount = members.filter((m) => m.risk_score >= 40).length;
  const criticalCount = members.filter((m) => m.risk_score >= 70).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar
        gymName={gymName}
        gymLocation={gymLocation}
        atRiskCount={criticalCount}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader
          profile={profile}
          gymName={gymName}
          searchPlaceholder="Buscar por nombre, email o plan..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header Matching Image 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                OPERACIÓN
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Miembros
              </h1>
              <p className="text-xs text-[#535862]">
                Gestioná altas, score de riesgo y comunicación con cada miembro de {gymName}.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#181D27] border border-[#EBE7DF] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#535862]" />
                Exportar CSV
              </button>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Agregar miembro
              </button>
            </div>
          </div>

          {/* 4 Stat Cards Matching Image 2 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">TOTAL MIEMBROS</div>
              <div className="text-3xl font-black text-[#181D27]">{members.length}</div>
              <div className="text-[10px] text-[#9CA3AF]">en este gimnasio</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">ACTIVOS</div>
              <div className="text-3xl font-black text-[#181D27]">{activeMembersCount}</div>
              <div className="text-[10px] text-[#9CA3AF]">del gimnasio completo</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">EN RIESGO</div>
              <div className="text-3xl font-black text-[#181D27]">{atRiskCount}</div>
              <div className="text-[10px] text-[#D92D20] font-semibold">{criticalCount} críticos</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">NUEVOS ESTE MES</div>
              <div className="text-3xl font-black text-[#181D27]">3</div>
              <div className="text-[10px] text-[#9CA3AF]">altas en el mes</div>
            </div>
          </div>

          {/* Filter Chips Bar Matching Image 2 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'active', label: 'Activos' },
              { id: 'risk', label: 'En riesgo' },
              { id: 'past_due', label: 'Atrasados' },
              { id: 'paused', label: 'Pausados' },
              { id: 'new', label: 'Nuevos' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === chip.id
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Members Table Matching Image 2 */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#535862]">
                Cargando miembros...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                <div className="text-sm font-bold text-[#181D27]">No se encontraron miembros</div>
                <div className="text-xs text-[#535862]">Probá ajustando la búsqueda o el filtro.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Miembro</th>
                      <th className="py-3.5 px-4">Plan</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Riesgo</th>
                      <th className="py-3.5 px-4">Última Visita</th>
                      <th className="py-3.5 px-4">Entrenador</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3EFEA]">
                    {filteredMembers.map((m) => {
                      const isHighRisk = m.risk_score >= 70;
                      const isMedRisk = m.risk_score >= 40 && m.risk_score < 70;
                      const initials = m.full_name
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={m.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-bold text-[#181D27]">{m.full_name}</div>
                                <div className="text-[10px] text-[#9CA3AF]">
                                  {m.email} · alta {new Date(m.joined_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-semibold text-[#535862]">
                            Mensual
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                m.status === 'active'
                                  ? 'bg-[#ECFDF5] text-[#16A34A]'
                                  : m.status === 'paused'
                                  ? 'bg-[#F3EFEA] text-[#535862]'
                                  : 'bg-[#FEE4E2] text-[#D92D20]'
                              }`}
                            >
                              {m.status === 'active'
                                ? 'AL DÍA'
                                : m.status === 'paused'
                                ? 'PAUSADO'
                                : 'CANCELADO'}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                isHighRisk
                                  ? 'bg-[#FEE4E2] text-[#D92D20]'
                                  : isMedRisk
                                  ? 'bg-[#FFF4ED] text-[#F26522]'
                                  : 'bg-[#ECFDF5] text-[#16A34A]'
                              }`}
                            >
                              {isHighRisk ? 'ALTO' : isMedRisk ? 'MEDIO' : 'BAJO'} · {m.risk_score}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-[#535862]">
                            hace {isHighRisk ? '14' : isMedRisk ? '10' : '2'} días
                          </td>

                          <td className="py-4 px-4 font-medium text-[#181D27]">
                            {m.profiles?.full_name || '—'}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenDrawer(m)}
                                title="Ver Ficha y Timeline"
                                className="p-1.5 rounded-lg hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(m)}
                                title="Editar Miembro"
                                className="p-1.5 rounded-lg hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Member Create/Edit Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gymId={gym?.id || 'a0000000-0000-0000-0000-000000000001'}
        memberToEdit={memberToEdit}
        trainers={trainers}
        routines={routines}
        onMemberSaved={loadMembersData}
      />

      {/* Member Detail Drawer */}
      <MemberDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        member={selectedMember}
        onRecalculateRisk={loadMembersData}
      />
    </div>
  );
}
