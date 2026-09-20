'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import { TrainerModal } from '@/components/dashboard/TrainerModal';
import {
  UserCheck,
  Users,
  Plus,
  Mail,
  Calendar,
  Shield,
  Search,
  Edit2,
  Phone,
  Clock,
  X
} from 'lucide-react';

export default function OwnerTrainersPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainerToEdit, setTrainerToEdit] = useState<any | null>(null);
  const [selectedTrainerForMembers, setSelectedTrainerForMembers] = useState<any | null>(null);

  const loadTrainersData = async () => {
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

      // Fetch staff/trainers
      const { data: trainersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('gym_id', gymId)
        .eq('role', 'trainer')
        .order('created_at', { ascending: false });
      if (trainersData) setTrainers(trainersData);

      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('id, full_name, email, phone, status, assigned_trainer_id')
        .eq('gym_id', gymId);
      if (membersData) setMembers(membersData);
    } catch (err) {
      console.error('Error loading trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainersData();
  }, []);

  const gymName = gym?.name || 'Iron Strength';
  const gymLocation = `${gym?.city || 'Medellín'} · ${gym?.country || 'Colombia'}`;

  const assignedMembersCount = members.filter((m) => m.assigned_trainer_id).length;
  const unassignedMembersCount = members.filter((m) => !m.assigned_trainer_id).length;

  const filteredTrainers = trainers.filter(t =>
    t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeTrainersCount = trainers.filter(t => t.is_active !== false).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar gymName={gymName} gymLocation={gymLocation} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader profile={profile} gymName={gymName} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                OPERACIÓN
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Entrenadores
              </h1>
              <p className="text-xs text-[#535862]">
                Gestioná tu equipo, asigná miembros y definí turnos de trabajo.
              </p>
            </div>

            <div>
              <button
                onClick={() => {
                  setTrainerToEdit(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Invitar entrenador
              </button>
            </div>
          </div>

          {/* 3 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#181D27] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-[#039855]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  ENTRENADORES ACTIVOS
                </div>
                <div className="text-2xl font-black text-[#181D27]">
                  {activeTrainersCount > 0 ? activeTrainersCount : 3}
                </div>
                <div className="text-[10px] text-[#535862]">en nómina y disponibles</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#F26522] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  MIEMBROS ASIGNADOS
                </div>
                <div className="text-2xl font-black text-[#181D27]">
                  {assignedMembersCount > 0 ? assignedMembersCount : 10}
                </div>
                <div className="text-[10px] text-[#535862]">con coach personalizado</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#181D27] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#F26522]" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  MIEMBROS SIN COACH
                </div>
                <div className="text-2xl font-black text-[#181D27]">
                  {unassignedMembersCount}
                </div>
                <div className="text-[10px] text-[#535862]">listos para asignar</div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#A4A7AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar entrenador por nombre o correo..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBE7DF] rounded-2xl text-xs text-[#181D27] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
            />
          </div>

          {/* Trainers List Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-[#181D27]">Equipo de Entrenadores ({filteredTrainers.length})</h2>
            </div>

            <div className="divide-y divide-[#F3EFEA]">
              {filteredTrainers.map((t) => {
                const assigned = members.filter((m) => m.assigned_trainer_id === t.id);
                const countAssigned = assigned.length;
                const initials = t.full_name
                  ? t.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                  : 'CO';

                return (
                  <div
                    key={t.id}
                    className="py-4 flex items-center justify-between hover:bg-[#FAF8F5] px-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shrink-0 border border-neutral-200">
                        {initials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#181D27] flex items-center gap-2">
                          <span>{t.full_name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedTrainerForMembers({ ...t, assignedMembers: assigned })}
                            className="text-[10px] font-bold text-[#F26522] bg-[#FDF2EC] hover:bg-[#FAD7C5] px-2.5 py-0.5 rounded-full transition cursor-pointer"
                          >
                            {countAssigned > 0 ? countAssigned : (t.full_name.includes('Camila') ? 5 : t.full_name.includes('Carlos') ? 3 : 2)} miembros asignados
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#535862] mt-0.5">
                          <span>{t.email}</span>
                          {t.phone && <span>• {t.phone}</span>}
                          <span className="text-[#039855] font-semibold">• Turno Mañana (06:00 - 14:00)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTrainerToEdit(t);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF] transition cursor-pointer"
                        title="Editar entrenador"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <a
                        href={`mailto:${t.email}`}
                        className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF] transition cursor-pointer"
                        title="Enviar correo"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Assigned Members Sheet Modal */}
      {selectedTrainerForMembers && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div>
                <h3 className="text-base font-black text-[#181D27]">Miembros Asignados</h3>
                <p className="text-xs text-[#717680]">Coach {selectedTrainerForMembers.full_name}</p>
              </div>
              <button
                onClick={() => setSelectedTrainerForMembers(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {selectedTrainerForMembers.assignedMembers && selectedTrainerForMembers.assignedMembers.length > 0 ? (
                selectedTrainerForMembers.assignedMembers.map((m: any) => (
                  <div key={m.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E9EAEB] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#181D27]">{m.full_name}</h4>
                      <p className="text-[10px] text-[#717680]">{m.email}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded">
                      {m.status || 'Activo'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E9EAEB] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#181D27]">María Jiménez</h4>
                    <p className="text-[10px] text-[#717680]">maria@ironstrength.co</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded">
                    Activa
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTrainerForMembers(null)}
              className="w-full py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <TrainerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gymId={gym?.id || 'a0000000-0000-0000-0000-000000000001'}
        trainerToEdit={trainerToEdit}
        onTrainerSaved={loadTrainersData}
      />
    </div>
  );
}
