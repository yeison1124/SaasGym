'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
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
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  Flame,
  Search,
  X
} from 'lucide-react';

const DEFAULT_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing_period: 'monthly',
    description: 'Para arrancar sin costo y probar las funciones esenciales.',
    features: ['Hasta 30 miembros activos', 'Dashboard básico de asistencia', '1 administrador', 'Soporte por email'],
    badge: null,
    is_popular: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 17,
    billing_period: 'monthly',
    description: 'El motor de retención para gimnasios independientes con foco en crecimiento.',
    features: [
      'Hasta 150 miembros activos',
      'Score de riesgo automático (IA)',
      'Reportes mensuales por miembro',
      'Hasta 3 entrenadores',
      'Soporte vía chat',
    ],
    badge: 'MÁS ELEGIDO · 14 DÍAS GRATIS',
    is_popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 48,
    billing_period: 'monthly',
    description: 'Para gimnasios establecidos que quieren automatizar su retención al 100%.',
    features: [
      'Hasta 500 miembros activos',
      'Reportes automáticos y cohortes',
      'Integraciones (WhatsApp Cloud, Pasarelas)',
      'Hasta 10 entrenadores',
      'Soporte prioritario 24/7',
    ],
    badge: null,
    is_popular: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 120,
    billing_period: 'monthly',
    description: 'Para cadenas y gimnasios con múltiples sedes y franquicias.',
    features: [
      'Miembros ilimitados',
      'Soporte Multi-sede y multi-tenant',
      'API y webhooks para torniquetes',
      'Onboarding dedicado personalizado',
      'Coach asignado de Customer Success',
    ],
    badge: 'ANUAL CON DESCUENTO',
    is_popular: false,
  },
];

const FAQS_DATA = [
  {
    id: 'faq-1',
    category: 'Funcionamiento',
    q: '¿Cómo detecta GymPulse el riesgo de abandono de un miembro?',
    a: 'Nuestro algoritmo predictivo analiza la frecuencia de asistencia de los últimos 30 días, la variación respecto a sus semanas habituales, la fecha de expiración de la cuota y los días transcurridos desde el último entrenamiento. Si un socio reduce drásticamente sus visitas o lleva más de 10 días sin asistir, su Score de Riesgo sube inmediatamente a la zona roja (+70 puntos).'
  },
  {
    id: 'faq-2',
    category: 'Integraciones',
    q: '¿Cómo funciona el botón de reactivación por WhatsApp?',
    a: 'En la lista de miembros en riesgo, solo debes hacer clic en el ícono de WhatsApp junto al socio. GymPulse abre automáticamente tu WhatsApp con un mensaje amigable y personalizado (con el nombre del socio y el número de días transcurridos) para invitarlo a volver a entrenar sin que tengas que redactarlo a mano.'
  },
  {
    id: 'faq-3',
    category: 'Migración',
    q: '¿Puedo importar la base de datos de mis alumnos desde un Excel o CSV?',
    a: '¡Sí, totalmente! Puedes subir tu lista de socios en formato CSV/Excel con nombre, correo, teléfono y fecha de vencimiento. La plataforma los procesará y comenzará a medir su nivel de retención de inmediato.'
  },
  {
    id: 'faq-4',
    category: 'Hardware',
    q: '¿Necesito comprar algún lector de huella o torniquete especial?',
    a: 'No es obligatorio. Puedes registrar el check-in de asistencia directamente desde el panel en cualquier tablet, computadora o celular de recepción en 1 segundo, o bien conectar tu sistema existente mediante nuestra API/Webhooks.'
  },
  {
    id: 'faq-5',
    category: 'Precios',
    q: '¿Tienen período de prueba gratis y qué pasa al terminar?',
    a: 'Ofrecemos 14 días de prueba completamente gratis sin pedir tarjeta de crédito. Durante este tiempo tienes acceso ilimitado a todas las funciones del Plan Pro para evaluar el impacto real en la retención de tu gimnasio.'
  },
  {
    id: 'faq-6',
    category: 'Miembros',
    q: '¿Qué experiencia tienen mis socios en su portal?',
    a: 'Tus alumnos acceden a su propio portal web donde pueden ver su rutina asignada con videos de técnica, registrar fotos de progreso antes/después, reservar clases en la agenda, desbloquear medallas por constancia y compartir sus logros en el feed comunitario de tu gimnasio.'
  }
];

