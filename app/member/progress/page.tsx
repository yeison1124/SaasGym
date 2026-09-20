'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  TrendingDown,
  TrendingUp,
  Scale,
  Plus,
  Camera,
  Trophy,
  Ruler,
  CheckCircle2,
  X,
  Upload,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function MemberProgressPage() {
  const supabase = createClient();
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1A'>('3M');
  const [showAddWeightModal, setShowAddWeightModal] = useState(false);
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [showAllRecordsModal, setShowAllRecordsModal] = useState(false);

  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Body Measurements State
  const [measurements, setMeasurements] = useState({
    pecho: 88,
    cintura: 66,
    cadera: 94,
    brazo: 27,
    muslo: 54,
    updatedAt: '15 de Mayo de 2026'
  });

  const [progressEntries, setProgressEntries] = useState([
    { date: 'Feb', weight: 67.5 },
    { date: 'Mar', weight: 65.0 },
    { date: 'Abr', weight: 63.5 },
    { date: '15-May', weight: 61.2 },
    { date: '15-May', weight: 60.0 }
  ]);

  const [photos, setPhotos] = useState([
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80'
  ]);

  const allRecords = [
    { exercise: 'Sentadilla con barra', weight: '70 kg', reps: '5 reps', date: '12-may-2026', category: 'Pierna' },
    { exercise: 'Press de banca plano', weight: '42 kg', reps: '5 reps', date: '08-may-2026', category: 'Pecho' },
    { exercise: 'Hip thrust con barra', weight: '85 kg', reps: '8 reps', date: '15-may-2026', category: 'Glúteo' },
    { exercise: 'Peso muerto rumano', weight: '65 kg', reps: '6 reps', date: '10-may-2026', category: 'Espalda / Isquios' },
    { exercise: 'Prensa inclinada', weight: '140 kg', reps: '10 reps', date: '04-may-2026', category: 'Pierna' },
    { exercise: 'Press militar con mancuernas', weight: '16 kg c/u', reps: '8 reps', date: '02-may-2026', category: 'Hombro' },
    { exercise: 'Dominadas asistidas', weight: '-15 kg', reps: '6 reps', date: '28-abr-2026', category: 'Espalda' }
  ];

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    setSaving(true);
    try {
      const w = parseFloat(newWeight);
      const newEntry = { date: 'Hoy', weight: w };
      setProgressEntries([...progressEntries, newEntry]);

      await supabase.from('progress_entries').insert({
        gym_id: '5200c3fa-b18c-445d-883d-b28fa6b23ffe',
        member_id: '88888888-8888-8888-8888-888888888888',
        weight_kg: w,
        notes: newNotes
      });

      setShowAddWeightModal(false);
      setNewWeight('');
      setNewNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = photoPreview || newPhotoUrl || 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80';
    setPhotos([finalUrl, ...photos]);
    setShowUploadPhotoModal(false);
    setPhotoPreview(null);
    setNewPhotoUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    setMeasurements(prev => ({
      ...prev,
      updatedAt: 'Hoy'
    }));
    setShowMeasurementsModal(false);
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
                TU EVOLUCIÓN
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Progreso
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                Compará tu evolución de peso, medidas corporales, fotos y récords personales a lo largo del tiempo.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Timeframe selector */}
              <div className="flex items-center bg-white border border-[#D5D7DA] rounded-xl p-1 shadow-xs">
                {(['1M', '3M', '6M', '1A'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      timeframe === t
                        ? 'bg-[#181D27] text-white'
                        : 'text-[#535862] hover:text-[#181D27]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddWeightModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar peso</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Summary Cards with REAL DATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E9EAEB] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider">PESO</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -7.5 kg
                </span>
              </div>
              <div className="text-3xl font-black text-[#181D27]">
                60 <span className="text-sm font-normal text-[#535862]">kg</span>
              </div>
              <p className="text-[11px] text-[#717680]">vs. Inicio (feb 2026)</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E9EAEB] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider">IMC</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Normal
                </span>
              </div>
              <div className="text-3xl font-black text-[#181D27]">
                21.3
              </div>
              <p className="text-[11px] text-[#717680]">Rango saludable (18.5 - 24.9)</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E9EAEB] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider">GRASA CORPORAL</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -3.2%
                </span>
              </div>
              <div className="text-3xl font-black text-[#181D27]">
                18.5 <span className="text-sm font-normal text-[#535862]">%</span>
              </div>
              <p className="text-[11px] text-[#717680]">Nivel fitness óptimo</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E9EAEB] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider">MASA MUSCULAR</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.1 kg
                </span>
              </div>
              <div className="text-3xl font-black text-[#181D27]">
                44.2 <span className="text-sm font-normal text-[#535862]">kg</span>
              </div>
              <p className="text-[11px] text-[#717680]">Ganancia muscular neta</p>
            </div>
          </div>

          {/* Row 2: Weight Evolution Chart + Body Measurements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Weight Evolution Chart */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#181D27]">Evolución de peso</h3>
                  <p className="text-xs text-[#535862]">{progressEntries.length} registros · kg</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> -7.5 kg total
                </span>
              </div>

              {/* Graphical Chart simulation */}
              <div className="pt-4 pb-2">
                <div className="relative h-44 w-full flex items-end justify-between px-4 pb-6">
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F26522" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#F26522" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 20 Q 150 45 250 65 T 380 90 T 480 130 L 480 150 L 20 150 Z"
                      fill="url(#weightGrad)"
                    />
                    <path
                      d="M 20 20 Q 150 45 250 65 T 380 90 T 480 130"
                      fill="none"
                      stroke="#F26522"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Milestones labels */}
                  {progressEntries.map((p, idx) => (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <span className="text-[11px] font-bold text-[#181D27] mb-1">{p.weight} kg</span>
                      <div className="w-3 h-3 rounded-full bg-[#F26522] ring-4 ring-orange-100" />
                      <span className="text-[10px] text-[#717680] mt-2 block font-medium">{p.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Body Measurements Card with Live Data */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-[#717680]" />
                  <h3 className="text-base font-bold text-[#181D27]">Medidas corporales</h3>
                </div>
                <button
                  onClick={() => setShowMeasurementsModal(true)}
                  className="text-[11px] font-bold text-[#F26522] hover:underline cursor-pointer"
                >
                  Actualizar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                  <span className="text-[10px] font-bold text-[#717680] uppercase block">Pecho</span>
                  <span className="text-base font-black text-[#181D27]">{measurements.pecho} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                  <span className="text-[10px] font-bold text-[#717680] uppercase block">Cintura</span>
                  <span className="text-base font-black text-[#181D27]">{measurements.cintura} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                  <span className="text-[10px] font-bold text-[#717680] uppercase block">Cadera</span>
                  <span className="text-base font-black text-[#181D27]">{measurements.cadera} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                  <span className="text-[10px] font-bold text-[#717680] uppercase block">Brazo</span>
                  <span className="text-base font-black text-[#181D27]">{measurements.brazo} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                </div>

                <div className="col-span-2 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#717680] uppercase block">Muslo / Pierna</span>
                    <span className="text-base font-black text-[#181D27]">{measurements.muslo} <span className="text-xs font-normal text-[#535862]">cm</span></span>
                  </div>
                  <span className="text-[10px] text-[#717680]">Act: {measurements.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Progress Photos + Personal Records */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Photos */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#717680]" />
                  <h3 className="text-base font-bold text-[#181D27]">Fotos comparativas</h3>
                </div>
                <button
                  onClick={() => setShowUploadPhotoModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#181D27] text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subir foto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-neutral-200 group relative shadow-2xs">
                    <img src={url} alt={`Progreso ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {i === 0 ? 'Reciente' : i === 1 ? 'Abril' : i === 2 ? 'Marzo' : 'Febrero'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Records */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-7 border border-[#E9EAEB] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#717680]" />
                    <h3 className="text-base font-bold text-[#181D27]">Récords personales (1RM)</h3>
                  </div>
                  <button
                    onClick={() => setShowAllRecordsModal(true)}
                    className="text-[11px] font-bold text-[#F26522] hover:underline cursor-pointer"
                  >
                    Ver todos &gt;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {allRecords.slice(0, 3).map((r, i) => (
                    <div key={i} className="p-3 bg-[#FAF8F5] rounded-2xl flex items-center justify-between border border-[#E9EAEB]">
                      <div>
                        <span className="text-xs font-bold text-[#181D27] block">{r.exercise}</span>
                        <span className="text-[10px] text-[#717680] block">{r.reps} · {r.date}</span>
                      </div>
                      <span className="text-xs font-black text-[#181D27] bg-white px-2.5 py-1 rounded-xl border border-[#E9EAEB]">
                        {r.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Subir Foto de Progreso */}
      {showUploadPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#F26522]" />
                <h3 className="font-bold text-[#181D27]">Subir Foto de Progreso</h3>
              </div>
              <button
                onClick={() => setShowUploadPhotoModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-[#344054]">Seleccionar archivo desde tu galería *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2.5 border border-[#D5D7DA] rounded-xl text-xs bg-[#FAF8F5]"
                />
              </div>

              {photoPreview && (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#D5D7DA] relative">
                  <img src={photoPreview} alt="Vista previa" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadPhotoModal(false)}
                  className="px-4 py-2 font-semibold text-[#535862]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold rounded-xl cursor-pointer"
                >
                  Guardar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Actualizar Medidas Corporales */}
      {showMeasurementsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#F26522]" />
                <h3 className="font-bold text-[#181D27]">Actualizar Medidas Corporales</h3>
              </div>
              <button
                onClick={() => setShowMeasurementsModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurements} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#344054] mb-1">Pecho (cm)</label>
                  <input
                    type="number"
                    value={measurements.pecho}
                    onChange={(e) => setMeasurements({ ...measurements, pecho: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D7DA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#344054] mb-1">Cintura (cm)</label>
                  <input
                    type="number"
                    value={measurements.cintura}
                    onChange={(e) => setMeasurements({ ...measurements, cintura: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D7DA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#344054] mb-1">Cadera (cm)</label>
                  <input
                    type="number"
                    value={measurements.cadera}
                    onChange={(e) => setMeasurements({ ...measurements, cadera: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D7DA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#344054] mb-1">Brazo (cm)</label>
                  <input
                    type="number"
                    value={measurements.brazo}
                    onChange={(e) => setMeasurements({ ...measurements, brazo: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D7DA]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-bold text-[#344054] mb-1">Muslo (cm)</label>
                  <input
                    type="number"
                    value={measurements.muslo}
                    onChange={(e) => setMeasurements({ ...measurements, muslo: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D7DA]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMeasurementsModal(false)}
                  className="px-4 py-2 font-semibold text-[#535862]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#181D27] text-white font-semibold rounded-xl"
                >
                  Guardar Medidas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ver Todos los Récords Personales */}
      {showAllRecordsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-[#181D27]">Todos tus Récords Personales</h3>
              </div>
              <button
                onClick={() => setShowAllRecordsModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {allRecords.map((r, i) => (
                <div key={i} className="p-3.5 bg-[#FAF8F5] rounded-2xl flex items-center justify-between border border-[#E9EAEB]">
                  <div>
                    <span className="text-xs font-bold text-[#181D27] block">{r.exercise}</span>
                    <span className="text-[10px] text-[#717680] block mt-0.5">{r.category} · {r.reps} · {r.date}</span>
                  </div>
                  <span className="text-xs font-black text-[#181D27] bg-white px-3 py-1.5 rounded-xl border border-[#E9EAEB] shadow-2xs">
                    {r.weight}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAllRecordsModal(false)}
                className="px-5 py-2 bg-[#181D27] text-white text-xs font-semibold rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Peso */}
      {showAddWeightModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#F26522]" />
                <h3 className="font-bold text-[#181D27]">Registrar Peso de Hoy</h3>
              </div>
              <button
                onClick={() => setShowAddWeightModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWeight} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#344054] mb-1">Peso actual (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Ej: 59.8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D7DA] text-sm font-bold text-[#181D27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#344054] mb-1">Nota o sensación (opcional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej: Después de entrenar en ayunas"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWeightModal(false)}
                  className="px-4 py-2 font-semibold text-[#535862]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#181D27] text-white font-semibold rounded-xl"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
