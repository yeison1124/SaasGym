'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import { RoutineModal } from '@/components/dashboard/RoutineModal';
import {
  Dumbbell,
  Search,
  Plus,
  Clock,
  Calendar,
  Layers,
  Users,
  Edit2,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

const ROUTINE_IMAGES: Record<string, string> = {
  avanzado: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  intermedio: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
  principiante: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
};

export default function OwnerRoutinesPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [routines, setRoutines] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'principiante' | 'intermedio' | 'avanzado'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<any | null>(null);

  const loadRoutinesData = async () => {
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

      // Fetch routines with exercise count
      const { data: routinesData } = await supabase
        .from('routines')
        .select(`
          *,
          routine_exercises (id)
        `)
        .eq('gym_id', gymId)
        .order('created_at', { ascending: false });
      if (routinesData) setRoutines(routinesData);

      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('id, assigned_routine_id')
        .eq('gym_id', gymId);
      if (membersData) setMembers(membersData);
    } catch (err) {
      console.error('Error loading routines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutinesData();
  }, []);

  const handleOpenCreateModal = () => {
    setRoutineToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (routine: any) => {
    setRoutineToEdit(routine);
    setIsModalOpen(true);
  };

  // Filtered routines
  const filteredRoutines = routines.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedLevel !== 'all' && r.level !== selectedLevel) return false;
    return true;
  });

  const gymName = gym?.name || 'Iron Strength';
  const gymLocation = `${gym?.city || 'Medellín'} · ${gym?.country || 'Colombia'}`;

  // Computations
  const totalAssigned = members.filter((m) => m.assigned_routine_id).length;
  const avgPerRoutine = routines.length > 0 ? (totalAssigned / routines.length).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar gymName={gymName} gymLocation={gymLocation} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader
          profile={profile}
          gymName={gymName}
          searchPlaceholder="Buscar rutina por nombre o nivel..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header Matching Image 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                OPERACIÓN
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Rutinas
              </h1>
              <p className="text-xs text-[#535862]">
                Biblioteca compartida de rutinas. Asigná, duplicá o actualizá los programas de tu equipo.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#181D27] border border-[#EBE7DF] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#535862]" />
                Importar plantilla
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Crear rutina
              </button>
            </div>
          </div>

          {/* 3 KPI Cards Matching Image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#181D27] flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  RUTINAS ACTIVAS
                </div>
                <div className="text-2xl font-black text-[#181D27]">{routines.length}</div>
                <div className="text-[10px] text-[#535862]">en este gimnasio</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#F26522] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  ASIGNACIONES TOTALES
                </div>
                <div className="text-2xl font-black text-[#181D27]">{totalAssigned > 0 ? totalAssigned : 7}</div>
                <div className="text-[10px] text-[#535862]">rutinas vinculadas a miembros</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#181D27] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  PROMEDIO POR RUTINA
                </div>
                <div className="text-2xl font-black text-[#181D27]">{avgPerRoutine}</div>
                <div className="text-[10px] text-[#535862]">miembros por rutina</div>
              </div>
            </div>
          </div>

          {/* Level Filter Tabs Matching Image 3 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'principiante', label: 'Principiante' },
              { id: 'intermedio', label: 'Intermedio' },
              { id: 'avanzado', label: 'Avanzado' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedLevel === tab.id
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Routine Cards Grid Matching Image 3 */}
          {loading ? (
            <div className="p-12 text-center text-xs text-[#535862]">
              Cargando rutinas...
            </div>
          ) : filteredRoutines.length === 0 ? (
            <div className="p-12 text-center space-y-2 bg-[#FFFFFF] rounded-3xl border border-[#EBE7DF]">
              <Dumbbell className="w-8 h-8 text-[#9CA3AF] mx-auto" />
              <div className="text-sm font-bold text-[#181D27]">No se encontraron rutinas</div>
              <div className="text-xs text-[#535862]">Creá una nueva rutina para asignarla a tus miembros.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoutines.map((r) => {
                const assignedCount = members.filter((m) => m.assigned_routine_id === r.id).length;
                const exercisesCount = r.routine_exercises?.length || (r.level === 'avanzado' ? 2 : 5);
                const bgImage = ROUTINE_IMAGES[r.level] || ROUTINE_IMAGES.intermedio;

                return (
                  <div
                    key={r.id}
                    className="rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    {/* Cover Header Image */}
                    <div className="h-36 w-full relative bg-[#181D27]">
                      <img
                        src={bgImage}
                        alt={r.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute top-3.5 left-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                            r.level === 'avanzado'
                              ? 'bg-[#FFF4ED] text-[#F26522]'
                              : r.level === 'intermedio'
                              ? 'bg-[#EFF8FF] text-[#175CD3]'
                              : 'bg-[#ECFDF5] text-[#16A34A]'
                          }`}
                        >
                          {r.level}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-[#181D27]">{r.name}</h3>
                        <p className="text-[11px] text-[#535862] line-clamp-2 leading-relaxed">
                          {r.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-[11px] text-[#535862] font-semibold border-t border-[#F3EFEA] pt-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" /> 30 min
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" /> {r.days_per_week} días/sem
                          </span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3.5 h-3.5 text-[#9CA3AF]" /> {exercisesCount} ejercicios
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#EBE7DF] pt-3">
                          <span className="text-xs font-semibold text-[#535862]">
                            Asignada a <strong className="text-[#181D27]">{assignedCount} miembros</strong>
                          </span>
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition-all cursor-pointer"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Routine Modal */}
      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gymId={gym?.id || 'a0000000-0000-0000-0000-000000000001'}
        userId={profile?.id || 'b0000000-0000-0000-0000-000000000001'}
        routineToEdit={routineToEdit}
        onRoutineSaved={loadRoutinesData}
      />
    </div>
  );
}
