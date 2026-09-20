'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Users,
  Search,
  Shield,
  Dumbbell,
  UserCheck,
  Building2,
  Mail,
  Calendar,
} from 'lucide-react';

export default function SuperAdminUsersPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'superadmin' | 'owner' | 'trainer' | 'member'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
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

        const { data: usersData, error } = await supabase
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            role,
            created_at,
            gym_id,
            gyms (
              id,
              name,
              plan
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(usersData || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, [supabase]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.gyms?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const roleBadges: Record<string, { label: string; bg: string; text: string }> = {
    superadmin: { label: 'SuperAdmin', bg: 'bg-[#181D27]', text: 'text-white' },
    owner: { label: 'Owner', bg: 'bg-[#FFF4ED]', text: 'text-[#F26522]' },
    trainer: { label: 'Coach / Staff', bg: 'bg-[#EFF8FF]', text: 'text-[#175CD3]' },
    member: { label: 'Miembro', bg: 'bg-[#ECFDF5]', text: 'text-[#16A34A]' },
  };

  const countByRole = {
    all: users.length,
    superadmin: users.filter((u) => u.role === 'superadmin').length,
    owner: users.filter((u) => u.role === 'owner').length,
    trainer: users.filter((u) => u.role === 'trainer').length,
    member: users.filter((u) => u.role === 'member').length,
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <AdminSidebar usersCount={users.length} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          profile={profile}
          searchPlaceholder="Buscar usuarios por nombre, email o gimnasio..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                PLATAFORMA
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Usuarios
              </h1>
              <p className="text-xs text-[#535862]">
                Control global de cuentas registradas en GymPulse ({users.length} usuarios totales).
              </p>
            </div>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Todos', count: countByRole.all },
              { id: 'owner', label: 'Dueños de Gym', count: countByRole.owner },
              { id: 'trainer', label: 'Entrenadores', count: countByRole.trainer },
              { id: 'member', label: 'Miembros', count: countByRole.member },
              { id: 'superadmin', label: 'SuperAdmins', count: countByRole.superadmin },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Users Table */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#535862]">
                Cargando usuarios desde Supabase...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                <div className="text-sm font-bold text-[#181D27]">No se encontraron usuarios</div>
                <div className="text-xs text-[#535862]">Probá ajustando la búsqueda o el filtro de rol.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Usuario</th>
                      <th className="py-3.5 px-6">Rol</th>
                      <th className="py-3.5 px-6">Gimnasio Asignado</th>
                      <th className="py-3.5 px-6">Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3EFEA]">
                    {filteredUsers.map((u) => {
                      const badge = roleBadges[u.role] || {
                        label: u.role,
                        bg: 'bg-[#F3EFEA]',
                        text: 'text-[#181D27]',
                      };
                      const userInitials = (u.full_name || u.email || 'U')
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      return (
                        <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                                {userInitials}
                              </div>
                              <div>
                                <div className="font-bold text-[#181D27]">{u.full_name || 'Sin nombre'}</div>
                                <div className="text-[11px] text-[#535862] flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#9CA3AF]" />
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${badge.bg} ${badge.text}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            {u.gyms ? (
                              <div className="flex items-center gap-1.5 font-semibold text-[#181D27]">
                                <Building2 className="w-3.5 h-3.5 text-[#F26522]" />
                                <span>{u.gyms.name}</span>
                                <span className="text-[10px] text-[#9CA3AF] uppercase">({u.gyms.plan})</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#9CA3AF] italic">Plataforma Global</span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-[#535862]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                              {new Date(u.created_at).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
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
    </div>
  );
}
