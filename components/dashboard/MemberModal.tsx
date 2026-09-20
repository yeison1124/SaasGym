'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Calendar, Dumbbell, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
  memberToEdit?: any;
  trainers?: any[];
  routines?: any[];
  onMemberSaved: () => void;
}

export function MemberModal({
  isOpen,
  onClose,
  gymId,
  memberToEdit,
  trainers = [],
  routines = [],
  onMemberSaved,
}: MemberModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    goal: 'Hipertrofia',
    status: 'active',
    assigned_trainer_id: '',
    assigned_routine_id: '',
    membership_plan: 'mensual',
    membership_months: 1,
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        full_name: memberToEdit.full_name || '',
        email: memberToEdit.email || '',
        phone: memberToEdit.phone || '',
        goal: memberToEdit.goal || 'Hipertrofia',
        status: memberToEdit.status || 'active',
        assigned_trainer_id: memberToEdit.assigned_trainer_id || '',
        assigned_routine_id: memberToEdit.assigned_routine_id || '',
        membership_plan: 'mensual',
        membership_months: 1,
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        goal: 'Hipertrofia',
        status: 'active',
        assigned_trainer_id: trainers[0]?.id || '',
        assigned_routine_id: routines[0]?.id || '',
        membership_plan: 'mensual',
        membership_months: 1,
      });
    }
    setError(null);
  }, [memberToEdit, isOpen, trainers, routines]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (Number(formData.membership_months) || 1));

      const payload = {
        gym_id: gymId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        goal: formData.goal,
        status: formData.status,
        assigned_trainer_id: formData.assigned_trainer_id || null,
        assigned_routine_id: formData.assigned_routine_id || null,
        membership_expires_at: expiresAt.toISOString(),
      };

      if (memberToEdit?.id) {
        const { error: updateErr } = await supabase
          .from('members')
          .update(payload)
          .eq('id', memberToEdit.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('members')
          .insert({
            ...payload,
            joined_at: new Date().toISOString(),
            risk_score: 5,
            risk_band: 'saludable',
            last_attendance_at: new Date().toISOString(),
          });
        if (insertErr) throw insertErr;
      }

      onMemberSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving member:', err);
      setError(err.message || 'Error al guardar el miembro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181D27]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
              Gestión de Miembros
            </div>
            <h2 className="text-xl font-black text-[#181D27]">
              {memberToEdit ? 'Editar Miembro' : 'Agregar Nuevo Miembro'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] text-[#D92D20] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pablo Díaz"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                placeholder="juan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+57 300 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Objetivo Principal
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="Hipertrofia">Hipertrofia / Ganancia Muscular</option>
                <option value="Pérdida de grasa">Pérdida de Grasa / Definición</option>
                <option value="Fuerza">Fuerza y Rendimiento</option>
                <option value="Salud">Salud y Longevidad</option>
                <option value="Rehabilitación">Rehabilitación</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Estado de Membresía
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="active">Activo / Al día</option>
                <option value="paused">Pausado</option>
                <option value="churned">Cancelado / Atrasado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Entrenador Asignado
              </label>
              <select
                value={formData.assigned_trainer_id}
                onChange={(e) => setFormData({ ...formData, assigned_trainer_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="">Sin entrenador asignado</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Rutina Asignada
              </label>
              <select
                value={formData.assigned_routine_id}
                onChange={(e) => setFormData({ ...formData, assigned_routine_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="">Sin rutina asignada</option>
                {routines.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#535862] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Guardando...' : memberToEdit ? 'Actualizar Miembro' : 'Guardar Miembro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
