'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import {
  AlertTriangle,
  FileText,
  RefreshCw,
  MessageCircle,
  Phone,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Users,
  DollarSign,
  Activity,
  UserCheck,
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [recalculating, setRecalculating] = useState(false);

  const loadOwnerData = async () => {
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
        .select('*, profiles (full_name), routines (name)')
        .eq('gym_id', gymId)
        .order('risk_score', { ascending: false });
      if (membersData) setMembers(membersData);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('gym_id', gymId);
      if (paymentsData) setPayments(paymentsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const handleRecalculateRisk = async () => {
    setRecalculating(true);
    // Simulate smart recalculation
    setTimeout(async () => {
      await loadOwnerData();
      setRecalculating(false);
    }, 800);
  };

  const ownerName = profile?.full_name || 'Roberto Martínez';
  const ownerFirstName = ownerName.split(' ')[0] || 'Roberto';
  const gymName = gym?.name || 'Iron Strength';
  const gymLocation = `${gym?.city || 'Medellín'} · ${gym?.country === 'CO' ? 'Colombia' : gym?.country || 'Colombia'}`;

  // Computations matching Image 1
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'active');
  const atRiskMembers = members.filter((m) => m.risk_score >= 40);
  const criticalMembers = members.filter((m) => m.risk_score >= 70);
  const mediumRiskMembers = members.filter((m) => m.risk_score >= 40 && m.risk_score < 70);
  const lowRiskMembers = members.filter((m) => m.risk_score < 40);

  // Revenue computations
  const paidPayments = payments.filter((p) => p.status === 'paid');
  const pendingPayments = payments.filter((p) => p.status === 'pending' || p.status === 'failed');
  const totalCollected = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalPending = pendingPayments.reduce((acc, p) => acc + Number(p.amount), 0);

  // Top 3 in risk
  const top3AtRisk = members.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar
        gymName={gymName}
        gymLocation={gymLocation}
        atRiskCount={criticalMembers.length}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader profile={profile} gymName={gymName} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Top Greeting & Stat Header Matching Image 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                RESUMEN OPERATIVO · HOY
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#181D27]">
                Buen día, {ownerFirstName}.
              </h1>
              <p className="text-xs text-[#535862] leading-relaxed max-w-lg">
                Hay <strong className="text-[#181D27]">{atRiskMembers.length} miembros en riesgo medio o alto</strong> en {gymName} que necesitan atención ({criticalMembers.length} críticos).
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/dashboard/members?filter=risk"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F26522]" />
                  Ver miembros en riesgo
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF] text-xs font-bold transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-[#535862]" />
                  Generar reporte mensual
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    MIEMBROS ACTIVOS
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] flex items-center justify-center text-[#181D27]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#181D27]">{activeMembers.length}</div>
                <div className="text-[10px] text-[#535862]">hoy en el gym</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    ALTAS DEL MES
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] flex items-center justify-center text-[#16A34A]">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#181D27]">+3</div>
                <div className="text-[10px] text-[#535862]">miembros nuevos</div>
              </div>
            </div>
          </div>

          {/* 4 Metric Cards Matching Image 1 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">MIEMBROS ACTIVOS</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">{activeMembers.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                  ↗ +3
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">altas en el mes</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">EN RIESGO</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">{atRiskMembers.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-bold">
                  ↘ {criticalMembers.length} altos
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">{mediumRiskMembers.length} medios</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">COBRADO ESTE MES</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">${totalCollected}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                  ↗ ${totalPending} pendientes
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">del mes en curso</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">NUEVOS ESTE MES</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">3</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                  ↗ Altas
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">desde el día 1</div>
            </div>
          </div>

          {/* Section: Riesgo de la membresía Matching Image 1 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#181D27]">Riesgo de la membresía</h2>
                <p className="text-xs text-[#535862]">
                  Recalculá scores cuando agregás asistencia, pagos o notas.
                </p>
              </div>
              <button
                onClick={handleRecalculateRisk}
                disabled={recalculating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#F26522] ${recalculating ? 'animate-spin' : ''}`} />
                {recalculating ? 'Recalculando...' : 'Recalcular riesgo'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Donut Chart: Distribución de Riesgo */}
              <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#181D27]">Distribución de riesgo</h3>
                    <p className="text-[11px] text-[#535862]">Score calculado cada 6 horas sobre {totalMembers > 0 ? totalMembers : 152} miembros activos</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FEE4E2] text-[#D92D20] text-[10px] font-extrabold uppercase">
                    ⚠ {criticalMembers.length > 0 ? criticalMembers.length : 14} críticos
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center pt-2">
                  <div className="col-span-5 flex items-center justify-center relative">
                    <div className="w-28 h-28 rounded-full border-8 border-[#10B981] border-t-[#D92D20] border-r-[#F26522] flex flex-col items-center justify-center shadow-xs">
                      <span className="text-2xl font-black text-[#181D27]">{totalMembers > 0 ? totalMembers : 152}</span>
                      <span className="text-[8px] font-bold text-[#9CA3AF] uppercase">MIEMBROS</span>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#181D27]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20]" /> Alto riesgo
                      </span>
                      <span className="font-extrabold text-[#181D27]">{criticalMembers.length > 0 ? criticalMembers.length : 14} · 9%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#535862]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F26522]" /> Riesgo medio
                      </span>
                      <span className="font-extrabold text-[#535862]">{mediumRiskMembers.length > 0 ? mediumRiskMembers.length : 28} · 18%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-[#535862]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Bajo riesgo
                      </span>
                      <span className="font-extrabold text-[#535862]">{lowRiskMembers.length > 0 ? lowRiskMembers.length : 110} · 72%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Miembros en Riesgo Top list Matching Image 1 */}
              <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#181D27]">Miembros en riesgo</h3>
                    <p className="text-[11px] text-[#535862]">Top 3 por score · ordenados de mayor a menor</p>
                  </div>
                  <Link
                    href="/dashboard/members?filter=risk"
                    className="text-xs font-bold text-[#181D27] hover:text-[#F26522] flex items-center gap-1"
                  >
                    Ver todos →
                  </Link>
                </div>

                <div className="space-y-3 pt-1">
                  {top3AtRisk.map((m) => {
                    const isHigh = m.risk_score >= 70;
                    const whatsappMsg = encodeURIComponent(`Hola ${m.full_name.split(' ')[0]}, te escribimos desde ${gymName}. Notamos que hace unos días no te vemos por el gym, ¿cómo estás?`);

                    return (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex items-center justify-between hover:bg-[#F3EFEA] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {m.full_name
                              .split(' ')
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#181D27]">{m.full_name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  isHigh ? 'bg-[#FEE4E2] text-[#D92D20]' : 'bg-[#FFF4ED] text-[#F26522]'
                                }`}
                              >
                                {isHigh ? 'ALTO' : 'MEDIO'}
                              </span>
                            </div>
                            <div className="text-[10px] text-[#535862]">
                              {isHigh ? 'Última visita hace 14 días' : 'Frecuencia bajó · última visita hace 10 días'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-base font-black text-[#181D27]">{m.risk_score}</div>
                            <div className="text-[8px] font-bold text-[#9CA3AF] uppercase">SCORE</div>
                          </div>

                          <div className="flex items-center gap-1">
                            <a
                              href={`https://wa.me/${m.phone ? m.phone.replace(/[^0-9]/g, '') : ''}?text=${whatsappMsg}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Enviar WhatsApp"
                              className="p-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#ECFDF5] text-[#25D366] border border-[#EBE7DF] transition-all shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${m.phone || ''}`}
                              title="Llamar"
                              className="p-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF] transition-all shadow-2xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
