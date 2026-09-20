'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import {
  FileText,
  Eye,
  Mail,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  TrendingUp,
  Users,
  Dumbbell,
  DollarSign,
  UserCheck,
  X
} from 'lucide-react';

export default function ReportsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [membersCount, setMembersCount] = useState(152);
  const [highRiskCount, setHighRiskCount] = useState(14);
  const [activeTab, setActiveTab] = useState<'retention' | 'finance' | 'trainers' | 'routines'>('retention');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  const [reportsList, setReportsList] = useState([
    {
      id: 'rep-1',
      title: 'Reporte Ejecutivo Mayo 2026 · Iron Strength',
      members: '152 miembros',
      date: 'generado 18 may 2026',
      type: 'MENSUAL',
      typeColor: 'bg-[#F2F4F7] text-[#344054]',
      retentionRate: '92.4%',
      mrr: '$5,168 USD',
      churnRisk: '7.6%',
      bestMonth: 'Mayo 2026 (Récord histórico)',
      highlights: [
        '92% de retención global de alumnos en el período.',
        '14 miembros en riesgo alto notificados automáticamente por WhatsApp.',
        'Cobranza al día del 88% de las mensualidades del mes.'
      ]
    },
    {
      id: 'rep-2',
      title: 'Reporte Abril 2026 · Cierre Trimestral Q1',
      members: '144 miembros',
      date: 'generado 30 abr 2026',
      type: 'TRIMESTRAL',
      typeColor: 'bg-[#FEF3F2] text-[#B42318]',
      retentionRate: '88.1%',
      mrr: '$4,896 USD',
      churnRisk: '11.9%',
      bestMonth: 'Marzo 2026',
      highlights: [
        'Crecimiento neto de +12 nuevos miembros.',
        'Coach Camila Pérez lideró en mayor cantidad de sesiones completadas.'
      ]
    },
    {
      id: 'rep-3',
      title: 'Análisis de Cohorte y Churn 2026',
      members: '135 miembros',
      date: 'generado 31 mar 2026',
      type: 'COHORTE',
      typeColor: 'bg-[#FEF6EE] text-[#B54708]',
      retentionRate: '94.0%',
      mrr: '$4,590 USD',
      churnRisk: '6.0%',
      bestMonth: 'Febrero 2026',
      highlights: [
        'Tasa de recuperación del 75% en miembros que no asistían hacía 14 días.'
      ]
    }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      let gymId = 'a0000000-0000-0000-0000-000000000001';

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
          if (profileData.gym_id) gymId = profileData.gym_id;
        }
      }

      const { data: gymData } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gymId)
        .single();
      if (gymData) setGym(gymData);

      const { count: mCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId);
      if (mCount) setMembersCount(mCount);

      const { count: rCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .gte('risk_score', 70);
      if (rCount !== null) setHighRiskCount(rCount);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const newRep = {
        id: `rep-${Date.now()}`,
        title: `Snapshot Ejecutivo · ${monthNames[now.getMonth()]} ${now.getFullYear()}`,
        members: `${membersCount} miembros`,
        date: `generado hoy a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        type: 'SNAPSHOT',
        typeColor: 'bg-[#ECFDF3] text-[#027A48]',
        retentionRate: `${Math.max(70, 100 - highRiskCount * 2)}%`,
        mrr: `$${membersCount * 34} USD`,
        churnRisk: `${Math.round((highRiskCount / Math.max(membersCount, 1)) * 100)}%`,
        bestMonth: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
        highlights: [
          `Snapshot generado al instante con ${membersCount} miembros activos.`,
          `Riesgo controlado en un ${Math.round((highRiskCount / Math.max(membersCount, 1)) * 100)}%.`,
          `Facturación proyectada mensual: $${membersCount * 34} USD.`
        ]
      };
      setReportsList([newRep, ...reportsList]);
      setGenerating(false);
      setSelectedReport(newRep);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans print:bg-white">
      <div className="print:hidden">
        <OwnerSidebar gymName={gym?.name || 'Iron Strength Medellín'} highRiskCount={highRiskCount} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <OwnerHeader profile={profile} gymName={gym?.name} />
        </div>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#535862]">
                BUSINESS INTELLIGENCE & REPORTES
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Centro de Reportes
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Informes ejecutivos de retención, finanzas, entrenadores y rutinas de {gym?.name || 'Iron Strength'}.
              </p>
            </div>

            <div className="flex items-center gap-2.5 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#181D27] font-bold text-xs rounded-2xl border border-[#E9EAEB] transition shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#717680]" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181D27] hover:bg-black text-white font-bold text-xs rounded-2xl transition shadow-md disabled:opacity-60 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#F26522]" />
                <span>{generating ? 'Generando informe...' : 'Generar Snapshot'}</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E9EAEB] shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] block">TASA DE RETENCIÓN</span>
              <div className="text-2xl font-black text-[#039855] flex items-baseline gap-2">
                92.4% <span className="text-[10px] font-bold text-[#027A48] bg-[#ECFDF3] px-2 py-0.5 rounded-full">+3.2%</span>
              </div>
              <p className="text-[10px] text-[#535862]">promedio últimos 3 meses</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E9EAEB] shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] block">INGRESOS RECURRENTES (MRR)</span>
              <div className="text-2xl font-black text-[#181D27]">
                ${membersCount * 34} <span className="text-xs font-normal text-[#535862]">USD</span>
              </div>
              <p className="text-[10px] text-[#535862]">{membersCount} suscripciones activas</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E9EAEB] shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] block">MIEMBROS EN RIESGO DE CHURN</span>
              <div className="text-2xl font-black text-[#D92D20]">
                {highRiskCount} <span className="text-xs font-semibold text-[#717680]">({Math.round((highRiskCount / Math.max(membersCount, 1)) * 100)}%)</span>
              </div>
              <p className="text-[10px] text-[#535862]">con alertas automáticas activas</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E9EAEB] shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] block">MEJOR MES HISTÓRICO</span>
              <div className="text-2xl font-black text-[#F26522]">
                Mayo 2026
              </div>
              <p className="text-[10px] text-[#535862]">152 miembros & 0 cancelaciones</p>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E9EAEB] print:hidden">
            {[
              { id: 'retention', label: '📊 Retención & Churn', icon: TrendingUp },
              { id: 'finance', label: '💵 Finanzas & Mejor Mes', icon: DollarSign },
              { id: 'trainers', label: '🏋️‍♂️ Rendimiento Coaches', icon: UserCheck },
              { id: 'routines', label: '📋 Rutinas & Ejercicios', icon: Dumbbell }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#181D27] text-white shadow-xs'
                      : 'bg-white text-[#535862] hover:bg-[#FAF8F5] border border-[#E9EAEB]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: RETENCIÓN & HISTÓRICO */}
          {activeTab === 'retention' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Card: Histórico */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-7 border border-[#E9EAEB] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2F4F7]">
                  <div>
                    <h2 className="text-base font-black text-[#181D27]">Informes Generados</h2>
                    <p className="text-xs text-[#535862]">Snapshots consolidados de retención del gimnasio</p>
                  </div>
                  <span className="text-xs text-[#535862] font-semibold">{reportsList.length} reportes</span>
                </div>

                <div className="divide-y divide-[#F2F4F7]">
                  {reportsList.map((rep) => (
                    <div key={rep.id} className="py-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] px-3 rounded-2xl transition">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E9EAEB] text-[#535862] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#181D27] truncate">{rep.title}</h4>
                          <p className="text-[11px] text-[#535862] truncate">
                            {rep.members} · {rep.date} · Retención: <strong className="text-[#039855]">{rep.retentionRate}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="px-3 py-1.5 bg-[#181D27] hover:bg-black text-white text-[11px] font-bold rounded-xl transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Card: Factores de Retención */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-[#E9EAEB] shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#181D27]">Factores de Retención Clave</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#181D27]">
                      <span>Asistencia &gt; 3 días/semana</span>
                      <span className="text-[#039855]">96% se quedan</span>
                    </div>
                    <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#039855] h-full w-[96%]"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#181D27]">
                      <span>Interacción en Comunidad</span>
                      <span className="text-[#039855]">88% se quedan</span>
                    </div>
                    <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#039855] h-full w-[88%]"></div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#181D27]">
                      <span>Sin Asistencia por &gt; 10 días</span>
                      <span className="text-[#D92D20]">65% riesgo de baja</span>
                    </div>
                    <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D92D20] h-full w-[65%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FINANZAS & MEJOR MES */}
          {activeTab === 'finance' && (
            <div className="bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-[#181D27]">Histórico Financiero Mensual</h2>
                <p className="text-xs text-[#535862]">Comparativo de facturación, retención y nuevo alumnado</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[#717680] text-[10px] font-bold uppercase">
                    <tr>
                      <th className="py-3 px-4">Mes</th>
                      <th className="py-3 px-4">Alumnos Totales</th>
                      <th className="py-3 px-4">Facturación (USD)</th>
                      <th className="py-3 px-4">Tasa de Retención</th>
                      <th className="py-3 px-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F4F7]">
                    {[
                      { month: 'Mayo 2026 (Actual)', members: 152, mrr: '$5,168', rate: '92.4%', status: 'Mejor Mes 🏆' },
                      { month: 'Abril 2026', members: 144, mrr: '$4,896', rate: '88.1%', status: 'Completado' },
                      { month: 'Marzo 2026', members: 135, mrr: '$4,590', rate: '94.0%', status: 'Completado' },
                      { month: 'Febrero 2026', members: 122, mrr: '$4,148', rate: '91.5%', status: 'Completado' },
                      { month: 'Enero 2026', members: 110, mrr: '$3,740', rate: '85.0%', status: 'Completado' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#FAF8F5]">
                        <td className="py-3.5 px-4 font-bold text-[#181D27]">{row.month}</td>
                        <td className="py-3.5 px-4 text-[#535862]">{row.members} alumnos</td>
                        <td className="py-3.5 px-4 font-black text-[#181D27]">{row.mrr}</td>
                        <td className="py-3.5 px-4 font-bold text-[#039855]">{row.rate}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-xs text-[#F26522]">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ENTRENADORES */}
          {activeTab === 'trainers' && (
            <div className="bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-[#181D27]">Rendimiento de Coaches</h2>
                <p className="text-xs text-[#535862]">Miembros guiados, encuestas de satisfacción y retención por entrenador</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Camila Pérez', specialty: 'Crossfit & Funcional', members: 5, score: '4.9 ★', retRate: '96%' },
                  { name: 'Carlos Ruiz', specialty: 'Musculación & Hipertrofia', members: 3, score: '4.8 ★', retRate: '94%' },
                  { name: 'Esteban Morales', specialty: 'Cardio & Rendimiento', members: 2, score: '4.7 ★', retRate: '90%' }
                ].map((c, i) => (
                  <div key={i} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#181D27]">{c.name}</h4>
                      <span className="text-xs font-bold text-amber-500">{c.score}</span>
                    </div>
                    <p className="text-xs text-[#535862]">{c.specialty}</p>
                    <div className="pt-2 border-t border-[#E9EAEB] flex justify-between text-xs font-bold">
                      <span>{c.members} miembros</span>
                      <span className="text-[#039855]">{c.retRate} retención</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RUTINAS */}
          {activeTab === 'routines' && (
            <div className="bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-[#181D27]">Rutinas Más Populares</h2>
                <p className="text-xs text-[#535862]">Adherencia y cumplimiento de planes de entrenamiento</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Torso / Pierna (Hipertrofia 4 días)', users: 48, adherence: '89% cumplimiento', goal: 'Masa Muscular' },
                  { name: 'Fuerza 5x5 Clásica', users: 34, adherence: '94% cumplimiento', goal: 'Fuerza Máxima' },
                  { name: 'Glúteos & Piernas Enfoque Femenino', users: 42, adherence: '91% cumplimiento', goal: 'Tonificación' },
                  { name: 'Definición & MetCon HIIT', users: 28, adherence: '82% cumplimiento', goal: 'Pérdida de Grasa' }
                ].map((r, i) => (
                  <div key={i} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-[#181D27]">{r.name}</h4>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-[#E9EAEB]">{r.goal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#535862] pt-1">
                      <span>{r.users} miembros activos</span>
                      <span className="font-bold text-[#039855]">{r.adherence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal / Preview Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#E9EAEB] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#181D27] flex items-center justify-center border border-[#E9EAEB]">
                  <FileText className="w-5 h-5 text-[#F26522]" />
                </div>
                <div>
                  <h3 className="font-black text-[#181D27] text-sm">{selectedReport.title}</h3>
                  <p className="text-[11px] text-[#535862]">{selectedReport.members} · {selectedReport.date}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl text-center border border-[#E9EAEB]">
                <span className="text-[10px] uppercase font-bold text-[#535862]">Tasa Retención</span>
                <p className="text-base font-black text-[#039855] mt-0.5">{selectedReport.retentionRate}</p>
              </div>
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl text-center border border-[#E9EAEB]">
                <span className="text-[10px] uppercase font-bold text-[#535862]">Facturación</span>
                <p className="text-base font-black text-[#181D27] mt-0.5">{selectedReport.mrr}</p>
              </div>
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl text-center border border-[#E9EAEB]">
                <span className="text-[10px] uppercase font-bold text-[#535862]">Riesgo Churn</span>
                <p className="text-base font-black text-[#D92D20] mt-0.5">{selectedReport.churnRisk}</p>
              </div>
            </div>

            <div className="p-4 bg-[#ECFDF3] border border-[#A6F4C5] rounded-2xl text-xs text-[#027A48] space-y-2">
              <span className="font-bold block text-[11px] uppercase tracking-wider">PUNTOS DESTACADOS DEL PERÍODO:</span>
              <ul className="space-y-1">
                {selectedReport.highlights?.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-[#F2F4F7]">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-xs font-semibold text-[#535862] hover:bg-neutral-100 rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  window.print();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Informe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
