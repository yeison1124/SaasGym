'use client';

import { useState } from 'react';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  Trophy,
  Sparkles,
  Flame,
  Star,
  Award,
  Lock,
  Zap,
  Dumbbell,
  Users,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  X,
  Target,
  Crown
} from 'lucide-react';

interface BadgeItem {
  id: string;
  category: 'consistencia' | 'fuerza' | 'social' | 'especiales';
  title: string;
  desc: string;
  howToGet: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  tier: 'COMÚN' | 'RARA' | 'ÉPICA' | 'LEGENDARIA';
  tierColor: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export default function MemberAchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'consistencia' | 'fuerza' | 'social' | 'especiales'>('all');
  const [filterState, setFilterState] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const badges: BadgeItem[] = [
    // Consistencia
    {
      id: 'primera-semana',
      category: 'consistencia',
      title: 'Primera Semana',
      desc: 'Completaste 7 días seguidos de entrenamiento.',
      howToGet: 'Entrenar y registrar asistencia durante 7 días consecutivos.',
      currentValue: 7,
      targetValue: 7,
      unit: 'días',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 100,
      isUnlocked: true,
      unlockedAt: '12 de mayo, 2026'
    },
    {
      id: 'mes-perfecto',
      category: 'consistencia',
      title: 'Mes Perfecto',
      desc: 'Asistencia de al menos 4 días por semana durante un mes.',
      howToGet: 'Cumplir al menos 16 entrenamientos en el mismo mes.',
      currentValue: 16,
      targetValue: 16,
      unit: 'sesiones',
      tier: 'RARA',
      tierColor: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      xpReward: 250,
      isUnlocked: true,
      unlockedAt: '18 de mayo, 2026'
    },
    {
      id: 'racha-fuego',
      category: 'consistencia',
      title: 'Racha de Fuego',
      desc: '30 días consecutivos sin faltar a tus sesiones programadas.',
      howToGet: 'Alcanzar una racha ininterrumpida de 30 días de asistencia.',
      currentValue: 18,
      targetValue: 30,
      unit: 'días',
      tier: 'ÉPICA',
      tierColor: 'bg-[#181D27] text-white',
      xpReward: 500,
      isUnlocked: false
    },
    {
      id: 'centurion',
      category: 'consistencia',
      title: 'Centurión del Gimnasio',
      desc: 'Alcanzá 100 días de entrenamiento en el año.',
      howToGet: 'Registrar 100 asistencias totales dentro de un año calendario.',
      currentValue: 46,
      targetValue: 100,
      unit: 'días',
      tier: 'LEGENDARIA',
      tierColor: 'bg-[#FEF6EE] border-[#F9DBAF] text-[#B54708]',
      xpReward: 1000,
      isUnlocked: false
    },
    {
      id: 'madrugador',
      category: 'consistencia',
      title: 'Madrugador de Acero',
      desc: 'Entrenaste 10 veces antes de las 7:00 AM.',
      howToGet: 'Registrar ingreso al gimnasio antes de las 07:00 AM 10 veces.',
      currentValue: 8,
      targetValue: 10,
      unit: 'sesiones',
      tier: 'RARA',
      tierColor: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      xpReward: 200,
      isUnlocked: false
    },

    // Fuerza
    {
      id: 'primer-1rm',
      category: 'fuerza',
      title: 'Primer Récord (1RM)',
      desc: 'Registraste tu primer récord personal en la plataforma.',
      howToGet: 'Ingresar una marca de peso máximo en cualquier ejercicio de fuerza.',
      currentValue: 1,
      targetValue: 1,
      unit: 'PR',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 100,
      isUnlocked: true,
      unlockedAt: '10 de mayo, 2026'
    },
    {
      id: 'sentadilla-pro',
      category: 'fuerza',
      title: 'Sentadilla Dorada',
      desc: 'Superaste los 80 kg en sentadilla trasera.',
      howToGet: 'Registrar 80 kg o más en Sentadilla Trasera con repetición válida.',
      currentValue: 85,
      targetValue: 80,
      unit: 'kg',
      tier: 'RARA',
      tierColor: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      xpReward: 300,
      isUnlocked: true,
      unlockedAt: '15 de mayo, 2026'
    },
    {
      id: 'peso-muerto-100',
      category: 'fuerza',
      title: 'Club de los 100 kg',
      desc: 'Levantá 100 kg en Peso Muerto convencional o sumo.',
      howToGet: 'Superar 100 kg en Peso Muerto en tus registros de progreso.',
      currentValue: 95,
      targetValue: 100,
      unit: 'kg',
      tier: 'ÉPICA',
      tierColor: 'bg-[#181D27] text-white',
      xpReward: 600,
      isUnlocked: false
    },
    {
      id: 'press-banca-propio',
      category: 'fuerza',
      title: 'Poder Puro',
      desc: 'Press banca igual o superior a tu peso corporal.',
      howToGet: 'Alcanzar 56 kg o más en Press Banca (tu peso corporal actual: 56 kg).',
      currentValue: 42.5,
      targetValue: 56,
      unit: 'kg',
      tier: 'ÉPICA',
      tierColor: 'bg-[#181D27] text-white',
      xpReward: 500,
      isUnlocked: false
    },
    {
      id: 'dominadas-10',
      category: 'fuerza',
      title: 'Dominio Aéreo',
      desc: 'Realizá 10 dominadas estrictas consecutivas.',
      howToGet: 'Completar 10 pull-ups sin asistencia en tu rutina de entrenamiento.',
      currentValue: 6,
      targetValue: 10,
      unit: 'reps',
      tier: 'RARA',
      tierColor: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      xpReward: 250,
      isUnlocked: false
    },

    // Social
    {
      id: 'primer-post',
      category: 'social',
      title: 'Voz en la Comunidad',
      desc: 'Publicaste tu primer avance o pensamiento en el feed social.',
      howToGet: 'Crear al menos 1 publicación en la sección de Comunidad.',
      currentValue: 1,
      targetValue: 1,
      unit: 'post',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 80,
      isUnlocked: true,
      unlockedAt: '16 de mayo, 2026'
    },
    {
      id: 'inspirador-sede',
      category: 'social',
      title: 'Inspirador de Sede',
      desc: 'Recibiste 50 reacciones en tus publicaciones.',
      howToGet: 'Acumular 50 "me gusta" o aplausos en publicaciones de la comunidad.',
      currentValue: 24,
      targetValue: 50,
      unit: 'likes',
      tier: 'RARA',
      tierColor: 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]',
      xpReward: 250,
      isUnlocked: false
    },
    {
      id: 'companero-fiel',
      category: 'social',
      title: 'Compañero Fiel',
      desc: 'Comentá y felicitá a 15 compañeros en el feed.',
      howToGet: 'Dejar comentarios positivos en 15 publicaciones de otros miembros.',
      currentValue: 9,
      targetValue: 15,
      unit: 'comentarios',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 120,
      isUnlocked: false
    },
    {
      id: 'lider-mes',
      category: 'social',
      title: 'Líder del Mes',
      desc: 'Alcanzá el 1° lugar en el ranking mensual de tu gimnasio.',
      howToGet: 'Terminar el mes en la posición #1 de asistencia y consistencia.',
      currentValue: 1,
      targetValue: 1,
      unit: 'puesto #1',
      tier: 'LEGENDARIA',
      tierColor: 'bg-[#FEF6EE] border-[#F9DBAF] text-[#B54708]',
      xpReward: 1200,
      isUnlocked: true,
      unlockedAt: '18 de mayo, 2026'
    },

