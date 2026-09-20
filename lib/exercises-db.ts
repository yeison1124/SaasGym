export interface ExerciseTemplateItem {
  id: string;
  name: string;
  muscleGroup: 'Pecho' | 'Espalda' | 'Piernas' | 'Hombros' | 'Brazos' | 'Core' | 'Cardio';
  equipment: 'Barra' | 'Mancuernas' | 'Máquina' | 'Polea' | 'Corporal' | 'Kettlebell';
  defaultSets: number;
  defaultReps: string;
  defaultRest: string;
  videoUrl?: string;
  imageUrl?: string;
}

export const EXERCISE_DATABASE: ExerciseTemplateItem[] = [
  // Pecho
  {
    id: 'ex-1',
    name: 'Press de Banca Plano con Barra',
    muscleGroup: 'Pecho',
    equipment: 'Barra',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: '90s',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  {
    id: 'ex-2',
    name: 'Press Inclinado con Mancuernas',
    muscleGroup: 'Pecho',
    equipment: 'Mancuernas',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRest: '75s'
  },
  {
    id: 'ex-3',
    name: 'Aperturas en Polea (Cruces)',
    muscleGroup: 'Pecho',
    equipment: 'Polea',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRest: '60s'
  },
  {
    id: 'ex-4',
    name: 'Fondos en Paralelas (Dips)',
    muscleGroup: 'Pecho',
    equipment: 'Corporal',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRest: '75s'
  },

  // Espalda
  {
    id: 'ex-5',
    name: 'Peso Muerto Convencional',
    muscleGroup: 'Espalda',
    equipment: 'Barra',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRest: '120s'
  },
  {
    id: 'ex-6',
    name: 'Dominadas Pronas (Pull-ups)',
    muscleGroup: 'Espalda',
    equipment: 'Corporal',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: '90s'
  },
  {
    id: 'ex-7',
    name: 'Remo con Barra 45°',
    muscleGroup: 'Espalda',
    equipment: 'Barra',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: '90s'
  },
  {
    id: 'ex-8',
    name: 'Jalón al Pecho en Polea Alta',
    muscleGroup: 'Espalda',
    equipment: 'Polea',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRest: '60s'
  },
  {
    id: 'ex-9',
    name: 'Remo Gironda en Polea Baja',
    muscleGroup: 'Espalda',
    equipment: 'Polea',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: '60s'
  },

  // Piernas
  {
    id: 'ex-10',
    name: 'Sentadilla Trasera con Barra (Back Squat)',
    muscleGroup: 'Piernas',
    equipment: 'Barra',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: '120s'
  },
  {
    id: 'ex-11',
    name: 'Prensa de Piernas 45°',
    muscleGroup: 'Piernas',
    equipment: 'Máquina',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRest: '90s'
  },
  {
    id: 'ex-12',
    name: 'Sentadilla Búlgara con Mancuernas',
    muscleGroup: 'Piernas',
    equipment: 'Mancuernas',
    defaultSets: 3,
    defaultReps: '10 por pierna',
    defaultRest: '75s'
  },
  {
    id: 'ex-13',
    name: 'Extensiones de Cuádriceps',
    muscleGroup: 'Piernas',
    equipment: 'Máquina',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRest: '60s'
  },
  {
    id: 'ex-14',
    name: 'Curl Femoral Tumbado',
    muscleGroup: 'Piernas',
    equipment: 'Máquina',
    defaultSets: 4,
    defaultReps: '10-12',
    defaultRest: '60s'
  },
  {
    id: 'ex-15',
    name: 'Elevación de Gemelos en Máquina',
    muscleGroup: 'Piernas',
    equipment: 'Máquina',
    defaultSets: 4,
    defaultReps: '15-20',
    defaultRest: '45s'
  },

  // Hombros
  {
    id: 'ex-16',
    name: 'Press Militar de Pie con Barra (Overhead Press)',
    muscleGroup: 'Hombros',
    equipment: 'Barra',
    defaultSets: 4,
    defaultReps: '8-10',
    defaultRest: '90s'
  },
  {
    id: 'ex-17',
    name: 'Elevaciones Laterales con Mancuernas',
    muscleGroup: 'Hombros',
    equipment: 'Mancuernas',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRest: '60s'
  },
  {
    id: 'ex-18',
    name: 'Pájaros / Elevación Posterior en Polea',
    muscleGroup: 'Hombros',
    equipment: 'Polea',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: '45s'
  },

  // Brazos
  {
    id: 'ex-19',
    name: 'Curl de Bíceps con Barra Z',
    muscleGroup: 'Brazos',
    equipment: 'Barra',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRest: '60s'
  },
  {
    id: 'ex-20',
    name: 'Curl Martillo con Mancuernas',
    muscleGroup: 'Brazos',
    equipment: 'Mancuernas',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: '60s'
  },
  {
    id: 'ex-21',
    name: 'Extensiones de Tríceps en Polea Alta (Cuerda)',
    muscleGroup: 'Brazos',
    equipment: 'Polea',
    defaultSets: 4,
    defaultReps: '12-15',
    defaultRest: '60s'
  },
  {
    id: 'ex-22',
    name: 'Press Francés con Barra',
    muscleGroup: 'Brazos',
    equipment: 'Barra',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRest: '60s'
  },

  // Core & Cardio
  {
    id: 'ex-23',
    name: 'Plancha Abdominal Isométrica',
    muscleGroup: 'Core',
    equipment: 'Corporal',
    defaultSets: 3,
    defaultReps: '45-60s',
    defaultRest: '45s'
  },
  {
    id: 'ex-24',
    name: 'Elevación de Piernas Colgado',
    muscleGroup: 'Core',
    equipment: 'Corporal',
    defaultSets: 3,
    defaultReps: '12-15',
    defaultRest: '45s'
  },
  {
    id: 'ex-25',
    name: 'Intervalos en Remo Indoor o AirBike',
    muscleGroup: 'Cardio',
    equipment: 'Máquina',
    defaultSets: 5,
    defaultReps: '1 min sprint / 1 min suave',
    defaultRest: '60s'
  }
];

export interface RoutineTemplate {
  id: string;
  name: string;
  goal: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  daysCount: number;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
  }[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Torso / Pierna — Hipertrofia (4 Días)',
    goal: 'Hipertrofia Muscular',
    level: 'Intermedio',
    daysCount: 4,
    description: 'Rutina clásica de frecuencia 2 dividida en 2 días de torso y 2 días de pierna para máxima ganancia muscular.',
    exercises: [
      { name: 'Press de Banca Plano con Barra', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Remo con Barra 45°', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Press Militar de Pie con Barra (Overhead Press)', sets: 3, reps: '10', rest: '75s' },
      { name: 'Jalón al Pecho en Polea Alta', sets: 3, reps: '12', rest: '60s' },
      { name: 'Extensiones de Tríceps en Polea Alta (Cuerda)', sets: 3, reps: '12-15', rest: '60s' }
    ]
  },
  {
    id: 'tpl-2',
    name: 'Fuerza 5x5 Clásica (Full Body)',
    goal: 'Fuerza Máxima',
    level: 'Principiante',
    daysCount: 3,
    description: 'Programa lineal enfocado en los levantamientos básicos para construir una base sólida de fuerza.',
    exercises: [
      { name: 'Sentadilla Trasera con Barra (Back Squat)', sets: 5, reps: '5', rest: '120s' },
      { name: 'Press de Banca Plano con Barra', sets: 5, reps: '5', rest: '120s' },
      { name: 'Remo con Barra 45°', sets: 5, reps: '5', rest: '120s' }
    ]
  },
  {
    id: 'tpl-3',
    name: 'Definición y Acondicionamiento (MetCon)',
    goal: 'Pérdida de Grasa',
    level: 'Intermedio',
    daysCount: 4,
    description: 'Combinación de circuitos de fuerza con descansos cortos y trabajo cardiovascular para acelerar el metabolismo.',
    exercises: [
      { name: 'Sentadilla Búlgara con Mancuernas', sets: 4, reps: '12 por pierna', rest: '45s' },
      { name: 'Fondos en Paralelas (Dips)', sets: 3, reps: '12', rest: '45s' },
      { name: 'Dominadas Pronas (Pull-ups)', sets: 3, reps: '8-10', rest: '60s' },
      { name: 'Intervalos en Remo Indoor o AirBike', sets: 5, reps: '1 min', rest: '45s' }
    ]
  },
  {
    id: 'tpl-4',
    name: 'Glúteos & Piernas Enfoque Femenino',
    goal: 'Tonificación e Hipertrofia',
    level: 'Intermedio',
    daysCount: 3,
    description: 'Diseñada para desarrollo prioritario de glúteos, femorales y cuádriceps sin descuidar el tren superior.',
    exercises: [
      { name: 'Peso Muerto Convencional', sets: 4, reps: '8', rest: '90s' },
      { name: 'Prensa de Piernas 45°', sets: 4, reps: '12', rest: '75s' },
      { name: 'Sentadilla Búlgara con Mancuernas', sets: 3, reps: '12', rest: '60s' },
      { name: 'Curl Femoral Tumbado', sets: 4, reps: '15', rest: '60s' },
      { name: 'Plancha Abdominal Isométrica', sets: 3, reps: '60s', rest: '45s' }
    ]
  }
];
