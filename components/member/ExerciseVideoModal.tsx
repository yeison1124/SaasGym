'use client';

import { X, Play, Info } from 'lucide-react';

interface ExerciseVideoModalProps {
  exercise: {
    name: string;
    block_name?: string;
    sets: number;
    reps: string;
    rest_seconds?: number;
    weight_notes?: string;
    video_url?: string;
  } | null;
  onClose: () => void;
}

export function ExerciseVideoModal({ exercise, onClose }: ExerciseVideoModalProps) {
  if (!exercise) return null;

  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E9EAEB] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#F2F4F7]">
          <div>
            <span className="text-[10px] font-bold text-[#F26522] uppercase tracking-wider bg-[#F26522]/10 px-2 py-0.5 rounded-full">
              {exercise.block_name || 'EJERCICIO'}
            </span>
            <h3 className="text-base font-bold text-[#181D27] mt-1">{exercise.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black w-full">
          <iframe
            src={getEmbedUrl(exercise.video_url)}
            title={exercise.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Exercise Specifications */}
        <div className="p-5 bg-neutral-50 flex items-center justify-between text-xs text-[#344054]">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#717680] block font-semibold uppercase">SERIES</span>
              <span className="font-bold text-[#181D27] text-sm">{exercise.sets}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#717680] block font-semibold uppercase">REPS</span>
              <span className="font-bold text-[#181D27] text-sm">{exercise.reps}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#717680] block font-semibold uppercase">PESO / NOTA</span>
              <span className="font-bold text-[#181D27] text-sm">{exercise.weight_notes || 'Libre'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#717680] block font-semibold uppercase">DESCANSO</span>
              <span className="font-bold text-[#181D27] text-sm">{exercise.rest_seconds ? `${exercise.rest_seconds}s` : 'Sin descanso'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs transition"
          >
            Listo para entrenar
          </button>
        </div>
      </div>
    </div>
  );
}
