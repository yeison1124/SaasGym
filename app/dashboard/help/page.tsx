'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import {
  Search,
  Users,
  AlertTriangle,
  Dumbbell,
  CreditCard,
  FileText,
  Sparkles,
  Mail,
  ChevronDown,
  Globe,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  const sections = [
    {
      id: 'members',
      title: 'Gestión de miembros y alertas',
      desc: 'Altas, planes, semáforo de churn y contacto por WhatsApp.',
      icon: Users,
      href: '/dashboard/members',
      fullGuide: [
        '1. Accede a "Miembros" en tu menú lateral.',
        '2. Filtra socios por estado (En Riesgo, Activos, Inactivos).',
        '3. Haz clic en el botón de WhatsApp junto al socio en riesgo para abrir un chat con mensaje prediseñado.',
        '4. Asigna entrenadores o cambia de plan haciendo clic en la ficha del miembro.'
      ]
    },
    {
      id: 'risk',
      title: 'Score de riesgo de abandono',
      desc: 'Cómo se calcula y cómo actuar sobre las alertas de inactividad.',
      icon: AlertTriangle,
      fullGuide: [
        '• Score 1-39 (Bajo Riesgo): Asistencia regular (3+ veces por semana) y pagos al día.',
        '• Score 40-69 (Riesgo Medio): Asistencia disminuida en un 50% en las últimas dos semanas.',
        '• Score 70-100 (Alto Riesgo): Más de 10 días continuos sin asistir o membresía vencida.',
        '• Acción recomendada: Contactar por WhatsApp antes de que transcurran 14 días.'
      ]
    },
    {
      id: 'routines',
      title: 'Biblioteca de rutinas & ejercicios',
      desc: 'Crear, importar plantillas pre-armadas y asignar a miembros.',
      icon: Dumbbell,
      href: '/dashboard/routines',
      fullGuide: [
        '1. Dirígete a "Rutinas" y pulsa "Crear Nueva Rutina".',
        '2. Puedes usar el botón "Plantillas Pre-armadas" para importar programas completos como "Hipertrofia 4 días" o "Fuerza 5x5".',
        '3. Abre el "Catálogo de Ejercicios" para añadir ejercicios con series, repeticiones y descansos recomendados.',
        '4. Asigna la rutina directamente a los socios que elijas.'
      ]
    },
    {
      id: 'payments',
      title: 'Registro de cobros y caja',
      desc: 'Registrar pagos en efectivo, tarjeta o transferencias.',
      icon: CreditCard,
      href: '/dashboard/payments',
      fullGuide: [
        '1. Entra a "Pagos" y presiona "Registrar Cobro".',
        '2. Selecciona el miembro, ingresa el monto, método de pago y periodo en meses.',
        '3. Al marcar como pagado, el estado del miembro se reactiva a "Activo" automáticamente.'
      ]
    },
    {
      id: 'reports',
      title: 'Reportes ejecutivos & Snapshots',
      desc: 'Generar informes de retención, facturación y exportar en PDF.',
      icon: FileText,
      href: '/dashboard/reports',
      fullGuide: [
        '1. En "Reportes", consulta el historial mensual de retención y facturación.',
        '2. Haz clic en "Generar Snapshot" para capturar la métrica exacta en tiempo real.',
        '3. Presiona "Imprimir / PDF" para obtener una versión lista para reuniones de directorio o gerencia.'
      ]
    },
    {
      id: 'trainers',
      title: 'Equipo de entrenadores',
      desc: 'Invitar coaches, configurar turnos y balancear miembros.',
      icon: Sparkles,
      href: '/dashboard/trainers',
      fullGuide: [
        '1. En "Entrenadores", presiona "Invitar Entrenador".',
        '2. Configura su turno de trabajo (Mañana, Tarde, Completo) y especialidad.',
        '3. Consulta la cantidad de alumnos asignados a cada coach y supervisa su retención.'
      ]
    }
  ];

  const faqs = [
    {
      q: '¿Cómo calcula la plataforma el score de riesgo de abandono?',
      a: 'El algoritmo evalúa la frecuencia de asistencia en los últimos 30 días, la variación respecto al mes previo, el estado de los pagos y los días transcurridos desde el último check-in. Un puntaje mayor a 70 indica alta probabilidad de abandono.'
    },
    {
      q: '¿Cómo funciona el botón de WhatsApp en la ficha del miembro?',
      a: 'Abre automáticamente un chat de WhatsApp con un mensaje prellenado y personalizado (nombre del socio, días sin asistir o recordatorio de pago), facilitando la reactivación en menos de 5 segundos.'
    },
    {
      q: '¿Puedo asignar una misma rutina a varios miembros?',
      a: 'Sí. Puedes crear una rutina base (por ejemplo "Hipertrofia Principiante") y luego asignarla a todos los socios que desees desde la tabla de miembros o su perfil individual.'
    },
    {
      q: '¿Cómo registro un pago en efectivo o transferencia?',
      a: 'Ingresa a la sección "Pagos", haz clic en "+ Registrar cobro", selecciona el miembro, método de pago, monto y periodo. Esto actualizará inmediatamente su estado a "Activo" y su fecha de vencimiento.'
    }
  ];

  const ownerTourSteps = [
    {
      title: '1. Dashboard Operativo',
      desc: 'Supervisa tu tasa de retención mensual, ingresos recurrentes (MRR) y el semáforo de riesgo de abandono.',
      route: '/dashboard',
      tag: 'Métricas'
    },
    {
      title: '2. Gestión de Miembros & Alertas',
      desc: 'Visualiza a cada alumno, su nivel de riesgo y envía mensajes de reactivación por WhatsApp con 1 clic.',
      route: '/dashboard/members',
      tag: 'Retención'
    },
    {
      title: '3. Rutinas & Catálogo de Ejercicios',
      desc: 'Crea rutinas personalizadas, importa plantillas pre-armadas y añade videos instructivos para tus miembros.',
      route: '/dashboard/routines',
      tag: 'Entrenamiento'
    },
    {
      title: '4. Entrenadores & Turnos',
      desc: 'Invita a tus instructores, asigna alumnos y balancea las cargas de trabajo por turno horario.',
      route: '/dashboard/trainers',
      tag: 'Personal'
    },
    {
      title: '5. Cobros, Facturación & Reportes',
      desc: 'Controla pagos pendientes, genera snapshots ejecutivos y exporta balances imprimibles en PDF.',
      route: '/dashboard/payments',
      tag: 'Finanzas'
    }
  ];

  const filteredSections = searchQuery
    ? sections.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections;

  const filteredFaqs = searchQuery
    ? faqs.filter(f =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar gymName="Iron Strength" highRiskCount={0} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-10">
          {/* Top Hero Banner */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E9EAEB] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAF0E6] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F5EE] border border-[#E9EAEB] rounded-full text-[11px] font-bold text-[#535862] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>CENTRO DE AYUDA PARA DUEÑOS</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTourStep(0);
                    setIsTourOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#181D27] hover:bg-black text-white rounded-full text-[11px] font-bold transition shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>Iniciar Tour del Dueño</span>
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#181D27] leading-tight">
                ¿Cómo podemos ayudarte con tu gimnasio?
              </h1>

              <p className="text-xs text-[#535862] leading-relaxed">
                Encuentra respuestas rápidas sobre cómo reducir el churn, gestionar cobros, crear rutinas e interactuar con tus entrenadores.
              </p>

              {/* Search Bar */}
              <div className="pt-2">
                <div className="relative max-w-xl">
                  <Search className="w-4 h-4 text-[#A4A7AE] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: cómo reducir el riesgo de abandono, registrar pago, plantillas..."
                    className="w-full pl-11 pr-10 py-3 bg-[#FAF8F5] border border-[#D5D7DA] rounded-2xl text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explorá por sección */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#181D27]">Guías por Módulo</h2>
                <p className="text-xs text-[#535862] mt-0.5">Haz clic para ver el paso a paso detallado.</p>
              </div>
              <span className="text-xs text-[#717680] font-semibold">{filteredSections.length} guías</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedTopic(sec)}
                    className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm hover:border-[#181D27] hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#F9F5EE] border border-[#E9EAEB] flex items-center justify-center text-[#535862] group-hover:text-[#F26522] transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-[#717680] group-hover:text-[#181D27] flex items-center gap-1">
                        Ver guía <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#181D27] group-hover:text-[#F26522] transition">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-[#535862] mt-1 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preguntas Frecuentes & Card Soporte */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#181D27]">Preguntas Frecuentes de Dueños</h2>
              <p className="text-xs text-[#535862] mt-0.5">Respuestas a las dudas más comunes sobre la operación con GymPulse.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* FAQ Accordion */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm divide-y divide-[#F2F4F7]">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                    >
                      <span className="text-sm font-bold text-[#181D27] group-hover:text-[#F26522] transition">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#535862] shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180 text-[#181D27]' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="text-xs text-[#535862] mt-2.5 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E9EAEB]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Need More Help Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F9F5EE] border border-[#E9EAEB] text-[#535862] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F26522]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#181D27]">Soporte para Dueños</h3>
                    <p className="text-xs text-[#535862] mt-1 leading-relaxed">
                      Escríbenos a <strong className="text-[#181D27]">soporte@gympulse.app</strong> o chatea con nuestro equipo de Customer Success.
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/573005551234?text=Hola,%20soy%20Roberto%20de%20Iron%20Strength%20y%20requiero%20asistencia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: TOUR DEL DUEÑO */}
      {isTourOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26522] bg-[#FDF2EC] px-3 py-1 rounded-full border border-[#FAD7C5]">
                PASO {tourStep + 1} DE {ownerTourSteps.length} • {ownerTourSteps[tourStep].tag}
              </span>
              <button
                onClick={() => setIsTourOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-[#181D27]">
                {ownerTourSteps[tourStep].title}
              </h3>
              <p className="text-xs text-[#535862] leading-relaxed">
                {ownerTourSteps[tourStep].desc}
              </p>

              <div className="flex gap-1.5 pt-2">
                {ownerTourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      i === tourStep ? 'bg-[#181D27]' : i < tourStep ? 'bg-[#039855]' : 'bg-[#E9EAEB]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#F2F4F7]">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep(tourStep - 1)}
                className="px-4 py-2 text-xs font-bold text-[#717680] hover:text-[#181D27] disabled:opacity-30 inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={ownerTourSteps[tourStep].route}
                  onClick={() => setIsTourOpen(false)}
                  className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F2F4F7] text-[#181D27] text-xs font-bold rounded-xl border border-[#E9EAEB] transition"
                >
                  Abrir vista
                </Link>

                {tourStep < ownerTourSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setTourStep(tourStep + 1)}
                    className="px-5 py-2 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    Siguiente <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsTourOpen(false)}
                    className="px-5 py-2 bg-[#039855] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Finalizar tour
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOPIC DETAIL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#F9F5EE] flex items-center justify-center text-[#F26522]">
                  <selectedTopic.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#181D27]">{selectedTopic.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#535862]">{selectedTopic.desc}</p>

              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E9EAEB] space-y-2">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                  GUÍA DE OPERACIÓN:
                </span>
                {selectedTopic.fullGuide.map((step: string, idx: number) => (
                  <p key={idx} className="text-xs text-[#181D27] font-medium leading-relaxed">
                    {step}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 text-xs font-semibold text-[#717680] hover:text-[#181D27]"
              >
                Cerrar
              </button>
              {selectedTopic.href && (
                <Link
                  href={selectedTopic.href}
                  className="px-5 py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <span>Abrir {selectedTopic.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
