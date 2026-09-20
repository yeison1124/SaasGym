'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, AlertCircle, CheckCircle2, Clock, Calendar, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
  trainerToEdit?: any;
  onTrainerSaved: () => void;
}

export function TrainerModal({ isOpen, onClose, gymId, trainerToEdit, onTrainerSaved }: TrainerModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Musculación & Fuerza');
  const [workShift, setWorkShift] = useState('Mañana (06:00 - 14:00)');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (trainerToEdit) {
      setFullName(trainerToEdit.full_name || '');
      setEmail(trainerToEdit.email || '');
      setPhone(trainerToEdit.phone || '');
      setSpecialty(trainerToEdit.specialty || 'Musculación & Fuerza');
      setWorkShift(trainerToEdit.work_shift || 'Mañana (06:00 - 14:00)');
      setIsActive(trainerToEdit.is_active !== false);
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setSpecialty('Musculación & Fuerza');
      setWorkShift('Mañana (06:00 - 14:00)');
      setIsActive(true);
    }
    setError(null);
    setSuccess(false);
  }, [trainerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (trainerToEdit) {
        // Edit existing trainer
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim(),
            phone: phone.trim() || null,
            is_active: isActive,
          })
          .eq('id', trainerToEdit.id);

        if (updateErr) throw updateErr;
      } else {
        // Register new trainer in Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: 'Password123!',
          options: {
            data: {
              full_name: fullName.trim(),
              role: 'trainer',
              gym_id: gymId,
            },
          },
        });

        if (authErr) {
          // If already in auth, update profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .single();

          if (existingProfile) {
            const { error: updateErr } = await supabase
              .from('profiles')
              .update({
                gym_id: gymId,
                full_name: fullName.trim(),
                phone: phone.trim() || null,
                role: 'trainer',
                is_active: true,
              })
              .eq('id', existingProfile.id);

            if (updateErr) throw updateErr;
          } else {
            throw authErr;
          }
        } else if (authData?.user) {
          await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              gym_id: gymId,
              full_name: fullName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim() || null,
              role: 'trainer',
              is_active: true,
            });
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onTrainerSaved();
        handleClose();
      }, 1000);
    } catch (err: any) {
      console.error('Error saving trainer:', err);
      setError(err.message || 'Error al guardar los datos del entrenador.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181D27]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
              Equipo de Staff
            </div>
            <h2 className="text-xl font-black text-[#181D27]">
              {trainerToEdit ? 'Editar Entrenador' : 'Invitar Entrenador'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] text-[#D92D20] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trainerToEdit ? 'Datos actualizados con éxito.' : '¡Invitación enviada exitosamente!'}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Camila Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              disabled={!!trainerToEdit}
              placeholder="camila@ironstrength.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Especialidad
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="Musculación & Fuerza">Musculación & Fuerza</option>
                <option value="Crossfit & Funcional">Crossfit & Funcional</option>
                <option value="Cardio & HIIT">Cardio & HIIT</option>
                <option value="Yoga & Movilidad">Yoga & Movilidad</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Turno de Trabajo
              </label>
              <select
                value={workShift}
                onChange={(e) => setWorkShift(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="Mañana (06:00 - 14:00)">Mañana (06:00 - 14:00)</option>
                <option value="Tarde (14:00 - 22:00)">Tarde (14:00 - 22:00)</option>
                <option value="Completo (Rotativo)">Completo (Rotativo)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#535862] text-[11px] leading-relaxed">
            Contraseña provisional de acceso: <code className="font-bold text-[#181D27]">Password123!</code>. El entrenador solo podrá ver a sus miembros asignados.
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#535862] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#181D27] hover:bg-black text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {trainerToEdit ? <Save className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              <span>{loading ? 'Guardando...' : trainerToEdit ? 'Guardar Cambios' : 'Enviar Invitación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
