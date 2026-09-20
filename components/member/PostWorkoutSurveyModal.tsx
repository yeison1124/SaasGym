'use client';

import { useState } from 'react';
import { Star, MessageCircle, CheckCircle2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PostWorkoutSurveyModalProps {
  gymId?: string;
  memberId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PostWorkoutSurveyModal({
  gymId = '5200c3fa-b18c-445d-883d-b28fa6b23ffe',
  memberId = '88888888-8888-8888-8888-888888888888',
  onClose,
  onSuccess
}: PostWorkoutSurveyModalProps) {
  const supabase = createClient();
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState('Genial');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const moods = [
    { label: 'Cansado', emoji: '😫', val: 1 },
    { label: 'Bien', emoji: '😐', val: 2 },
    { label: 'Genial', emoji: '💪', val: 3 },
    { label: 'Imparable', emoji: '🔥', val: 4 }
  ];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const selectedMoodObj = moods.find(m => m.label === mood);

      await supabase.from('surveys').insert({
        gym_id: gymId,
        member_id: memberId,
        difficulty: rating,
        mood: selectedMoodObj ? selectedMoodObj.val : 3,
        comment: comment.trim() || null
      });

      setCompleted(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting survey:', err);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#E9EAEB] space-y-6 animate-in fade-in zoom-in-95">
        {completed ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-[#181D27]">¡Feedback enviado!</h3>
            <p className="text-xs text-[#535862]">Tu entrenador revisará tu progreso para ajustar las cargas.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F26522] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#181D27]">¿Cómo fue tu última sesión?</h3>
                  <p className="text-xs text-[#535862]">Tu feedback ayuda a tu coach a ajustar el plan.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session tag */}
            <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-[#181D27]">Sesión de hoy · Hipertrofia 4 días</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Completada
              </span>
            </div>

            {/* Question 1: Rating */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#344054]">¿Cómo fue la sesión?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition transform active:scale-95"
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
              </div>
            </div>

            {/* Question 2: Mood */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#344054]">¿Cómo te sentiste?</label>
              <div className="grid grid-cols-4 gap-2">
                {moods.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setMood(m.label)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
                      mood === m.label
                        ? 'bg-[#181D27] text-white border-[#181D27] shadow-sm'
                        : 'bg-neutral-50 text-[#535862] border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span className="text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Comments */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#344054]">
                Algo que quieras compartir con tu coach (opcional)
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ej: sentí muy pesada la última serie de sentadilla..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#535862] hover:bg-neutral-100 rounded-xl transition"
              >
                Después
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-sm disabled:opacity-60"
              >
                {submitting ? 'Enviando...' : 'Enviar feedback'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
