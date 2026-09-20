'use client';

import { useState } from 'react';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar as CalendarIcon,
  X,
  User,
  Clock,
  Check
} from 'lucide-react';

export default function MemberSchedulePage() {
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [weekOffset, setWeekOffset] = useState(0);

  const [reservedClasses, setReservedClasses] = useState<Record<string, boolean>>({
    'hiit-vie': true
  });

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonthName = 'mayo de 2026';

  // Calculate dynamic days based on weekOffset
  const baseDay = 11 + weekOffset * 7;
  const days = [
    { name: 'LUN', date: `${Math.max(1, (baseDay) % 31)}`, isCurrent: false },
    { name: 'MAR', date: `${Math.max(1, (baseDay + 1) % 31)}`, isCurrent: false },
    { name: 'MIÉ', date: `${Math.max(1, (baseDay + 2) % 31)}`, isCurrent: false },
    { name: 'JUE', date: `${Math.max(1, (baseDay + 3) % 31)}`, isCurrent: false },
    { name: 'VIE', date: `${Math.max(1, (baseDay + 4) % 31)}`, isCurrent: false },
    { name: 'SÁB', date: `${Math.max(1, (baseDay + 5) % 31)}`, isCurrent: false },
    { name: 'DOM', date: `${Math.max(1, (baseDay + 6) % 31)}`, isCurrent: true }
  ];

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const allClasses = [
    {
      id: 'stretching-mar',
      day: 'MAR',
      time: '08:00',
      name: 'Stretching',
      discipline: 'Stretching',
      trainer: 'Camila Pérez',
      timeLabel: '08:00 · Camila Pérez',
      bg: 'bg-[#F9F5EE] border-[#EAE3D2] text-[#181D27]'
    },
    {
      id: 'hiit-mie',
      day: 'MIÉ',
      time: '08:00',
      name: 'Funcional HIIT',
      discipline: 'Funcional HIIT',
      trainer: 'Esteban Rivera',
      timeLabel: '07:30 · Esteban Rivera',
      bg: 'bg-[#FDF3E7] border-[#FCE2C4] text-[#181D27]'
    },
    {
      id: 'hiit-vie',
      day: 'VIE',
      time: '10:00',
      name: 'Funcional HIIT',
      discipline: 'Funcional HIIT',
      trainer: 'Esteban Rivera',
      timeLabel: '10:00 · Esteban Rivera',
      bg: 'bg-[#FDF3E7] border-[#FCE2C4] text-[#181D27]'
    },
    {
      id: 'yoga-sab',
      day: 'SÁB',
      time: '09:00',
      name: 'Yoga flow',
      discipline: 'Yoga flow',
      trainer: 'Lucía Galván',
      timeLabel: '09:00 · Lucía Galván',
      bg: 'bg-[#F9F5EE] border-[#EAE3D2] text-[#181D27]'
    },
    {
      id: 'crossfit-dom',
      day: 'DOM',
      time: '11:00',
      name: 'CrossFit open',
      discipline: 'CrossFit',
      trainer: 'Esteban Rivera',
      timeLabel: '11:00 · Esteban Rivera',
      bg: 'bg-[#181D27] border-[#181D27] text-white'
    }
  ];

  const filteredClasses = allClasses.filter(c => {
    if (selectedDiscipline !== 'all' && c.discipline !== selectedDiscipline) return false;
    if (selectedTrainer !== 'all' && c.trainer !== selectedTrainer) return false;
    return true;
  });

  const totalReserved = Object.values(reservedClasses).filter(Boolean).length;

  const toggleReservation = (classId: string) => {
    setReservedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
    setSelectedClass(null);
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
                MI SEMANA
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
                Agenda
              </h1>
              <p className="text-xs text-[#535862] mt-0.5">
                {days[0].date}-may — {days[6].date}-may · {totalReserved} {totalReserved === 1 ? 'clase reservada' : 'clases reservadas'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Month / Week switcher */}
              <div className="flex items-center bg-white border border-[#D5D7DA] rounded-xl px-2 py-1 shadow-xs">
                <button
                  onClick={() => setWeekOffset(weekOffset - 1)}
                  className="p-1 text-[#717680] hover:text-[#181D27] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-[#181D27] px-3 select-none">
                  {currentMonthName} {weekOffset !== 0 && `(Sem ${weekOffset > 0 ? `+${weekOffset}` : weekOffset})`}
                </span>
                <button
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  className="p-1 text-[#717680] hover:text-[#181D27] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-xs font-bold shadow-xs cursor-pointer transition ${
                  selectedDiscipline !== 'all' || selectedTrainer !== 'all'
                    ? 'bg-[#181D27] text-white border-[#181D27]'
                    : 'bg-white border-[#D5D7DA] text-[#181D27] hover:bg-neutral-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{selectedDiscipline !== 'all' || selectedTrainer !== 'all' ? 'Filtros Activos' : 'Filtrar'}</span>
              </button>
            </div>
          </div>

          {/* Weekly Grid Calendar Table */}
          <div className="bg-white rounded-3xl border border-[#E9EAEB] shadow-sm overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Days Row */}
              <div className="grid grid-cols-8 border-b border-[#E9EAEB] text-center bg-[#FAF8F5]/60">
                <div className="p-3.5 text-[10px] font-bold text-[#717680] uppercase tracking-wider flex items-center justify-center">
                  HORA
                </div>
                {days.map((d) => (
                  <div key={d.name} className="p-3.5 border-l border-[#E9EAEB]">
                    <span className="text-[10px] font-bold text-[#717680] uppercase tracking-wider block">
                      {d.name}
                    </span>
                    <div className="mt-1 flex items-center justify-center">
                      {d.isCurrent ? (
                        <span className="w-6 h-6 rounded-full bg-[#181D27] text-white text-xs font-black flex items-center justify-center shadow-xs">
                          {d.date}
                        </span>
                      ) : (
                        <span className="text-xs font-black text-[#181D27]">
                          {d.date}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slot Rows */}
              <div className="divide-y divide-[#F2F4F7]">
                {timeSlots.map((slot) => (
                  <div key={slot} className="grid grid-cols-8 min-h-[64px] items-stretch">
                    {/* Time Column */}
                    <div className="p-3 text-[11px] text-[#717680] font-medium flex items-start justify-center">
                      {slot}
                    </div>

                    {/* 7 Days Columns */}
                    {days.map((d) => {
                      const classItem = filteredClasses.find(c => c.day === d.name && c.time === slot);
                      const isBooked = classItem ? reservedClasses[classItem.id] : false;

                      return (
                        <div key={d.name} className="border-l border-[#F2F4F7] p-1.5 flex items-stretch">
                          {classItem ? (
                            <div
                              onClick={() => setSelectedClass(classItem)}
                              className={`w-full p-2.5 rounded-2xl border ${classItem.bg} flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition shadow-xs group`}
                            >
                              <div>
                                <span className={`text-xs font-bold block ${classItem.id === 'crossfit-dom' ? 'text-white' : 'text-[#181D27]'}`}>
                                  {classItem.name}
                                </span>
                                <span className={`text-[10px] block mt-0.5 ${classItem.id === 'crossfit-dom' ? 'text-neutral-300' : 'text-[#535862]'}`}>
                                  {classItem.timeLabel}
                                </span>
                              </div>

                              {isBooked && (
                                <div className="mt-2">
                                  <span className="inline-block bg-[#181D27] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
                                    RESERVADA
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#E9EAEB] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#F26522]" />
                <h3 className="font-bold text-[#181D27]">Filtrar Clases</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#344054] mb-2">Disciplina / Tipo de Clase</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'Funcional HIIT', 'Yoga flow', 'Stretching', 'CrossFit'].map((disc) => (
                    <button
                      key={disc}
                      type="button"
                      onClick={() => setSelectedDiscipline(disc)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        selectedDiscipline === disc
                          ? 'bg-[#181D27] text-white border-[#181D27]'
                          : 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862] hover:bg-neutral-100'
                      }`}
                    >
                      {disc === 'all' ? 'Todas las clases' : disc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#344054] mb-2">Entrenador / Coach</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'Esteban Rivera', 'Lucía Galván', 'Camila Pérez'].map((tr) => (
                    <button
                      key={tr}
                      type="button"
                      onClick={() => setSelectedTrainer(tr)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        selectedTrainer === tr
                          ? 'bg-[#181D27] text-white border-[#181D27]'
                          : 'bg-[#FAF8F5] border-[#E9EAEB] text-[#535862] hover:bg-neutral-100'
                      }`}
                    >
                      {tr === 'all' ? 'Todos los coaches' : tr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F2F4F7]">
              <button
                onClick={() => {
                  setSelectedDiscipline('all');
                  setSelectedTrainer('all');
                  setShowFilterModal(false);
                }}
                className="text-xs font-bold text-[#717680] hover:text-[#181D27]"
              >
                Limpiar filtros
              </button>

              <button
                onClick={() => setShowFilterModal(false)}
                className="px-5 py-2.5 bg-[#181D27] text-white text-xs font-bold rounded-xl"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Class Modal / Detail */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#E9EAEB] space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#F2F4F7]">
              <div>
                <span className="text-[10px] font-bold text-[#F26522] uppercase tracking-wider bg-[#F26522]/10 px-2.5 py-0.5 rounded-full">
                  Clase Grupal
                </span>
                <h3 className="text-xl font-bold text-[#181D27] mt-1.5">{selectedClass.name}</h3>
              </div>
              <button
                onClick={() => setSelectedClass(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#344054]">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl">
                <User className="w-4 h-4 text-[#717680]" />
                <div>
                  <span className="font-bold text-[#181D27] block">Entrenador a cargo</span>
                  <span className="text-[#535862]">{selectedClass.trainer}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl">
                <Clock className="w-4 h-4 text-[#717680]" />
                <div>
                  <span className="font-bold text-[#181D27] block">Horario y Día</span>
                  <span className="text-[#535862]">Día {selectedClass.day} a las {selectedClass.time} (60 min)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 text-xs font-semibold text-[#535862]"
              >
                Cerrar
              </button>
              <button
                onClick={() => toggleReservation(selectedClass.id)}
                className={`px-5 py-2.5 text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer ${
                  reservedClasses[selectedClass.id]
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-[#181D27] text-white hover:bg-neutral-800'
                }`}
              >
                {reservedClasses[selectedClass.id] ? 'Cancelar mi reserva' : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
