'use client';

import { useState } from 'react';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  MessageSquare,
  Clock,
  Star,
  CheckCircle2,
  BarChart3,
  Sparkles,
  Dumbbell,
  ShieldCheck,
  UserCheck,
  Building2,
  TrendingUp
} from 'lucide-react';

interface SurveyHistoryItem {
  id: string;
  type: string;
  title: string;
  date: string;
  rating: number;
  mood?: string;
  comment: string;
  coachFeedback?: string;
}

export default function MemberSurveysPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'results'>('pending');
  const [selectedSurveyType, setSelectedSurveyType] = useState<'workout' | 'facilities' | 'coach' | 'nps'>('workout');

  // Form states
  const [rating, setRating] = useState(5);
  const [secondaryRating, setSecondaryRating] = useState(5);
  const [mood, setMood] = useState('Genial');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [history, setHistory] = useState<SurveyHistoryItem[]>([
    {
      id: 'h-1',
      type: 'Post-Entreno',
      title: 'Sesión de Piernas y Core',
      date: '18 de mayo, 2026',
      rating: 5,
      mood: 'Imparable 🔥',
      comment: 'Excelente ritmo en sentadillas, me sentí con mucha energía.',
      coachFeedback: '¡Gran trabajo María! Vamos a subir 2.5 kg la próxima semana.'
    },
    {
      id: 'h-2',
      type: 'Evaluación de Coach',
      title: 'Coach Carlos Ruiz',
      date: '15 de mayo, 2026',
      rating: 5,
      comment: 'Muy atento con las posturas y me motivó en el último set.',
      coachFeedback: 'Gracias por tu feedback, siempre un placer entrenar contigo.'
    },
    {
      id: 'h-3',
      type: 'Instalaciones',
      title: 'Área de Peso Libre & Vestuarios',
      date: '10 de mayo, 2026',
      rating: 4,
      comment: 'Todo muy limpio, solo sugiero añadir más discos de 5kg en hora pico.'
    }
  ]);

  const moods = [
    { label: 'Cansado', emoji: '😫' },
    { label: 'Bien', emoji: '😐' },
    { label: 'Genial', emoji: '💪' },
    { label: 'Imparable', emoji: '🔥' }
  ];

  const handleSend = () => {
    setSubmitted(true);

    const typeTitles: Record<string, string> = {
      workout: 'Post-Entreno: Sesión de Hoy',
      facilities: 'Instalaciones & Equipamiento',
      coach: 'Evaluación de Coach Carlos Ruiz',
      nps: 'Satisfacción General (NPS)'
    };

    const typeNames: Record<string, string> = {
      workout: 'Post-Entreno',
      facilities: 'Instalaciones',
      coach: 'Evaluación de Coach',
      nps: 'Satisfacción Global'
    };

    const newItem: SurveyHistoryItem = {
      id: `h-${Date.now()}`,
      type: typeNames[selectedSurveyType],
      title: typeTitles[selectedSurveyType],
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rating: rating,
      mood: selectedSurveyType === 'workout' ? mood : undefined,
      comment: comment || 'Sin comentarios adicionales.'
    };

    setTimeout(() => {
      setHistory([newItem, ...history]);
      setSubmitted(false);
      setComment('');
      setActiveTab('results');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717680]">
                TU OPINIÓN CONSTRUYE EL GIMNASIO
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Encuestas & Feedback
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Calificá tus entrenos, instalaciones y entrenadores. Tu opinión mejora tu experiencia día a día.
              </p>
            </div>

            {/* Main Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E9EAEB] shadow-xs">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'text-[#535862] hover:bg-[#FAF8F5]'
                }`}
              >
                Responder Encuestas
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'results'
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'text-[#535862] hover:bg-[#FAF8F5]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Resultados & Histórico ({history.length})</span>
              </button>
            </div>
          </div>

          {activeTab === 'pending' ? (
            <div className="space-y-6">
              {/* Type Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'workout', label: 'Post-Entreno', icon: Dumbbell, desc: 'Esfuerzo y rutina' },
                  { id: 'facilities', label: 'Instalaciones', icon: Building2, desc: 'Limpieza y máquinas' },
                  { id: 'coach', label: 'Tu Coach', icon: UserCheck, desc: 'Atención y técnica' },
                  { id: 'nps', label: 'Satisfacción Gym', icon: Sparkles, desc: 'Ambiente general' }
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedSurveyType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedSurveyType(t.id as any);
                        setSubmitted(false);
                      }}
                      className={`p-4 rounded-3xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#181D27] shadow-md ring-2 ring-[#181D27]/10'
                          : 'bg-white/80 border-[#E9EAEB] hover:bg-white hover:border-[#D5D7DA]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-[#181D27] text-white' : 'bg-[#FAF8F5] text-[#717680]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#181D27]">{t.label}</h4>
                        <p className="text-[10px] text-[#717680] mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Survey Form */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                {submitted ? (
                  <div className="p-8 bg-[#ECFDF3] border border-[#A6F4C5] rounded-3xl text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-[#039855] mx-auto" />
                    <h3 className="text-base font-black text-[#039855]">¡Muchas gracias por tu feedback!</h3>
                    <p className="text-xs text-[#027A48]">Tu respuesta fue registrada con éxito. Redirigiendo a tu historial...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F2F4F7]">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#F26522]" />
                        <h2 className="text-base font-black text-[#181D27]">
                          {selectedSurveyType === 'workout' && '¿Cómo estuvo tu entrenamiento de hoy?'}
                          {selectedSurveyType === 'facilities' && '¿Qué tal encontraste las instalaciones hoy?'}
                          {selectedSurveyType === 'coach' && 'Evaluá la atención de tu entrenador asignado'}
                          {selectedSurveyType === 'nps' && '¿Qué tan satisfecho estás con Iron Strength?'}
                        </h2>
                      </div>
                      <span className="text-[11px] font-bold text-[#717680] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E9EAEB]">
                        3 preguntas rápidas
                      </span>
                    </div>

                    {/* Question 1: Rating Stars */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#181D27]">
                        {selectedSurveyType === 'workout' && '1. Calificación general de la sesión:'}
                        {selectedSurveyType === 'facilities' && '1. Estado de limpieza y disponibilidad de máquinas:'}
                        {selectedSurveyType === 'coach' && '1. Calidad técnica y acompañamiento del coach:'}
                        {selectedSurveyType === 'nps' && '1. ¿Recomendarías este gimnasio a un amigo o colega?'}
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 transition transform active:scale-90 hover:scale-110 cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                star <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-neutral-200'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-[#717680] ml-2">
                          {rating} de 5 estrellas
                        </span>
                      </div>
                    </div>

                    {/* Question 2: Mood / Intensity */}
                    {selectedSurveyType === 'workout' ? (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#181D27]">
                          2. ¿Cómo te sentiste físicamente al terminar?
                        </label>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {moods.map((m) => (
                            <button
                              key={m.label}
                              type="button"
                              onClick={() => setMood(m.label)}
                              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                                mood === m.label
                                  ? 'bg-[#181D27] text-white border-[#181D27] shadow-xs'
                                  : 'bg-white text-[#535862] border-[#D5D7DA] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              <span className="text-base">{m.emoji}</span>
                              <span>{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#181D27]">
                          2. ¿La música y el ambiente fueron adecuados hoy?
                        </label>
                        <div className="flex gap-3 pt-1">
                          {['Excelente', 'Bueno', 'Regular', 'Podría mejorar'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setMood(opt)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                mood === opt
                                  ? 'bg-[#181D27] text-white border-[#181D27]'
                                  : 'bg-white text-[#535862] border-[#E9EAEB] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question 3: Comments */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#181D27]">
                        3. Comentarios o sugerencias (opcional):
                      </label>
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Contanos más detalles o qué podemos hacer para darte una experiencia 10/10..."
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E9EAEB] rounded-2xl text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleSend}
                        className="px-8 py-3 bg-[#181D27] hover:bg-black text-white font-bold text-xs rounded-2xl transition shadow-md cursor-pointer"
                      >
                        Enviar Encuesta (+50 XP)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Results & Analytics Tab */
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm">
                  <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                    PROMEDIO DE SATISFACCIÓN
                  </span>
                  <div className="text-3xl font-black text-[#181D27] mt-1 flex items-baseline gap-2">
                    4.8 <span className="text-xs text-[#039855] font-bold">/ 5.0 ★</span>
                  </div>
                  <p className="text-xs text-[#535862] mt-1">Basado en tus {history.length} encuestas respondidas.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm">
                  <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                    RETROALIMENTACIONES DEL COACH
                  </span>
                  <div className="text-3xl font-black text-[#181D27] mt-1">
                    2 <span className="text-xs font-semibold text-[#717680]">respuestas activas</span>
                  </div>
                  <p className="text-xs text-[#535862] mt-1">Tu coach revisa tus notas de fatiga y peso.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm">
                  <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                    PUNTOS XP GANADOS POR FEEDBACK
                  </span>
                  <div className="text-3xl font-black text-[#F26522] mt-1">
                    +{history.length * 50} <span className="text-xs text-[#535862]">XP</span>
                  </div>
                  <p className="text-xs text-[#535862] mt-1">50 XP por cada encuesta enviada.</p>
                </div>
              </div>

              {/* History list */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E9EAEB] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#181D27]">Tus respuestas anteriores</h3>

                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-2.5 transition hover:border-[#D5D7DA]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#181D27]">{item.title}</span>
                          <span className="text-[10px] font-bold text-[#717680] bg-white px-2 py-0.5 rounded-full border border-[#E9EAEB]">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <span>{item.rating}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#717680]">
                        <span>{item.date}</span>
                        {item.mood && <span className="font-semibold text-[#181D27]">{item.mood}</span>}
                      </div>

                      {item.comment && (
                        <p className="text-xs text-[#535862] bg-white p-3 rounded-xl border border-[#E9EAEB]">
                          "{item.comment}"
                        </p>
                      )}

                      {item.coachFeedback && (
                        <div className="p-3 bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl text-xs space-y-1">
                          <span className="text-[10px] font-bold text-[#027A48] uppercase tracking-wider block">
                            💬 RESPUESTA DE TU COACH:
                          </span>
                          <p className="text-[#027A48] font-medium">{item.coachFeedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
