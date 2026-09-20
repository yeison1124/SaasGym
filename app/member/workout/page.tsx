'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import { ExerciseVideoModal } from '@/components/member/ExerciseVideoModal';
import { PostWorkoutSurveyModal } from '@/components/member/PostWorkoutSurveyModal';
import {
  Clock,
  Flame,
  Settings,
  CheckCircle2,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';

export default function MemberWorkoutPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [selectedVideoExercise, setSelectedVideoExercise] = useState<any | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const [markedExercises, setMarkedExercises] = useState<Record<string, boolean>>({
    'cinta': true
  });

  const warmupExercises = [
    {
      id: 'cinta',
      name: 'Cinta a ritmo moderado',
      block_name: 'CALENTAMIENTO',
      sets: 1,
      reps: '5 min',
      rest_seconds: 0,
      weight_notes: 'Z2',
      details: '1 series · 5 min · Z2',
      thumb: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=400&q=80',
      video_url: 'https://www.youtube.com/watch?v=kYv9qM-jH6s'
    },
    {
      id: 'gluteo',
      name: 'Activación de glúteo con banda',
      block_name: 'CALENTAMIENTO',
      sets: 2,
      reps: '12',
      rest_seconds: 30,
      weight_notes: 'Banda media',
      details: '2 series · 12 · Banda media · 30s desc.',
      thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
      video_url: 'https://www.youtube.com/watch?v=wX5yL_wA9q0'
    }
  ];

  const mainExercises = [
    {
      id: 'sentadilla',
      name: 'Sentadilla con barra',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 4,
      reps: '8',
      rest_seconds: 90,
      weight_notes: '55 kg',
      details: '4 series · 8 · 55 kg · 90s desc.',
      thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80',
      video_url: 'https://www.youtube.com/watch?v=bEv6CCg2BC8'
    },
    {
      id: 'hipthrust',
      name: 'Hip thrust',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 4,
      reps: '10',
      rest_seconds: 75,
      weight_notes: '60 kg',
      details: '4 series · 10 · 60 kg · 75s desc.',
      thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
      video_url: 'https://www.youtube.com/watch?v=SEdqd1n0cvg'
    },
    {
      id: 'pesomuerto',
      name: 'Peso muerto rumano',
      block_name: 'BLOQUE PRINCIPAL',
      sets: 3,
      reps: '10',
      rest_seconds: 75,
      weight_notes: '45 kg',
      details: '3 series · 10 · 45 kg · 75s desc.',
      thumb: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
      video_url: 'https://www.youtube.com/watch?v=JCXUYuzwNrM'
    }
  ];

  const toggleMark = (id: string) => {
    setMarkedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCompleteSession = async () => {
    setSessionCompleted(true);
    // Mark all as done
    const allDone: Record<string, boolean> = {};
    [...warmupExercises, ...mainExercises].forEach(e => { allDone[e.id] = true; });
    setMarkedExercises(allDone);

    try {
      await supabase.from('workout_logs').insert({
        gym_id: '5200c3fa-b18c-445d-883d-b28fa6b23ffe',
        member_id: '88888888-8888-8888-8888-888888888888',
        routine_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        duration_minutes: 60
      });
    } catch (err) {
      console.error(err);
    }

    // Open survey modal
    setShowSurveyModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717680]">
                ASIGNADO POR COACH CARLOS RODRÍGUEZ
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Plan de entreno
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Hipertrofia 4 días · Hipertrofia
              </p>
            </div>

            <button
              onClick={handleCompleteSession}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{sessionCompleted ? '¡Sesión completada!' : 'Completar sesión'}</span>
            </button>
          </div>

          {/* Top Row: Routine Info Card + Weekly Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Routine Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] bg-[#FAF8F5] border border-[#E9EAEB] px-2.5 py-0.5 rounded-full">
                  HOY
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#181D27]">
                Hipertrofia 4 días
              </h2>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E9EAEB] rounded-full text-xs font-bold text-[#344054]">
                  <Clock className="w-3.5 h-3.5 text-[#717680]" />
                  <span>60 min</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E9EAEB] rounded-full text-xs font-bold text-[#344054]">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>420 kcal</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#E9EAEB] rounded-full text-xs font-bold text-[#344054]">
                  <Settings className="w-3.5 h-3.5 text-[#717680]" />
                  <span>Intermedio</span>
                </span>
              </div>

              <p className="text-xs text-[#535862] leading-relaxed pt-1">
                Programa de hipertrofia para tren superior e inferior con énfasis en cadena posterior.
              </p>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#181D27]">
                <RotateCcw className="w-4 h-4 text-[#717680]" />
                <span>Resumen de la semana</span>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#535862]">Sesiones planificadas</span>
                  <span className="font-bold text-[#181D27]">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#535862]">Sesiones completadas</span>
                  <span className="font-bold text-[#181D27]">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#535862]">Minutos totales</span>
                  <span className="font-bold text-[#181D27]">300 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#535862]">Calorías estimadas</span>
                  <span className="font-bold text-[#181D27]">2100 kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calentamiento Block */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#717680] uppercase tracking-wider">
                CALENTAMIENTO
              </span>
              <span className="text-xs text-[#717680]">2 ejercicios</span>
            </div>

            <div className="space-y-3">
              {warmupExercises.map((ex) => {
                const isMarked = markedExercises[ex.id];

                return (
                  <div
                    key={ex.id}
                    className="bg-white rounded-2xl p-3.5 md:p-4 border border-[#E9EAEB] shadow-xs flex items-center justify-between gap-4 hover:border-[#D5D7DA] transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Video Thumbnail */}
                      <button
                        onClick={() => setSelectedVideoExercise(ex)}
                        className="relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden shrink-0 group border border-neutral-200"
                        title="Ver video explicativo"
                      >
                        <img src={ex.thumb} alt={ex.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#181D27] truncate">{ex.name}</h4>
                        <p className="text-xs text-[#535862] truncate mt-0.5">{ex.details}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMark(ex.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                        isMarked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                          : 'border border-[#D5D7DA] bg-white text-[#181D27] hover:bg-neutral-50'
                      }`}
                    >
                      {isMarked ? '✓ Hecho' : 'Marcar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bloque Principal */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#717680] uppercase tracking-wider">
                BLOQUE PRINCIPAL
              </span>
              <span className="text-xs text-[#717680]">3 ejercicios</span>
            </div>

            <div className="space-y-3">
              {mainExercises.map((ex) => {
                const isMarked = markedExercises[ex.id];

                return (
                  <div
                    key={ex.id}
                    className="bg-white rounded-2xl p-3.5 md:p-4 border border-[#E9EAEB] shadow-xs flex items-center justify-between gap-4 hover:border-[#D5D7DA] transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Video Thumbnail */}
                      <button
                        onClick={() => setSelectedVideoExercise(ex)}
                        className="relative w-16 h-12 md:w-20 md:h-14 rounded-xl overflow-hidden shrink-0 group border border-neutral-200"
                        title="Ver video explicativo"
                      >
                        <img src={ex.thumb} alt={ex.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#181D27] truncate">{ex.name}</h4>
                        <p className="text-xs text-[#535862] truncate mt-0.5">{ex.details}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMark(ex.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                        isMarked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                          : 'border border-[#D5D7DA] bg-white text-[#181D27] hover:bg-neutral-50'
                      }`}
                    >
                      {isMarked ? '✓ Hecho' : 'Marcar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Video Modal */}
      {selectedVideoExercise && (
        <ExerciseVideoModal
          exercise={selectedVideoExercise}
          onClose={() => setSelectedVideoExercise(null)}
        />
      )}

      {/* Post Workout Survey Modal */}
      {showSurveyModal && (
        <PostWorkoutSurveyModal
          onClose={() => setShowSurveyModal(false)}
          onSuccess={() => setSessionCompleted(true)}
        />
      )}
    </div>
  );
}
