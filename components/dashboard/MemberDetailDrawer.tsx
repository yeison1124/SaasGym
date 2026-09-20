'use client';

import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  CreditCard,
  Dumbbell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Activity,
} from 'lucide-react';

interface MemberDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onRecalculateRisk?: (memberId: string) => void;
}

export function MemberDetailDrawer({
  isOpen,
  onClose,
  member,
  onRecalculateRisk,
}: MemberDetailDrawerProps) {
  if (!isOpen || !member) return null;

  const riskBandConfig = {
    en_riesgo: { label: 'ALTO RIESGO', bg: 'bg-[#FEE4E2]', text: 'text-[#D92D20]', border: 'border-[#FECDCA]' },
    atencion: { label: 'RIESGO MEDIO', bg: 'bg-[#FFF4ED]', text: 'text-[#F26522]', border: 'border-[#FECDCA]' },
    saludable: { label: 'BAJO RIESGO', bg: 'bg-[#ECFDF5]', text: 'text-[#16A34A]', border: 'border-[#A7F3D0]' },
  };

  const riskConfig = riskBandConfig[member.risk_band as keyof typeof riskBandConfig] || riskBandConfig.saludable;

  const whatsappMessage = encodeURIComponent(
    `¡Hola ${member.full_name.split(' ')[0]}! Te escribimos desde Iron Strength. Notamos que hace unos días no te vemos por el gym y queríamos ver cómo venís con tus entrenamientos y cómo podemos ayudarte.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#181D27]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#EBE7DF] font-sans">
        {/* Top Header */}
        <div>
          <div className="p-6 border-b border-[#EBE7DF] bg-[#FAF8F5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#181D27] text-white flex items-center justify-center font-black text-sm">
                {member.full_name
                  .split(' ')
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-black text-[#181D27]">{member.full_name}</h2>
                <p className="text-xs text-[#535862]">{member.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {/* Risk Score Highlight */}
            <div className={`p-4 rounded-2xl border ${riskConfig.bg} ${riskConfig.border} flex items-center justify-between`}>
              <div className="space-y-0.5">
                <div className={`text-[10px] font-extrabold uppercase tracking-wider ${riskConfig.text}`}>
                  {riskConfig.label}
                </div>
                <div className="text-xs text-[#535862]">
                  {member.risk_score >= 70
                    ? 'Sin asistencia reciente y caída drástica de frecuencia.'
                    : member.risk_score >= 40
                    ? 'Frecuencia semanal disminuyó en los últimos 15 días.'
                    : 'Asistencia regular y membresía al día.'}
                </div>
              </div>
              <div className={`text-3xl font-black ${riskConfig.text}`}>
                {member.risk_score}
                <span className="text-xs font-bold text-[#535862]">/100</span>
              </div>
            </div>

            {/* Direct Retention Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${member.phone ? member.phone.replace(/[^0-9]/g, '') : ''}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp 1-Clic
              </a>
              <a
                href={`tel:${member.phone || ''}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF] text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-[#F26522]" />
                Llamar
              </a>
            </div>

            {/* Member Details Cards */}
            <div className="space-y-3 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                DATOS GENERALES
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#535862]">Teléfono:</span>
                  <span className="font-bold text-[#181D27]">{member.phone || 'No registrado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#535862]">Objetivo:</span>
                  <span className="font-bold text-[#181D27]">{member.goal || 'Fitness'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#535862]">Fecha de Alta:</span>
                  <span className="font-bold text-[#181D27]">
                    {new Date(member.joined_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#535862]">Vencimiento Membresía:</span>
                  <span className="font-bold text-[#181D27]">
                    {new Date(member.membership_expires_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Routine & Coach */}
            <div className="space-y-3 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                ENTRENAMIENTO & STAFF
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#535862] flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-[#F26522]" /> Rutina:
                  </span>
                  <span className="font-bold text-[#181D27]">
                    {member.routines?.name || 'Hipertrofia 4 días'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#535862] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#181D27]" /> Entrenador:
                  </span>
                  <span className="font-bold text-[#181D27]">
                    {member.profiles?.full_name || 'Carlos Rodríguez'}
                  </span>
                </div>
              </div>
            </div>

            {/* ⌚ Wearables Biometrics (Apple HealthKit & Fitbit) */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  WEARABLES & BIOMETRÍA
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  HealthKit + Fitbit Activo
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-white rounded-xl border border-[#EBE7DF]">
                    <span className="text-[10px] text-[#717680] block font-semibold">FC Prom. Entreno</span>
                    <strong className="text-xs text-[#181D27] font-black">142 bpm</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#EBE7DF]">
                    <span className="text-[10px] text-[#717680] block font-semibold">Calorías Hoy</span>
                    <strong className="text-xs text-[#F26522] font-black">580 kcal</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#EBE7DF]">
                    <span className="text-[10px] text-[#717680] block font-semibold">Pasos Diarios</span>
                    <strong className="text-xs text-emerald-700 font-black">9.420</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#EBE7DF]">
                    <span className="text-[10px] text-[#717680] block font-semibold">Calidad Sueño</span>
                    <strong className="text-xs text-indigo-700 font-black">7.8h (88%)</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[10.5px] text-emerald-900 leading-snug">
                  🛡️ <strong>Impacto en Score:</strong> -15 pts de riesgo por alta actividad aeróbica y recuperación óptima fuera del gym.
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                ACTIVIDAD RECIENTE
              </div>

              <div className="space-y-2 border-l-2 border-[#EBE7DF] ml-3 pl-4">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <div className="font-bold text-[#181D27]">Último check-in registrado</div>
                  <div className="text-[11px] text-[#535862]">Ayer a las 18:45 hs (Recepción)</div>
                </div>
                <div className="relative pt-2">
                  <div className="absolute -left-[23px] top-3 w-2.5 h-2.5 rounded-full bg-[#F26522]" />
                  <div className="font-bold text-[#181D27]">Score de riesgo actualizado</div>
                  <div className="text-[11px] text-[#535862]">Recalculado hace 6 horas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBE7DF] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#181D27] text-white text-xs font-bold hover:bg-[#2C3444] transition-all cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
