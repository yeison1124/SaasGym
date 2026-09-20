'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  Search,
  Calendar,
  Dumbbell,
  Activity,
  Trophy,
  Users,
  BookOpen,
  ChevronDown,
  Mail,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

export default function MemberHelpPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);

  const sections = [
    {
      id: 'schedule',
      title: 'Reservar y cancelar clases',
      desc: 'Cómo gestionar tu agenda de clases y elegir horario con tu gym.',
      icon: Calendar,
      href: '/member/schedule',
      fullGuide: [
        '1. Ingresa a la sección "Agenda" en el menú lateral.',
        '2. Navega entre días de la semana con los botones de flecha o el selector de mes.',
        '3. Puedes usar el botón "Filtrar" para buscar por disciplina (Crossfit, Boxeo, Yoga) o entrenador.',
        '4. Haz clic en "Reservar lugar" en cualquier clase disponible. Si ya no puedes asistir, presiona "Cancelar reserva" antes de la clase.'
      ]
    },
    {
      id: 'workout',
      title: 'Tu rutina de entrenamiento',
      desc: 'Ver, seguir series, repeticiones y videos asignados por tu coach.',
      icon: Dumbbell,
      href: '/member/workout',
      fullGuide: [
        '1. Entra a "Plan de entreno" para ver la rutina correspondiente al día.',
        '2. Haz clic en el ícono de video de cualquier ejercicio para ver la técnica adecuada.',
        '3. A medida que completes tus series, pulsa "Marcar como completado".',
        '4. Al finalizar todos los ejercicios, haz clic en "Completar entrenamiento" para ganar XP.'
      ]
    },
    {
      id: 'progress',
      title: 'Registrar progreso y medidas',
      desc: 'Subir peso, medidas corporales, fotos antes/después y récords.',
      icon: Activity,
      href: '/member/progress',
      fullGuide: [
        '1. Ve a "Progreso" para registrar tu peso actual y porcentaje graso/muscular.',
        '2. Haz clic en "Subir foto" para cargar fotos de comparación antes y después.',
        '3. Edita tus medidas corporales (pecho, cintura, cadera, brazo, muslo) haciendo clic en "Editar medidas".',
        '4. Consulta y agrega tus récords personales (PR) en Sentadilla, Peso Muerto y Press Banca.'
      ]
    },
    {
      id: 'achievements',
      title: 'Logros, niveles y medallas',
      desc: 'Desbloquear medallas por constancia, fuerza y subir nivel de atleta.',
      icon: Trophy,
      href: '/member/achievements',
      fullGuide: [
        '1. Consulta tus insignias en "Logros".',
        '2. Cada medalla muestra una barra de progreso indicando exactamente cuántos días o kg te faltan.',
        '3. Al completar hitos recibes puntos de experiencia (XP) para subir de Nivel (Novato -> Bronce -> Plata -> Oro -> Titán).'
      ]
    },
    {
      id: 'community',
      title: 'Comunidad y feed social',
      desc: 'Publicar fotos de tus logros, felicitar compañeros y ver ranking.',
      icon: Users,
      href: '/member/community',
      fullGuide: [
        '1. Escribe un mensaje o sube una foto en la caja de publicación de "Comunidad".',
        '2. Da "Me gusta" o comenta en los avances de tus compañeros de Iron Strength.',
        '3. Revisa la tabla del Ranking mensual en el lateral derecho para ver tu posición.'
      ]
    },
    {
      id: 'surveys',
      title: 'Encuestas post-entreno',
      desc: 'Evaluar tu fatiga, instalaciones y la atención de tu entrenador.',
      icon: BookOpen,
      href: '/member/surveys',
      fullGuide: [
        '1. Después de cada entreno puedes calificar tu sesión de 1 a 5 estrellas.',
        '2. Selecciona tu estado de ánimo (Cansado, Bien, Genial, Imparable).',
        '3. También puedes evaluar las instalaciones y a tu coach asignado para que el gimnasio siga mejorando.'
      ]
    }
  ];

  const faqs = [
    {
      q: '¿Cómo reservo una clase en Iron Strength?',
      a: 'Ingresá a la sección Agenda en tu menú lateral, seleccioná el día y hora de tu preferencia y hacé clic en la tarjeta de la clase para confirmar tu reserva con 1 toque.'
    },
    {
      q: '¿Cómo marco un ejercicio como completado?',
      a: 'Dentro de "Plan de entreno", hacé clic en el botón "Marcar" al lado de cada ejercicio una vez que termines tus series. Al finalizar todos, presioná "Completar sesión".'
    },
    {
      q: '¿Qué pasa si no puedo asistir a una clase reservada?',
      a: 'Podés abrir la clase en tu Agenda y presionar "Cancelar mi reserva" hasta 1 hora antes para liberar el cupo a otro compañero del gimnasio.'
    },
    {
      q: '¿Cómo subo mis fotos de progreso antes y después?',
      a: 'En la sección "Progreso", hacé clic en el botón "Subir foto", seleccioná la imagen desde tu teléfono o computadora, elegí si es tipo "Antes" o "Después" y guardá.'
    },
    {
      q: '¿Cómo cambio mis datos o contraseña?',
      a: 'En "Configuración", pestaña "Perfil" podés editar tu nombre, teléfono y peso. En la pestaña "Seguridad" podés cambiar tu contraseña y habilitar 2FA.'
    }
  ];

  const tourSteps = [
    {
      title: '1. Dashboard y Motivación',
      desc: 'Aquí ves tu próxima clase, tu racha de días entrenando, tu nivel actual y frases motivacionales del día.',
      route: '/member',
      tag: 'Inicio'
    },
    {
      title: '2. Plan de Entreno',
      desc: 'Accede a tu rutina del día personalizada por tu coach, mira videos de técnica y marca cada ejercicio completado.',
      route: '/member/workout',
      tag: 'Entrenamiento'
    },
    {
      title: '3. Progreso Físico',
      desc: 'Registra tu peso, medidas corporales (pecho, cintura, cadera), fotos de transformación y tus récords de fuerza (PR).',
      route: '/member/progress',
      tag: 'Evolución'
    },
    {
      title: '4. Agenda de Clases',
      desc: 'Reserva tus cupos en clases de Crossfit, Boxeo, Yoga o Sala de musculación con filtros por coach y horario.',
      route: '/member/schedule',
      tag: 'Reservas'
    },
    {
      title: '5. Comunidad y Gamificación',
      desc: 'Comparte fotos de tus logros con tus amigos del gimnasio, desbloquea medallas y compite amistosamente en el ranking.',
      route: '/member/community',
      tag: 'Comunidad'
    }
  ];

  const filteredSections = search
    ? sections.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase())
      )
    : sections;

  const filteredFaqs = search
    ? faqs.filter(f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-10">
          {/* Hero Banner */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#E9EAEB] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAF0E6] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F5EE] border border-[#E9EAEB] rounded-full text-[11px] font-bold text-[#535862] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>CENTRO DE AYUDA GYMPULSE</span>
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
                  <span>Iniciar Tour Interactivo</span>
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#181D27] leading-tight">
                ¿En qué podemos ayudarte hoy?
              </h1>

              <p className="text-xs text-[#535862] leading-relaxed">
                Escribe una palabra clave o explora las guías interactivas para aprender a usar cada pantalla de tu app de miembro.
              </p>

              {/* Search Bar */}
              <div className="pt-2">
                <div className="relative max-w-xl">
                  <Search className="w-4 h-4 text-[#A4A7AE] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar guías (ej: reservar clase, fotos de progreso, récords, cambiar contraseña...)"
                    className="w-full pl-11 pr-10 py-3 bg-[#FAF8F5] border border-[#D5D7DA] rounded-2xl text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white transition"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
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
                <h2 className="text-lg font-bold text-[#181D27]">Guías por Pantalla</h2>
                <p className="text-xs text-[#535862] mt-0.5">Haz clic en cualquier guía para ver el paso a paso o ir a la vista.</p>
              </div>
              <span className="text-xs text-[#717680] font-semibold">{filteredSections.length} guías</span>
            </div>

            {filteredSections.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-[#E9EAEB] text-center space-y-2">
                <p className="text-xs font-semibold text-[#717680]">No encontramos guías con "{search}".</p>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-xs font-bold text-[#F26522] hover:underline"
                >
                  Restablecer búsqueda
                </button>
              </div>
            ) : (
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
            )}
          </div>

          {/* Preguntas frecuentes + Soporte */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#181D27]">Preguntas Frecuentes (FAQ)</h2>
              <p className="text-xs text-[#535862] mt-0.5">Respuestas directas a las dudas comunes de miembros.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Accordion FAQs */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm divide-y divide-[#F2F4F7]">
                {filteredFaqs.length === 0 ? (
                  <p className="text-xs text-center text-[#717680] py-4">No hay preguntas que coincidan con la búsqueda.</p>
                ) : (
                  filteredFaqs.map((faq, idx) => (
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
                  ))
                )}
              </div>

              {/* Need Help Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F9F5EE] border border-[#E9EAEB] text-[#535862] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F26522]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#181D27]">¿Necesitás soporte directo?</h3>
                    <p className="text-xs text-[#535862] mt-1 leading-relaxed">
                      Escribinos a <strong className="text-[#181D27]">soporte@gympulse.app</strong> o comunícate por WhatsApp con la recepción de Iron Strength Medellín.
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/573129876543?text=Hola,%20necesito%20ayuda%20con%20mi%20cuenta%20GymPulse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition"
                >
                  Contactar Soporte por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: TOUR GUIADO PASO A PASO */}
      {isTourOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26522] bg-[#FDF2EC] px-3 py-1 rounded-full border border-[#FAD7C5]">
                PASO {tourStep + 1} DE {tourSteps.length} • {tourSteps[tourStep].tag}
              </span>
              <button
                onClick={() => setIsTourOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-[#181D27]">
                {tourSteps[tourStep].title}
              </h3>
              <p className="text-xs text-[#535862] leading-relaxed">
                {tourSteps[tourStep].desc}
              </p>

              {/* Visual Step Indicator */}
              <div className="flex gap-1.5 pt-2">
                {tourSteps.map((_, i) => (
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
                  href={tourSteps[tourStep].route}
                  onClick={() => setIsTourOpen(false)}
                  className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F2F4F7] text-[#181D27] text-xs font-bold rounded-xl border border-[#E9EAEB] transition"
                >
                  Ir a esta pantalla
                </Link>

                {tourStep < tourSteps.length - 1 ? (
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
                    <CheckCircle2 className="w-3.5 h-3.5" /> ¡Listo, finalizar tour!
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GUÍA DETALLADA DE TÓPICO */}
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
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#535862]">{selectedTopic.desc}</p>

              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E9EAEB] space-y-2">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                  PASOS A SEGUIR:
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
              <Link
                href={selectedTopic.href}
                className="px-5 py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
              >
                <span>Abrir {selectedTopic.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
