'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Flame,
  CheckCircle2,
  Circle,
  PlayCircle,
  Trophy,
  TrendingDown,
  X,
  Award,
  Check,
  Dumbbell,
  ArrowRight,
  UserCheck,
  LogOut,
} from 'lucide-react';
import {
  mockRoutines,
  mockRoutineExercises,
} from '@/lib/mock-data';

export default function MemberDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({
    'ex-001': true,
    'ex-002': true,
  });

  const [showSurveyModal, setShowSurveyModal] = useState<boolean>(false);
  const [surveyMood, setSurveyMood] = useState<1 | 2 | 3 | 4 | null>(null);
  const [surveyDifficulty, setSurveyDifficulty] = useState<number>(3);
  const [surveyComment, setSurveyComment] = useState<string>('');
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);

  useEffect(() => {
    async function loadMemberData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, gyms(*)')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          if (profileData.gyms) {
            setGym(profileData.gyms);
          }
        }
      }
    }
    loadMemberData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submitSurvey = () => {
    setShowSurveyModal(false);
    setWorkoutFinished(true);
  };

  const activeRoutine = mockRoutines[0];
  const memberName = profile?.full_name || 'María Fernández';
  const memberFirstName = memberName.split(' ')[0] || 'María';
  const memberInitials = memberName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() || 'MF';
  const gymName = gym?.name || 'Iron Strength';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] pb-20 font-sans">
      {/* MOBILE-FIRST HEADER CON DATOS REALES */}
      <div className="border-b border-[#EBE7DF] bg-[#FFFFFF] px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF4ED] border border-[#F26522]/30 flex items-center justify-center font-black text-[#F26522] text-sm">
              {memberInitials}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#16A34A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Miembro · {gymName}
              </div>
              <h1 className="text-lg font-black text-[#181D27]">
                ¡Hola, {memberFirstName}! 👋
              </h1>
              <p className="text-[11px] text-[#535862]">
                Entrenador: <strong className="text-[#181D27]">Carlos Ruiz</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#EBE7DF] text-[10px] font-bold text-[#535862]">
              Objetivo: Tonificar
            </span>
            <button
              onClick={handleSignOut}
              title="Cerrar sesión"
              className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#FEE4E2] text-[#535862] hover:text-[#D92D20] border border-[#EBE7DF] transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-5 space-y-5">
        {/* BANNER DE FELICITACIONES */}
        {workoutFinished && (
          <div className="p-4 rounded-3xl bg-[#ECFDF5] border border-[#16A34A]/30 text-center space-y-1 animate-in fade-in duration-200">
            <div className="inline-flex p-1.5 rounded-full bg-[#16A34A] text-white mb-1">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <h3 className="font-black text-sm text-[#16A34A] uppercase">
              ¡Entrenamiento Guardado!
            </h3>
            <p className="text-xs text-[#535862]">
              Tu feedback fue enviado a tu entrenador Carlos. ¡Racha sumada! 🔥
            </p>
          </div>
        )}

        {/* 1. WIDGET DE RACHA SEMANAL */}
        <section className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-5 shadow-card space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF4ED] text-[#F26522] text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-[#F26522]" />
                Racha Activa
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#181D27]">
                  3 Semanas
                </span>
                <span className="text-xs font-bold text-[#F26522]">
                  ¡Sin faltar! 🔥
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center text-xl font-black shadow-xs">
              🏆
            </div>
          </div>

          {/* Checklist Semanal */}
          <div className="pt-3 border-t border-[#EBE7DF]">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#535862] font-semibold">Meta: 3 entrenos/sem</span>
              <span className="font-bold text-[#181D27]">2 / 3 completados</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {[
                { day: 'Lun', done: true },
                { day: 'Mar', done: false },
                { day: 'Mié', done: true },
                { day: 'Jue', done: false },
                { day: 'Vie', done: false, today: true },
                { day: 'Sáb', done: false },
                { day: 'Dom', done: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`py-2 rounded-2xl text-xs flex flex-col items-center gap-1 border transition-all ${
                    item.done
                      ? 'bg-[#181D27] text-white font-bold border-[#181D27]'
                      : item.today
                      ? 'bg-[#FAF8F5] text-[#181D27] border-[#F26522] ring-2 ring-[#F26522]/30'
                      : 'bg-[#FAF8F5] text-[#9CA3AF] border-[#EBE7DF]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">{item.day}</span>
                  {item.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                  ) : item.today ? (
                    <span className="w-2 h-2 rounded-full bg-[#F26522] animate-ping" />
                  ) : (
                    <Circle className="w-3 h-3 text-[#EBE7DF]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. RUTINA DEL DÍA */}
        <section className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
                TU RUTINA DE HOY · DÍA 1
              </div>
              <h2 className="text-lg font-black text-[#181D27] mt-0.5">
                {activeRoutine.name}
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EBE7DF] text-[#535862] font-semibold">
              ~50 min
            </span>
          </div>

          <p className="text-xs text-[#535862] leading-relaxed">
            {activeRoutine.description}
          </p>

          {/* List of Exercises */}
          <div className="space-y-2.5 pt-1">
            {mockRoutineExercises.map((exercise) => {
              const isDone = !!completedExercises[exercise.id];
              return (
                <div
                  key={exercise.id}
                  onClick={() => toggleExercise(exercise.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-[#FAF8F5] border-[#16A34A]/40'
                      : 'bg-[#FFFFFF] border-[#EBE7DF] hover:border-[#D6CEBF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-[#181D27] text-white font-bold'
                          : 'border-2 border-[#EBE7DF] text-transparent hover:border-[#181D27]'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div>
                      <div
                        className={`text-xs font-bold transition-all ${
                          isDone ? 'line-through text-[#9CA3AF]' : 'text-[#181D27]'
                        }`}
                      >
                        {exercise.exercise_name}
                      </div>
                      <div className="text-[11px] text-[#535862] flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-[#F26522]">{exercise.sets} series</span>
                        <span>·</span>
                        <span>{exercise.reps}</span>
                        <span>·</span>
                        <span>{exercise.rest_seconds}s</span>
                      </div>
                    </div>
                  </div>

                  {exercise.video_url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Abriendo video guía para: ${exercise.exercise_name}`);
                      }}
                      className="p-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#181D27] border border-[#EBE7DF] transition-all shrink-0"
                    >
                      <PlayCircle className="w-4 h-4 text-[#F26522]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowSurveyModal(true)}
            className="w-full py-3.5 rounded-full bg-[#181D27] hover:bg-[#2B313B] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            ¡Terminé mi entrenamiento de hoy!
          </button>
        </section>

        {/* 3. PROGRESO VISIBLE & LOGROS */}
        <section className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Tu Peso</span>
              <TrendingDown className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#181D27]">66.8 kg</span>
              <span className="text-[11px] font-bold text-[#16A34A]">-1.7 kg</span>
            </div>
            <p className="text-[10px] text-[#535862] mt-1">Cintura: -3 cm en 4 semanas</p>
          </div>

          <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card">
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Logro Activo</span>
              <Award className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div className="mt-1 text-xs font-bold text-[#181D27] truncate">
              Mes Perfecto
            </div>
            <p className="text-[10px] text-[#16A34A] font-bold mt-1">
              🏆 16 asistencias
            </p>
          </div>
        </section>
      </div>

      {/* 4. MODAL POST-ENTRENO DE 1 TOQUE */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowSurveyModal(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#181D27]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center mx-auto mb-2 text-xl">
                🔥
              </div>
              <h3 className="text-lg font-black text-[#181D27]">
                ¿Cómo te fue hoy, María?
              </h3>
              <p className="text-xs text-[#535862] mt-0.5">
                Tu respuesta le avisa a tu entrenador Carlos.
              </p>
            </div>

            {/* 4 Emojis (😞 😐 🙂 💪) */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { mood: 1 as const, emoji: '😞', label: 'Pesado' },
                { mood: 2 as const, emoji: '😐', label: 'Regular' },
                { mood: 3 as const, emoji: '🙂', label: 'Bien' },
                { mood: 4 as const, emoji: '💪', label: '¡Con toda!' },
              ].map((item) => (
                <button
                  key={item.mood}
                  type="button"
                  onClick={() => setSurveyMood(item.mood)}
                  className={`py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                    surveyMood === item.mood
                      ? 'bg-[#FFF4ED] border-[#F26522] scale-105'
                      : 'bg-[#FAF8F5] border-[#EBE7DF] hover:border-[#D6CEBF]'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-[#535862]">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Difficulty Range */}
            <div>
              <div className="flex justify-between text-xs text-[#535862] mb-1.5 font-semibold">
                <span>Dificultad:</span>
                <span className="font-bold text-[#181D27]">{surveyDifficulty} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={surveyDifficulty}
                onChange={(e) => setSurveyDifficulty(Number(e.target.value))}
                className="w-full h-2 bg-[#EBE7DF] rounded-lg appearance-none cursor-pointer accent-[#F26522]"
              />
            </div>

            {/* Comment */}
            <div>
              <textarea
                value={surveyComment}
                onChange={(e) => setSurveyComment(e.target.value)}
                placeholder="Comentario opcional para Carlos..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none"
              />
            </div>

            <button
              onClick={submitSurvey}
              disabled={surveyMood === null}
              className={`w-full py-3.5 rounded-full font-bold text-xs transition-all ${
                surveyMood !== null
                  ? 'bg-[#181D27] hover:bg-[#2B313B] text-white shadow-sm'
                  : 'bg-[#EBE7DF] text-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              Guardar y sumar a mi racha
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