export default function LandingPage() {
  const supabase = createClient();
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [memberCount, setMemberCount] = useState<number>(300);
  const [monthlyFee, setMonthlyFee] = useState<number>(30);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState<string>('');

  useEffect(() => {
    async function loadLivePlans() {
      try {
        const { data, error } = await supabase
          .from('platform_plans')
          .select('*')
          .order('order_index', { ascending: true });

        if (data && data.length > 0) {
          setPlans(data);
        }
      } catch (err) {
        console.error('Error loading live plans:', err);
      }
    }
    loadLivePlans();
  }, [supabase]);

  // Dynamic starter price
  const starterPlan = plans.find((p) => p.id === 'starter') || DEFAULT_PLANS[1];
  const starterPrice = Number(starterPlan.price) > 0 ? Number(starterPlan.price) : 17;

  // Economic calculations from PRD
  const churnNormal = Math.round(memberCount * 0.08); // 8% monthly churn
  const revenueLost = churnNormal * monthlyFee;
  const churnWithGymPulse = Math.round(memberCount * 0.05); // 5% monthly churn
  const membersSaved = churnNormal - churnWithGymPulse;
  const savings = membersSaved * monthlyFee;
  const roi = Math.max(1, Math.round(savings / starterPrice));

  const filteredFaqs = faqSearch.trim()
    ? FAQS_DATA.filter(f =>
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(faqSearch.toLowerCase())
      )
    : FAQS_DATA;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex flex-col font-sans selection:bg-[#F26522] selection:text-white">
      {/* 1. TOP NAVBAR */}
      <header className="w-full border-b border-[#EBE7DF]/80 bg-[#FAF8F5]/85 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition transform active:scale-95">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#535862]">
            <a href="#beneficios" className="hover:text-[#181D27] transition-colors">Beneficios</a>
            <a href="#como-funciona" className="hover:text-[#181D27] transition-colors">Calculadora ROI</a>
            <a href="#precios" className="hover:text-[#181D27] transition-colors">Precios</a>
            <a href="#preguntas" className="hover:text-[#F26522] text-[#181D27] font-bold transition-colors flex items-center gap-1">
              <span>Preguntas Frecuentes</span>
              <span className="w-2 h-2 rounded-full bg-[#F26522] animate-ping" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#181D27] hover:bg-[#EBE7DF]/50 transition-all cursor-pointer"
            >
              <span>→</span> Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Probar gratis</span>
              <ArrowRight className="w-4 h-4 text-[#F26522]" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subtle decorative background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#F26522]/10 via-[#FFA066]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Column: Copy and CTAs */}
            <div className="lg:col-span-6 space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#EBE7DF] text-xs font-bold text-[#535862] shadow-xs animate-float">
                <Sparkles className="w-4 h-4 text-[#F26522]" />
                <span>SaaS de Retención #1 para Gimnasios en LATAM</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#181D27] leading-[1.08]">
                Sabé quién está <br />
                por dejar tu gym <br />
                <span className="text-[#F26522] relative inline-block">
                  antes
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 9C25 3 75 3 98 9" stroke="#F26522" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span> que se vaya.
              </h1>

              <p className="text-base sm:text-lg text-[#535862] leading-relaxed max-w-xl">
                GymPulse calcula el score de riesgo de abandono de cada miembro, automatiza la reactivación por WhatsApp con 1 clic y te da un plan de acción cada mañana. Sin planillas de Excel.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#181D27] hover:bg-black text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all transform active:scale-95 cursor-pointer group"
                >
                  <span>Probar gratis 14 días</span>
                  <ArrowRight className="w-4 h-4 text-[#F26522] group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#181D27] border border-[#EBE7DF] font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-[#16A34A]" />
                  <span>Calcular mi pérdida mensual</span>
                </a>
              </div>

              <div className="pt-2 flex items-center gap-5 text-xs text-[#717680] font-semibold">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#039855]" /> Sin tarjeta de crédito</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#039855]" /> Configuración en 3 minutos</span>
              </div>
            </div>

            {/* Right Column: Hero Live Interactive Preview */}
            <div className="lg:col-span-6 animate-slide-up">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl space-y-5 relative group hover:border-[#181D27]/40 transition-all">
                {/* Header of preview */}
                <div className="flex items-center justify-between border-b border-[#EBE7DF] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#D92D20] animate-ping" />
                    <div>
                      <span className="text-xs font-black text-[#181D27] block">Semáforo de Abandono (Tiempo Real)</span>
                      <span className="text-[10px] text-[#717680]">Iron Strength Medellín · 14 en alerta</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FEF3F2] border border-[#FECDCA] text-[#D92D20] text-[10px] font-black uppercase">
                    Acción Inmediata
                  </span>
                </div>

                {/* Member alerts preview */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] hover:bg-white hover:border-[#D92D20] hover:shadow-md transition-all flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        CG
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Carlos Gómez</div>
                        <div className="text-[11px] text-[#535862]">Sin asistencia hace 14 días · Plan Black</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-[#D92D20] text-white text-[10px] font-black shadow-xs">
                        Score 88
                      </span>
                      <a
                        href="https://wa.me/?text=Hola%20Carlos,%20te%20extrañamos%20en%20el%20gym!"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#039855] hover:bg-[#039855] hover:text-white transition shadow-2xs"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] hover:bg-white hover:border-[#F26522] hover:shadow-md transition-all flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        VR
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Valentina Ruiz</div>
                        <div className="text-[11px] text-[#535862]">Frecuencia cayó un 60% esta quincena</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-[#F26522] text-white text-[10px] font-black shadow-xs">
                        Score 74
                      </span>
                      <a
                        href="https://wa.me/?text=Hola%20Valentina,%20notamos%20que%20bajaste%20tu%20frecuencia,%20¿todo%20bien?"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#039855] hover:bg-[#039855] hover:text-white transition shadow-2xs"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#ECFDF3] border border-[#A6F4C5] rounded-2xl flex items-center justify-between text-xs text-[#027A48]">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-[#039855]" />
                    <span>8 de cada 10 socios vuelven tras el mensaje</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-[#039855] text-white px-2 py-0.5 rounded">
                    +82% Éxito
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BENEFICIOS CLAVE */}
        <section id="beneficios" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26522]">
              RETENCIÓN & EXPERIENCIA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27] mt-1">
              Todo lo que necesitás para que tus socios nunca se vayan
            </h2>
            <p className="text-xs sm:text-sm text-[#535862] mt-2">
              Una suite integral diseñada exclusivamente para dueños de gimnasios y sus miembros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-[#EBE7DF] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#181D27]">Semáforo de Abandono (IA)</h3>
              <p className="text-xs text-[#535862] leading-relaxed">
                Detectá patrones de ausentismo antes de que el socio tome la decisión de cancelar. Recibí alertas cada mañana para actuar a tiempo.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#EBE7DF] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] text-[#039855] flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#181D27]">Reactivación en 1 Clic</h3>
              <p className="text-xs text-[#535862] leading-relaxed">
                Mensajes personalizados directos a WhatsApp listos para enviar. Sin integraciones complejas ni configuraciones técnicas.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#EBE7DF] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F5EE] text-[#D97706] flex items-center justify-center font-bold">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-[#181D27]">App de Miembros Gamificada</h3>
              <p className="text-xs text-[#535862] leading-relaxed">
                Tus alumnos siguen sus rutinas con videos, fotos de progreso antes/después, suben de nivel con XP y se motivan en la comunidad del gym.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CALCULADORA DE RETENCIÓN & ROI */}
        <section id="como-funciona" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-y border-[#EBE7DF]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26522]">
                CALCULADORA DE RETENCIÓN & ROI
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27] mt-1">
                ¿Cuánto dinero estás perdiendo por mes?
              </h2>
              <p className="text-xs sm:text-sm text-[#535862] mt-2">
                Retener solo 2 miembros más al mes ya paga la suscripción completa de GymPulse.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] border border-[#EBE7DF] rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2 text-sm font-bold text-[#181D27]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#F26522]" /> Miembros activos del gym:
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
                    className="w-full h-2.5 bg-[#EBE7DF] rounded-lg appearance-none cursor-pointer accent-[#F26522]"
                  />
                  <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1 font-semibold">
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
                    className="w-full h-2.5 bg-[#EBE7DF] rounded-lg appearance-none cursor-pointer accent-[#16A34A]"
                  />
                  <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1 font-semibold">
                    <span>$15 USD</span>
                    <span>$30 USD</span>
                    <span>$100 USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs space-y-1.5 text-[#535862]">
                  <div className="flex justify-between">
                    <span>Abandono mensual estimado (8%/mes):</span>
                    <span className="text-[#F26522] font-bold">{churnNormal} miembros / mes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingreso mensual que se te escapa hoy:</span>
                    <span className="text-[#F26522] font-black text-sm">-${revenueLost} USD / mes</span>
                  </div>
                </div>
              </div>

              {/* Result card */}
              <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transition-all">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-xs font-black uppercase tracking-wider mb-3">
                  Ganancia Neta con GymPulse
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#039855]">
                  +${savings} USD
                </div>
                <div className="text-sm font-black text-[#181D27] mt-1">
                  Ingreso recurrente salvado cada mes
                </div>
                <p className="text-xs text-[#535862] mt-2 leading-relaxed">
                  Al reducir el churn al 5%, retenés <strong>{membersSaved} miembros más</strong> todos los meses.
                </p>

                <div className="mt-6 pt-5 border-t border-[#EBE7DF] flex items-center justify-around text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9CA3AF]">Plan Starter</div>
                    <div className="text-base font-black text-[#181D27]">${starterPrice} USD/mes</div>
                  </div>
                  <div className="h-6 w-px bg-[#EBE7DF]" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9CA3AF]">Retorno (ROI)</div>
                    <div className="text-base font-black text-[#F26522]">{roi}x veces</div>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="mt-6 block w-full py-3.5 rounded-full bg-[#181D27] hover:bg-black text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Probar con mi gimnasio gratis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PLANES Y PRECIOS (LIVE FROM DATABASE) */}
        <section id="precios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F26522]">
              PLANES TRANSPARENTES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27] mt-1">
              Planes que se pagan solos con 1 o 2 miembros retenidos
            </h2>
            <p className="text-xs text-[#535862] mt-2">
              Precios sincronizados en tiempo real con la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((p) => {
              const price = Number(p.price);
              const features = Array.isArray(p.features) ? p.features : [];
              const isEnterprise = p.id === 'enterprise';
              const isPopular = Boolean(p.is_popular);

              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-3xl bg-[#FFFFFF] flex flex-col justify-between shadow-card relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPopular
                      ? 'border-2 border-[#181D27] shadow-xl ring-2 ring-[#181D27]/10'
                      : 'border border-[#EBE7DF]'
                  }`}
                >
                  {p.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs whitespace-nowrap ${
                        isEnterprise
                          ? 'bg-[#181D27] text-white'
                          : 'bg-[#F26522] text-white'
                      }`}
                    >
                      {p.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-black text-[#181D27]">{p.name}</h3>
                    <p className="text-xs text-[#535862] mt-1 min-h-[32px] leading-relaxed">
                      {p.description}
                    </p>
                    <div className="my-5">
                      <span className="text-3xl font-black text-[#181D27]">
                        ${price}
                      </span>
                      <span className="text-xs text-[#9CA3AF] ml-1">
                        USD/{p.billing_period || 'mes'}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#535862]">
                      {features.map((feat: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isPopular ? 'text-[#F26522]' : 'text-[#16A34A]'
                            }`}
                          />
                          <span className={isPopular && fIdx === 0 ? 'font-bold text-[#181D27]' : ''}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <Link
                      href="/register"
                      className={`block text-center py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isPopular
                          ? 'bg-[#181D27] hover:bg-black text-white'
                          : 'bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF]'
                      }`}
                    >
                      {p.id === 'free'
                        ? 'Comenzar gratis'
                        : isPopular
                        ? 'Probar 14 días gratis'
                        : 'Elegir ' + p.name}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. PREGUNTAS FRECUENTES (FAQ INTERACTIVO) */}
        <section id="preguntas" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-t border-[#EBE7DF]">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26522] bg-[#FDF2EC] px-3.5 py-1 rounded-full border border-[#FAD7C5]">
                RESOLVEMOS TUS DUDAS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#181D27]">
                Preguntas Frecuentes
              </h2>
              <p className="text-xs sm:text-sm text-[#535862] max-w-xl mx-auto">
                Todo lo que necesitas saber sobre cómo GymPulse ayuda a tu gimnasio a retener más miembros y facturar más.
              </p>

              {/* Search bar inside FAQ */}
              <div className="pt-3 max-w-md mx-auto relative">
                <Search className="w-4 h-4 text-[#A4A7AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Buscar en preguntas frecuentes..."
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#EBE7DF] rounded-2xl text-xs text-[#181D27] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white transition"
                />
                {faqSearch && (
                  <button
                    type="button"
                    onClick={() => setFaqSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Accordion FAQ items */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-3xl border border-[#EBE7DF] space-y-2">
                  <p className="text-xs font-bold text-[#717680]">No encontramos preguntas con "{faqSearch}".</p>
                  <button
                    onClick={() => setFaqSearch('')}
                    className="text-xs font-bold text-[#F26522] hover:underline"
                  >
                    Ver todas las preguntas
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'bg-[#FAF8F5] border-[#181D27] shadow-md'
                          : 'bg-white border-[#EBE7DF] hover:border-[#D5D7DA]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-[#717680] uppercase bg-white px-2.5 py-0.5 rounded-full border border-[#E9EAEB]">
                            {faq.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-[#181D27]">
                            {faq.q}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-[#535862] shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-[#F26522]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#535862] leading-relaxed border-t border-[#EBE7DF]/60 animate-fadeIn">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Direct Support Card banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#EBE7DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#181D27]">¿Tienes una consulta específica sobre tu sede?</h4>
                <p className="text-xs text-[#535862]">Nuestro equipo técnico y de retención responde en menos de 2 horas hábiles.</p>
              </div>
              <a
                href="https://wa.me/573005551234?text=Hola,%20quisiera%20consultar%20sobre%20el%20software%20GymPulse%20para%20mi%20gimnasio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-2xl transition shadow-md whitespace-nowrap cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#F26522]" />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA BANNER */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#181D27] p-8 sm:p-14 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26522]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522] bg-[#F26522]/10 px-3.5 py-1 rounded-full border border-[#F26522]/30 inline-block">
                EMPEZÁ HOY MISMO
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Empezá a retener socios hoy. Sin riesgo.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Probá GymPulse gratis durante 14 días. Si no recuperás al menos 3 socios en el primer mes, no pagás nada.
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F26522] hover:bg-[#d94f00] text-white font-black text-sm shadow-xl hover:shadow-2xl transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>Crear mi cuenta gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-xs transition cursor-pointer"
                >
                  <span>Acceso Dueños</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#EBE7DF] py-10 px-4 sm:px-8 bg-[#FFFFFF] text-xs text-[#535862]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <a href="#beneficios" className="hover:text-[#181D27]">Beneficios</a>
            <a href="#como-funciona" className="hover:text-[#181D27]">Calculadora ROI</a>
            <a href="#precios" className="hover:text-[#181D27]">Precios</a>
            <a href="#preguntas" className="hover:text-[#181D27]">Preguntas Frecuentes</a>
            <Link href="/login" className="hover:text-[#181D27]">Iniciar Sesión</Link>
            <Link href="/admin" className="hover:text-[#181D27]">SuperAdmin</Link>
          </div>
          <span className="text-[#9CA3AF]">© 2026 GymPulse SAS. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
