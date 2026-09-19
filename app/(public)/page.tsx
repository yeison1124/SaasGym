'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  ArrowRight,
  Check,
  Sparkles,
  Activity,
  Trophy,
  AlertTriangle,
  Calendar,
  MessageSquare,
  FileText,
  Users,
  DollarSign,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const [memberCount, setMemberCount] = useState<number>(300);
  const [monthlyFee, setMonthlyFee] = useState<number>(30);

  // Economic calculations from Section 2.2 of PRD
  const churnNormal = Math.round(memberCount * 0.08); // 8% monthly churn
  const revenueLost = churnNormal * monthlyFee;
  const churnWithGetGym = Math.round(memberCount * 0.05); // 5% monthly churn
  const membersSaved = churnNormal - churnWithGetGym;
  const savings = membersSaved * monthlyFee;
  const roi = Math.max(1, Math.round(savings / 17));

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex flex-col font-sans">
      {/* 1. TOP NAVBAR (Matching Image 1) */}
      <header className="w-full border-b border-[#EBE7DF]/80 bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#535862]">
            <a href="#beneficios" className="hover:text-[#181D27] transition-colors">Beneficios</a>
            <a href="#como-funciona" className="hover:text-[#181D27] transition-colors">Cómo funciona</a>
            <a href="#precios" className="hover:text-[#181D27] transition-colors">Precios</a>
            <a href="#preguntas" className="hover:text-[#181D27] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#181D27] hover:bg-[#EBE7DF]/50 transition-all"
            >
              <span>→</span> Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-sm font-semibold shadow-sm transition-all"
            >
              Probar gratis <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Matching Image 1) */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy and CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-xs font-semibold text-[#535862] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
                Hecho en LATAM para dueños de gym
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#181D27] leading-[1.08]">
                Sabé quién está <br />
                por dejar tu gym <br />
                <span className="text-[#F26522]">antes</span> que se <br />
                vaya.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#535862] leading-relaxed max-w-xl">
                GetGym calcula el riesgo de cada miembro, automatiza tus reportes y te da el plan de acción cada mañana. Sin Excel. Sin perseguir morosos a mano.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white font-semibold text-sm shadow-md transition-all active:scale-95"
                >
                  Probar gratis 14 días
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF] font-semibold text-sm shadow-sm transition-all"
                >
                  Cómo funciona
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-5 text-xs font-medium text-[#535862] pt-1">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Sin tarjeta
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Setup en 5 min
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#16A34A]" /> En español
                </span>
              </div>

              {/* Country Flags */}
              <div className="pt-8 border-t border-[#EBE7DF]/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2.5">
                  EN USO EN
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-semibold text-[#535862]">
                  <span>🇨🇴 Colombia</span>
                  <span>·</span>
                  <span>🇲🇽 México</span>
                  <span>·</span>
                  <span>🇦🇷 Argentina</span>
                  <span>·</span>
                  <span>🇨🇱 Chile</span>
                  <span>·</span>
                  <span>🇵🇪 Perú</span>
                  <span>·</span>
                  <span>🇪🇨 Ecuador</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live App Preview Card (Matching Image 1) */}
            <div className="lg:col-span-6 relative">
              {/* Main White Card */}
              <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 space-y-5">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    En vivo
                  </span>
                  <span className="text-xs font-medium text-[#9CA3AF]">hoy 09:14</span>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                    RESUMEN OPERATIVO · IRON STRENGTH
                  </div>
                  <h2 className="text-xl font-black text-[#181D27] mt-0.5">
                    Buen día, Roberto.
                  </h2>
                  <p className="text-xs text-[#535862] mt-0.5">
                    Hay <strong className="text-[#181D27]">3 miembros en riesgo alto</strong> que necesitan tu atención esta semana.
                  </p>
                </div>

                {/* 2 Stat Boxes */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF]">
                    <div className="w-7 h-7 rounded-xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center mb-2">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      SCORE PROMEDIO
                    </div>
                    <div className="text-2xl font-black text-[#181D27]">62</div>
                    <div className="text-[10px] text-[#535862] mt-0.5">-8 vs semana pasada</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF]">
                    <div className="w-7 h-7 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center mb-2">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      RETENCIÓN MENSUAL
                    </div>
                    <div className="text-2xl font-black text-[#181D27]">88%</div>
                    <div className="text-[10px] text-[#16A34A] font-medium mt-0.5">+11 puntos</div>
                  </div>
                </div>

                {/* Riesgo Alto Card Container */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F26522]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Riesgo alto
                  </div>

                  <div className="space-y-2.5 divide-y divide-[#EBE7DF]">
                    {/* Item 1 */}
                    <div className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Daniela Castro</div>
                        <div className="text-[11px] text-[#535862]">Sin asistir hace 9 días</div>
                      </div>
                      <a
                        href="https://wa.me/573124567890?text=Hola%20Daniela!%20Te%20escribimos%20de%20Iron%20Strength.%20%C2%A1Te%20extra%C3%B1amos%20en%20el%20gym!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFEA] text-xs font-semibold text-[#181D27] border border-[#EBE7DF] transition-all shadow-2xs"
                      >
                        Llamar
                      </a>
                    </div>

                    {/* Item 2 */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Mariana Soto</div>
                        <div className="text-[11px] text-[#535862]">Frecuencia bajó 60%</div>
                      </div>
                      <a
                        href="https://wa.me/573152223344?text=Hola%20Mariana!%20%C2%A1Carlos%20te%20dej%C3%B3%20lista%20tu%20nueva%20rutina!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFEA] text-xs font-semibold text-[#181D27] border border-[#EBE7DF] transition-all shadow-2xs"
                      >
                        Llamar
                      </a>
                    </div>

                    {/* Item 3 */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Pedro González</div>
                        <div className="text-[11px] text-[#535862]">Pago atrasado 12 días</div>
                      </div>
                      <a
                        href="https://wa.me/573109876543?text=Hola%20Pedro!%20Vimos%20que%20venci%C3%B3%20tu%20membres%C3%ADa.%20%C2%A1Pasate%20hoy!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFEA] text-xs font-semibold text-[#181D27] border border-[#EBE7DF] transition-all shadow-2xs"
                      >
                        Llamar
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-[#535862]">
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                    📅 22 check-ins
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                    💬 4 notas
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE7DF]">
                    📄 Reporte listo
                  </div>
                </div>
              </div>

              {/* Floating Achievement Toast (Matching bottom left in Image 1) */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 z-20 p-3.5 pr-5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center shrink-0 font-bold">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-[#181D27]">
                    ¡María desbloqueó "Mes perfecto"!
                  </div>
                  <div className="text-[11px] text-[#535862]">
                    16 asistencias · enviado al feed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CALCULADORA DE RETENCIÓN & ROI */}
        <section id="como-funciona" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-y border-[#EBE7DF]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26522]">
                Calculadora de Retención
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27] mt-1">
                ¿Cuánto dinero estás perdiendo por mes?
              </h2>
              <p className="text-sm text-[#535862] mt-2">
                Retener 2 miembros más al mes ya paga la herramienta por completo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] border border-[#EBE7DF] rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-bold text-[#181D27]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#F26522]" /> Miembros activos:
                    </span>
                    <span className="text-lg font-black text-[#F26522]">{memberCount} miembros</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={memberCount}
                    onChange={(e) => setMemberCount(Number(e.target.value))}
                    className="w-full h-2 bg-[#EBE7DF] rounded-lg appearance-none cursor-pointer accent-[#F26522]"
                  />
                  <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1">
                    <span>50</span>
                    <span>300 (promedio)</span>
                    <span>1,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-bold text-[#181D27]">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#16A34A]" /> Cuota mensual promedio:
                    </span>
                    <span className="text-lg font-black text-[#16A34A]">${monthlyFee} USD</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full h-2 bg-[#EBE7DF] rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
                  />
                  <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1">
                    <span>$15 USD</span>
                    <span>$30 USD</span>
                    <span>$100 USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs space-y-1.5 text-[#535862]">
                  <div className="flex justify-between">
                    <span>Abandono estimado normal (8%/mes):</span>
                    <span className="text-[#F26522] font-bold">{churnNormal} miembros / mes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingreso mensual que se evapora hoy:</span>
                    <span className="text-[#F26522] font-black text-sm">-${revenueLost} USD / mes</span>
                  </div>
                </div>
              </div>

              {/* Result card */}
              <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 text-center shadow-md">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-3">
                  Ganancia Neta con GetGym
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#16A34A]">
                  +${savings} USD
                </div>
                <div className="text-sm font-bold text-[#181D27] mt-1">
                  Ingreso recurrente salvado cada mes
                </div>
                <p className="text-xs text-[#535862] mt-2">
                  Al reducir el churn al 5%, retenés <strong>{membersSaved} miembros más</strong> todos los meses.
                </p>

                <div className="mt-6 pt-5 border-t border-[#EBE7DF] flex items-center justify-around text-center">
                  <div>
                    <div className="text-[11px] text-[#9CA3AF]">Plan Starter</div>
                    <div className="text-base font-bold text-[#181D27]">$17 USD/mes</div>
                  </div>
                  <div className="h-6 w-px bg-[#EBE7DF]" />
                  <div>
                    <div className="text-[11px] text-[#9CA3AF]">Retorno de Inversión</div>
                    <div className="text-base font-black text-[#F26522]">{roi}x veces</div>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="mt-5 block w-full py-3 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Probar con mi gimnasio gratis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PLANES Y PRECIOS */}
        <section id="precios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26522]">
              Planes Transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27] mt-1">
              Planes que se pagan con 1 o 2 miembros retenidos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* FREE */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-black text-[#181D27]">Free</h3>
                <p className="text-xs text-[#535862] mt-1">Para arrancar sin costo.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-[#181D27]">$0</span>
                  <span className="text-xs text-[#9CA3AF] ml-1">USD/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#535862]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Hasta 20 miembros</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> 1 entrenador</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Dashboard básico</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Control de asistencias</li>
                </ul>
              </div>
              <Link href="/register" className="mt-6 block text-center py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition-all">
                Comenzar gratis
              </Link>
            </div>

            {/* STARTER */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border-2 border-[#181D27] flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F26522] text-white text-[10px] font-extrabold uppercase tracking-wider">
                Más Elegido · 14 Días Gratis
              </div>
              <div>
                <h3 className="text-lg font-black text-[#181D27]">Starter</h3>
                <p className="text-xs text-[#535862] mt-1">El motor de retención para gimnasios medianos.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-[#181D27]">$17</span>
                  <span className="text-xs text-[#9CA3AF] ml-1">USD/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#181D27] font-medium">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#F26522]" /> <strong>Hasta 150 miembros</strong></li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#F26522]" /> 3 entrenadores</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#F26522]" /> <strong>Score de riesgo de abandono</strong></li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#F26522]" /> Rutinas y pagos</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#F26522]" /> WhatsApp de 1 clic</li>
                </ul>
              </div>
              <Link href="/register" className="mt-6 block text-center py-2.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white text-xs font-bold shadow-sm transition-all">
                Probar 14 días gratis
              </Link>
            </div>

            {/* PRO */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-black text-[#181D27]">Pro</h3>
                <p className="text-xs text-[#535862] mt-1">Gimnasios consolidados con comunidad.</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-[#181D27]">$39</span>
                  <span className="text-xs text-[#9CA3AF] ml-1">USD/mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#535862]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Hasta 500 miembros</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> 10 entrenadores</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Reportes de cohortes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16A34A]" /> Feed de comunidad</li>
                </ul>
              </div>
              <Link href="/register" className="mt-6 block text-center py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition-all">
                Elegir Pro
              </Link>
            </div>

            {/* ENTERPRISE */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-black text-[#181D27]">Enterprise</h3>
                <p className="text-xs text-[#535862] mt-1">Cadenas multi-sede.</p>
                <div className="my-5">
                  <span className="text-2xl font-black text-[#181D27]">A medida</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#535862]">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#181D27]" /> Miembros ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#181D27]" /> Multi-sede</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#181D27]" /> API & Soporte VIP</li>
                </ul>
              </div>
              <a href="mailto:hola@getgym.io" className="mt-6 block text-center py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition-all">
                Contactar
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#EBE7DF] py-8 px-4 sm:px-8 bg-[#FFFFFF] text-xs text-[#535862]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-[#181D27]">Dashboard Dueño</Link>
            <Link href="/app" className="hover:text-[#181D27]">Portal Miembro</Link>
            <Link href="/login" className="hover:text-[#181D27]">Iniciar Sesión</Link>
            <Link href="/admin" className="hover:text-[#181D27]">SuperAdmin</Link>
            <span>© 2024 GetGym</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
