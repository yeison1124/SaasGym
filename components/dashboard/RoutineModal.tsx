'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Dumbbell, AlertCircle, BookOpen, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EXERCISE_DATABASE, ROUTINE_TEMPLATES, ExerciseTemplateItem, RoutineTemplate } from '@/lib/exercises-db';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
  userId: string;
  routineToEdit?: any;
  onRoutineSaved: () => void;
}

export function RoutineModal({
  isOpen,
  onClose,
  gymId,
  userId,
  routineToEdit,
  onRoutineSaved,
}: RoutineModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'principiante' | 'intermedio' | 'avanzado'>('intermedio');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [exercises, setExercises] = useState<any[]>([
    { exercise_name: '', sets: 4, reps: '10-12', rest_seconds: 60, video_url: '', notes: '', image_url: '' },
  ]);

  // Catalog Picker Modal state
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogMuscle, setCatalogMuscle] = useState<string>('Todos');
  const [activeExerciseIndexForPicker, setActiveExerciseIndexForPicker] = useState<number | null>(null);

  // Template Picker Modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    async function loadRoutineExercises() {
      if (routineToEdit) {
        setName(routineToEdit.name || '');
        setDescription(routineToEdit.description || '');
        setLevel(routineToEdit.level || 'intermedio');
        setDaysPerWeek(routineToEdit.days_per_week || 3);

        const { data: exData } = await supabase
          .from('routine_exercises')
          .select('*')
          .eq('routine_id', routineToEdit.id)
          .order('order_index', { ascending: true });

        if (exData && exData.length > 0) {
          setExercises(exData);
        } else {
          setExercises([
            { exercise_name: 'Press de banca plano', sets: 4, reps: '8-10', rest_seconds: 90, video_url: '', notes: '', image_url: '' },
          ]);
        }
      } else {
        setName('');
        setDescription('');
        setLevel('intermedio');
        setDaysPerWeek(3);
        setExercises([
          { exercise_name: '', sets: 4, reps: '10-12', rest_seconds: 60, video_url: '', notes: '', image_url: '' },
        ]);
      }
      setError(null);
    }
    if (isOpen) {
      loadRoutineExercises();
    }
  }, [routineToEdit, isOpen, supabase]);

  if (!isOpen) return null;

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      { exercise_name: '', sets: 3, reps: '12-15', rest_seconds: 60, video_url: '', notes: '', image_url: '' },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handlePickFromCatalog = (exercise: ExerciseTemplateItem) => {
    if (activeExerciseIndexForPicker !== null) {
      const updated = [...exercises];
      updated[activeExerciseIndexForPicker] = {
        ...updated[activeExerciseIndexForPicker],
        exercise_name: exercise.name,
        sets: exercise.defaultSets,
        reps: exercise.defaultReps,
        rest_seconds: parseInt(exercise.defaultRest) || 60,
        video_url: exercise.videoUrl || '',
      };
      setExercises(updated);
    } else {
      setExercises([
        ...exercises.filter(ex => ex.exercise_name.trim().length > 0),
        {
          exercise_name: exercise.name,
          sets: exercise.defaultSets,
          reps: exercise.defaultReps,
          rest_seconds: parseInt(exercise.defaultRest) || 60,
          video_url: exercise.videoUrl || '',
          notes: '',
          image_url: ''
        }
      ]);
    }
    setShowCatalogModal(false);
    setActiveExerciseIndexForPicker(null);
  };

  const handleApplyTemplate = (tpl: RoutineTemplate) => {
    setName(tpl.name);
    setDescription(tpl.description);
    setLevel(tpl.level.toLowerCase() as any);
    setDaysPerWeek(tpl.daysCount);
    setExercises(
      tpl.exercises.map(ex => ({
        exercise_name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: parseInt(ex.rest) || 60,
        video_url: '',
        notes: '',
        image_url: ''
      }))
    );
    setShowTemplateModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Por favor ingresa un nombre para la rutina');
      setLoading(false);
      return;
    }

    const validExercises = exercises.filter((ex) => ex.exercise_name.trim().length > 0);
    if (validExercises.length === 0) {
      setError('Debes agregar al menos un ejercicio a la rutina');
      setLoading(false);
      return;
    }

    try {
      let routineId = routineToEdit?.id;

      if (routineId) {
        const { error: updateErr } = await supabase
          .from('routines')
          .update({
            name,
            description,
            level,
            days_per_week: Number(daysPerWeek),
          })
          .eq('id', routineId);
        if (updateErr) throw updateErr;

        // Clear existing exercises
        await supabase.from('routine_exercises').delete().eq('routine_id', routineId);
      } else {
        const { data: newRoutine, error: insertErr } = await supabase
          .from('routines')
          .insert({
            gym_id: gymId,
            name,
            description,
            level,
            days_per_week: Number(daysPerWeek),
            created_by: userId,
          })
          .select('id')
          .single();

        if (insertErr) throw insertErr;
        routineId = newRoutine.id;
      }

      // Insert exercises
      const exercisesToInsert = validExercises.map((ex, idx) => ({
        routine_id: routineId,
        day_index: 1,
        order_index: idx + 1,
        exercise_name: ex.exercise_name,
        sets: Math.max(1, Number(ex.sets) || 3),
        reps: ex.reps || '10-12',
        rest_seconds: Math.max(10, Number(ex.rest_seconds) || 60),
        video_url: ex.video_url || null,
        notes: ex.notes || null,
      }));

      const { error: exErr } = await supabase.from('routine_exercises').insert(exercisesToInsert);
      if (exErr) throw exErr;

      onRoutineSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving routine:', err);
      setError(err.message || 'Error al guardar la rutina');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesMuscle = catalogMuscle === 'Todos' || ex.muscleGroup === catalogMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181D27]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
              Biblioteca de Rutinas
            </div>
            <h2 className="text-xl font-black text-[#181D27]">
              {routineToEdit ? 'Editar Rutina' : 'Crear Nueva Rutina'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!routineToEdit && (
              <button
                type="button"
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
                <span>Plantillas Pre-armadas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] text-[#D92D20] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Nombre de la Rutina *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Hipertrofia Torso/Pierna 4 días"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                  Nivel
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                  Días/Sem
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Descripción / Objetivo
            </label>
            <input
              type="text"
              placeholder="Enfoque en ganancia de masa muscular e hipertrofia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
            />
          </div>

          {/* Exercise Builder */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#181D27] flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#F26522]" />
                <span>Ejercicios de la Rutina ({exercises.filter(e => e.exercise_name).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveExerciseIndexForPicker(null);
                    setShowCatalogModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[11px] font-bold text-[#181D27] border border-[#EBE7DF] transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>Catálogo de Ejercicios</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddExercise}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#181D27] hover:bg-black text-[11px] font-bold text-white transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Libre</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Nombre del ejercicio (ej. Press de Banca Plano)"
                      value={ex.exercise_name}
                      onChange={(e) => handleExerciseChange(idx, 'exercise_name', e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveExerciseIndexForPicker(idx);
                        setShowCatalogModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EBE7DF] text-[10px] font-bold text-[#535862] hover:text-[#181D27] transition cursor-pointer"
                      title="Seleccionar del catálogo"
                    >
                      Catálogo
                    </button>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#D92D20] hover:bg-[#FEE4E2] transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-[#717680] uppercase block mb-1">Series</span>
                      <input
                        type="number"
                        min="1"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(idx, 'sets', Math.max(1, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EBE7DF] font-semibold text-xs text-[#181D27]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#717680] uppercase block mb-1">Reps</span>
                      <input
                        type="text"
                        placeholder="8-10"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EBE7DF] font-semibold text-xs text-[#181D27]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#717680] uppercase block mb-1">Descanso (seg)</span>
                      <input
                        type="number"
                        step="10"
                        min="10"
                        value={ex.rest_seconds}
                        onChange={(e) => handleExerciseChange(idx, 'rest_seconds', Math.max(10, Number(e.target.value)))}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EBE7DF] font-semibold text-xs text-[#181D27]"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#717680] uppercase block mb-1">Video Tutorial (URL)</span>
                      <input
                        type="text"
                        placeholder="https://youtube.com/..."
                        value={ex.video_url || ''}
                        onChange={(e) => handleExerciseChange(idx, 'video_url', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#EBE7DF] font-semibold text-xs text-[#181D27]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#535862] hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#181D27] hover:bg-black text-white text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Guardando...' : routineToEdit ? 'Actualizar Rutina' : 'Guardar Rutina'}
            </button>
          </div>
        </form>
      </div>

      {/* CATALOG PICKER MODAL */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div>
                <h3 className="text-base font-black text-[#181D27]">Catálogo de Ejercicios</h3>
                <p className="text-xs text-[#717680]">Selecciona un ejercicio para agregarlo con sus parámetros sugeridos</p>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Search & Muscle */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A4A7AE] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Buscar ejercicio..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E9EAEB] rounded-xl text-xs text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCatalogMuscle(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      catalogMuscle === m
                        ? 'bg-[#181D27] text-white'
                        : 'bg-[#FAF8F5] text-[#535862] hover:bg-[#E9EAEB]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => handlePickFromCatalog(ex)}
                  className="p-3.5 bg-[#FAF8F5] hover:bg-[#F2F4F7] rounded-2xl border border-[#E9EAEB] hover:border-[#181D27] transition flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#181D27] group-hover:text-[#F26522] transition">
                      {ex.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#717680]">
                      <span className="font-semibold text-[#181D27]">{ex.muscleGroup}</span>
                      <span>•</span>
                      <span>{ex.equipment}</span>
                      <span>•</span>
                      <span>{ex.defaultSets} series × {ex.defaultReps} (descanso {ex.defaultRest})</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F26522] group-hover:underline">
                    Seleccionar →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE PICKER MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div>
                <h3 className="text-base font-black text-[#181D27]">Plantillas de Rutina Pre-armadas</h3>
                <p className="text-xs text-[#717680]">Importa una estructura completa y ajústala a tu gusto</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {ROUTINE_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="p-4 bg-[#FAF8F5] hover:bg-[#FDF2EC] rounded-2xl border border-[#E9EAEB] hover:border-[#F26522] transition cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#181D27] group-hover:text-[#F26522] transition">
                      {tpl.name}
                    </h4>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#E9EAEB]">
                      {tpl.daysCount} días • {tpl.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#535862]">{tpl.description}</p>
                  <div className="text-[10px] text-[#717680] font-semibold">
                    Incluye {tpl.exercises.length} ejercicios: {tpl.exercises.map(e => e.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