    // Especiales
    {
      id: 'evaluacion-completa',
      category: 'especiales',
      title: 'Perfil de Atleta',
      desc: 'Registraste medidas corporales y foto de progreso.',
      howToGet: 'Subir tu foto antes/después y completar las 5 medidas corporales.',
      currentValue: 1,
      targetValue: 1,
      unit: 'completado',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 150,
      isUnlocked: true,
      unlockedAt: '14 de mayo, 2026'
    },
    {
      id: 'encuesta-master',
      category: 'especiales',
      title: 'Voz que Mejora',
      desc: 'Respondiste 5 encuestas de satisfacción post-entreno.',
      howToGet: 'Calificar 5 sesiones o instalaciones para apoyar la mejora del gym.',
      currentValue: 3,
      targetValue: 5,
      unit: 'encuestas',
      tier: 'COMÚN',
      tierColor: 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862]',
      xpReward: 100,
      isUnlocked: false
    },
    {
      id: 'aniversario-gym',
      category: 'especiales',
      title: 'Fidelidad de Hierro',
      desc: 'Cumplí 6 meses activo como miembro en Iron Strength.',
      howToGet: 'Mantener tu membresía activa durante al menos 180 días.',
      currentValue: 84,
      targetValue: 180,
      unit: 'días',
      tier: 'LEGENDARIA',
      tierColor: 'bg-[#FEF6EE] border-[#F9DBAF] text-[#B54708]',
      xpReward: 1500,
      isUnlocked: false
    }
  ];

  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(b => b.isUnlocked).length;
  const globalProgress = Math.round((unlockedBadges / totalBadges) * 100);

  const filteredBadges = badges.filter(b => {
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    if (filterState === 'unlocked' && !b.isUnlocked) return false;
    if (filterState === 'locked' && b.isUnlocked) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#717680]">
                GAMIFICACIÓN Y RECOMPENSAS
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Logros y Medallas
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Monitorea tu progreso en cada desafío, desbloquea insignias y acumula XP para subir de nivel.
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E9EAEB] shadow-xs">
              <button
                onClick={() => setFilterState('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterState === 'all'
                    ? 'bg-[#181D27] text-white'
                    : 'text-[#535862] hover:bg-[#FAF8F5]'
                }`}
              >
                Todos ({totalBadges})
              </button>
              <button
                onClick={() => setFilterState('unlocked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterState === 'unlocked'
                    ? 'bg-[#039855] text-white'
                    : 'text-[#535862] hover:bg-[#FAF8F5]'
                }`}
              >
                Desbloqueados ({unlockedBadges})
              </button>
              <button
                onClick={() => setFilterState('locked')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterState === 'locked'
                    ? 'bg-[#F26522] text-white'
                    : 'text-[#535862] hover:bg-[#FAF8F5]'
                }`}
              >
                En Progreso ({totalBadges - unlockedBadges})
              </button>
            </div>
          </div>

          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F9F5EE] border border-[#E9EAEB] text-[#D97706] flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                  MEDALLAS DESBLOQUEADAS
                </span>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {unlockedBadges} <span className="text-xs font-normal text-[#535862]">de {totalBadges} totales</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#039855] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                  PROGRESO GLOBAL
                </span>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  {globalProgress}%
                </div>
                <div className="w-full bg-[#EAECF0] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#039855] h-full rounded-full" style={{ width: `${globalProgress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] text-[#D92D20] flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-[#F26522]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                  XP TOTAL ACUMULADO
                </span>
                <div className="text-2xl font-black text-[#181D27] mt-0.5">
                  2,180 <span className="text-xs font-normal text-[#535862]">XP (Nivel 4)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#E9EAEB]">
            {[
              { id: 'all', label: 'Todas las categorías' },
              { id: 'consistencia', label: '⚡ Consistencia' },
              { id: 'fuerza', label: '🏋️‍♀️ Fuerza & Récords' },
              { id: 'social', label: '💬 Social & Comunidad' },
              { id: 'especiales', label: '🏆 Especiales' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#181D27] text-white shadow-xs'
                    : 'bg-white text-[#535862] hover:bg-[#F2F4F7] border border-[#E9EAEB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid of Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBadges.map((badge) => {
              const percent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
              const remaining = Math.max(0, badge.targetValue - badge.currentValue);

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`bg-white rounded-3xl p-5 border transition flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                    badge.isUnlocked
                      ? 'border-[#A6F4C5] shadow-xs'
                      : 'border-[#E9EAEB] opacity-95 hover:border-[#D5D7DA]'
                  }`}
                >
                  {/* Top Badge Info */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        badge.isUnlocked
                          ? 'bg-[#ECFDF3] text-[#039855] border border-[#A6F4C5]'
                          : 'bg-[#FAF8F5] text-[#717680] border border-[#E9EAEB]'
                      }`}>
                        {badge.isUnlocked ? (
                          <Trophy className="w-6 h-6 text-[#D97706]" />
                        ) : (
                          <Lock className="w-5 h-5 text-[#717680]" />
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border ${badge.tierColor}`}>
                          {badge.tier}
                        </span>
                        <span className="text-[10px] font-bold text-[#F26522]">
                          +{badge.xpReward} XP
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#181D27] leading-snug">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-[#535862] mt-1 line-clamp-2">
                      {badge.desc}
                    </p>
                  </div>

                  {/* Progress & Missing Requirements */}
                  <div className="pt-4 mt-3 border-t border-[#F2F4F7] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#717680] text-[11px]">
                        {badge.isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[#039855] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueado
                          </span>
                        ) : (
                          <span>Faltan {remaining} {badge.unit}</span>
                        )}
                      </span>
                      <span className={`text-[11px] font-bold ${badge.isUnlocked ? 'text-[#039855]' : 'text-[#181D27]'}`}>
                        {badge.currentValue} / {badge.targetValue} {badge.unit}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          badge.isUnlocked ? 'bg-[#039855]' : 'bg-[#F26522]'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="text-[10px] text-[#717680] pt-1 italic truncate">
                      💡 {badge.howToGet}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 space-y-5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border ${selectedBadge.tierColor}`}>
                {selectedBadge.tier} • +{selectedBadge.xpReward} XP
              </span>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center ${
                selectedBadge.isUnlocked ? 'bg-[#F9F5EE] border border-[#E9EAEB]' : 'bg-[#FAF8F5]'
              }`}>
                {selectedBadge.isUnlocked ? (
                  <Trophy className="w-8 h-8 text-[#D97706]" />
                ) : (
                  <Lock className="w-7 h-7 text-[#717680]" />
                )}
              </div>
              <h3 className="text-lg font-black text-[#181D27]">{selectedBadge.title}</h3>
              <p className="text-xs text-[#535862]">{selectedBadge.desc}</p>
            </div>

            <div className="bg-[#FAF8F5] rounded-2xl p-4 space-y-3 border border-[#E9EAEB]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#717680] block">
                  ¿CÓMO OBTENER ESTE LOGRO?
                </span>
                <p className="text-xs font-semibold text-[#181D27] mt-0.5">
                  {selectedBadge.howToGet}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#181D27] mb-1">
                  <span>Progreso actual</span>
                  <span>{selectedBadge.currentValue} / {selectedBadge.targetValue} {selectedBadge.unit}</span>
                </div>
                <div className="w-full bg-[#EAECF0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selectedBadge.isUnlocked ? 'bg-[#039855]' : 'bg-[#F26522]'}`}
                    style={{ width: `${Math.min(100, Math.round((selectedBadge.currentValue / selectedBadge.targetValue) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {selectedBadge.isUnlocked ? (
                <div className="p-2.5 bg-[#ECFDF3] rounded-xl text-center text-xs font-bold text-[#039855]">
                  🎉 Desbloqueado el {selectedBadge.unlockedAt || 'recientemente'}
                </div>
              ) : (
                <div className="p-2.5 bg-[#FEF3F2] rounded-xl text-center text-xs font-semibold text-[#B42318]">
                  ⏳ Te faltan {Math.max(0, selectedBadge.targetValue - selectedBadge.currentValue)} {selectedBadge.unit} para desbloquear
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
