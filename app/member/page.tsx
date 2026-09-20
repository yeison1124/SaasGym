'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  Calendar,
  Flame,
  Sparkles,
  Star,
  MessageSquare,
  CheckCircle2,
  X,
  MessageCircle,
  Tag,
  ArrowRight
} from 'lucide-react';

export default function MemberDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [mood, setMood] = useState('Genial');
  const [comment, setComment] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [showSurvey, setShowSurvey] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const [memberData, setMemberData] = useState({
    name: 'María',
    weight: 60,
    height: 168,
    age: 33,
    nextClass: 'Sin clases reservadas',
    streakDays: 3
  });

  const moods = [
    { label: 'Cansado', emoji: '😫' },
    { label: 'Bien', emoji: '😐' },
    { label: 'Genial', emoji: '💪' },
    { label: 'Imparable', emoji: '🔥' }
  ];

  useEffect(() => {
    fetchMemberDashboard();
  }, []);

  const fetchMemberDashboard = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const firstName = profile.full_name?.split(' ')[0] || 'María';
          setMemberData(prev => ({ ...prev, name: firstName }));
        }

        // Fetch booked classes
        const { data: bookings } = await supabase
          .from('class_bookings')
          .select('*, classes(*)')
          .eq('status', 'booked')
          .limit(1);

        if (bookings && bookings.length > 0 && bookings[0].classes) {
          const c = bookings[0].classes;
          const dateStr = new Date(c.starts_at).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
          setMemberData(prev => ({ ...prev, nextClass: `${c.name} · ${dateStr}` }));
        }
      }
    } catch (err) {
      console.error('Error loading member dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSurvey = async () => {
    try {
      await supabase.from('surveys').insert({
        gym_id: '5200c3fa-b18c-445d-883d-b28fa6b23ffe',
        difficulty: rating || 5,
        mood: mood === 'Imparable' ? 4 : mood === 'Genial' ? 3 : mood === 'Bien' ? 2 : 1,
        comment: comment.trim() || null
      });

      setSurveySubmitted(true);
      setTimeout(() => setShowSurvey(false), 2000);
    } catch (err) {
      console.error('Error submitting survey:', err);
      setShowSurvey(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Row: Welcome Card + Promo Offer Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Main Welcome Hero Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="space-y-6 flex-1 z-10">
                <div>
                  <span className="text-[11px] font-bold text-[#717680] uppercase tracking-wider block mb-1">
                    HOLA OTRA VEZ
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#181D27] flex items-center gap-2">
                    ¡Buen día, {memberData.name}! 🎉
                  </h1>
                  <p className="text-xs text-[#535862] mt-1.5">
                    Sumate a una clase desde la agenda para arrancar la semana.
                  </p>
                </div>

                {/* Body Stats Pills */}
                <div className="flex items-center gap-3">
                  <div className="bg-[#FAF8F5] border border-[#E9EAEB] px-4 py-2.5 rounded-2xl">
                    <span className="text-base font-black text-[#181D27]">{memberData.weight} <span className="text-xs font-normal text-[#535862]">kg</span></span>
                    <span className="text-[10px] text-[#717680] block uppercase font-bold">Peso</span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#E9EAEB] px-4 py-2.5 rounded-2xl">
                    <span className="text-base font-black text-[#181D27]">{memberData.height} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                    <span className="text-[10px] text-[#717680] block uppercase font-bold">Altura</span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#E9EAEB] px-4 py-2.5 rounded-2xl">
                    <span className="text-base font-black text-[#181D27]">{memberData.age} <span className="text-xs font-normal text-[#535862]">años</span></span>
                    <span className="text-[10px] text-[#717680] block uppercase font-bold">Edad</span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/member/schedule"
                    className="flex items-center gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#E9EAEB] hover:border-[#D5D7DA] hover:bg-[#F4ECE1]/50 rounded-2xl transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F26522] flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#717680] uppercase font-bold block">PRÓXIMA SESIÓN</span>
                      <span className="text-xs font-bold text-[#181D27] truncate block group-hover:text-[#F26522] transition">
                        {memberData.nextClass}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href="/member/achievements"
                    className="flex items-center gap-3.5 p-3.5 bg-[#FAF8F5] border border-[#E9EAEB] hover:border-[#D5D7DA] hover:bg-[#F4ECE1]/50 rounded-2xl transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5 fill-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#717680] uppercase font-bold block">RACHA ACTUAL</span>
                      <span className="text-xs font-bold text-[#181D27] truncate block group-hover:text-[#F26522] transition">
                        {memberData.streakDays} días seguidos
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Hero Woman Image */}
              <div className="w-full md:w-64 h-64 md:h-full rounded-2xl overflow-hidden shrink-0 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
                  alt="Fitness Motivation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Promo Offer Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#FDF8EE] to-[#F9EBD5] rounded-3xl p-7 border border-[#EBE1D0] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-[10px] font-bold text-[#F26522] uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OFERTA DE TU GYM</span>
                </div>

                <h3 className="text-2xl font-black text-[#181D27] leading-tight">
                  2 mes gratis con plan anual
                </h3>

                <p className="text-xs text-[#535862] leading-relaxed">
                  Si pagás tu plan de un año en una cuota te regalamos el primer mes.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5D7C2] flex items-center justify-between text-[11px] text-[#717680]">
                <span>📅 Del 01-may al 30-jun</span>
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="font-bold text-[#181D27] hover:text-[#F26522] flex items-center gap-1 cursor-pointer transition"
                >
                  <span>Aprovechar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Card: Micro-Encuesta Post-Entreno */}
          {showSurvey && (
            <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-[#F26522]" />
                    <h2 className="text-base font-bold text-[#181D27]">
                      ¿Cómo fue tu última sesión?
                    </h2>
                  </div>
                  <p className="text-xs text-[#535862]">
                    Tu feedback ayuda a tu coach a ajustar el plan.
                  </p>
                </div>
              </div>

              {surveySubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>¡Muchas gracias! Tu opinión fue registrada con éxito para tu coach.</span>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E9EAEB] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9EAEB]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-[#181D27]">Sesión del vie, 15 may</span>
                      <span className="text-[10px] text-[#717680] bg-white px-2 py-0.5 rounded border border-[#E9EAEB]">Personal</span>
                    </div>
                    <button
                      onClick={() => setShowSurvey(false)}
                      className="text-xs text-[#717680] hover:text-[#181D27] font-semibold"
                    >
                      Cerrar
                    </button>
                  </div>

                  {/* Question 1: Rating */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#344054]">¿Cómo fue la sesión?</span>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 transition transform active:scale-95 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Mood */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#344054]">¿Cómo te sentiste?</span>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((m) => (
                        <button
                          key={m.label}
                          onClick={() => setMood(m.label)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                            mood === m.label
                              ? 'bg-[#181D27] text-white border-[#181D27] shadow-xs'
                              : 'bg-white text-[#535862] border-[#D5D7DA] hover:bg-neutral-50'
                          }`}
                        >
                          <span>{m.emoji}</span>
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question 3: Optional Text */}
                  <div>
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Algo que quieras compartir con tu coach (opcional)..."
                      className="w-full px-4 py-2.5 bg-white border border-[#D5D7DA] rounded-xl text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                    />
                  </div>

                  {/* Submit actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowSurvey(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#717680] hover:text-[#181D27] transition cursor-pointer"
                    >
                      Después
                    </button>
                    <button
                      onClick={handleSendSurvey}
                      className="px-6 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Detalle de Oferta Promocional */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#F26522] uppercase tracking-wider">Promoción Especial</span>
                  <h3 className="text-xl font-bold text-[#181D27]">Plan Anual Black: 2 Meses Gratis</h3>
                </div>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#344054]">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#535862]">Duración del plan:</span>
                  <strong className="text-[#181D27]">12 meses (pagas 10)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#535862]">Precio regular:</span>
                  <span className="line-through text-neutral-400">$1.440.000 COP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#535862]">Precio con descuento:</span>
                  <strong className="text-emerald-700 text-sm">$1.200.000 COP</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E9EAEB]">
                  <span className="text-[#535862]">Tu ahorro total:</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">$240.000 COP</span>
                </div>
              </div>

              <p className="text-[11px] text-[#717680] leading-relaxed">
                * Válido para miembros activos de Iron Strength Medellín del 01 de Mayo al 30 de Junio de 2026. Puedes solicitar la activación en recepción o por WhatsApp.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#535862] hover:bg-neutral-100 rounded-xl"
              >
                Cerrar
              </button>
              <a
                href="https://wa.me/573129876543?text=Hola%20Iron%20Strength,%20quiero%20aprovechar%20la%20promoci%C3%B3n%20de%202%20meses%20gratis%20en%20el%20Plan%20Anual"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reclamar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
