# PRD — GetGym

**Producto:** GetGym — SaaS de gestión y retención para gimnasios
**Versión del documento:** 1.0
**Tipo:** Plataforma web (SaaS multi-tenant, multi-rol)
**Mercado:** LATAM (Colombia, México, Argentina, Chile, Perú)
**Estado:** MVP por construir

---

## 1. Resumen ejecutivo

GetGym es una plataforma SaaS que ayuda a dueños de gimnasios medianos en LATAM a **reducir el abandono de sus miembros**.

No es un ERP de gimnasio. No es un software de facturación. Es una herramienta de retención: detecta qué miembros están por irse, le dice al dueño qué hacer al respecto, y le da al miembro razones para volver (rutina clara, progreso visible, racha, comunidad).

Todo lo demás que trae el producto (miembros, pagos, rutinas, agenda) existe **solo porque alimenta el motor de retención**. Si una función no aporta señal de riesgo ni aumenta la adherencia del miembro, queda fuera del MVP.

**Modelo de negocio:** suscripción mensual por gimnasio (Free / Starter USD 17 / Pro / Enterprise).
**Métrica norte del producto:** % de miembros nuevos que siguen activos al día 90.

---

## 2. Problema y oportunidad

### 2.1 El problema

Un gimnasio mediano en LATAM pierde entre **30% y 40% de sus miembros nuevos en los primeros 90 días**. El dueño se entera tarde: cuando el miembro deja de pagar. Para ese momento ya es irrecuperable.

Las señales existían antes:

- dejó de asistir 10 días seguidos,
- nunca recibió una rutina asignada,
- bajó la frecuencia semanal de 4 a 1,
- no completó el onboarding de las primeras 2 semanas,
- su pago venció y nadie lo contactó.

Nadie mira esas señales porque están en una planilla de Excel, en la memoria del entrenador o en un cuaderno en recepción.

### 2.2 Por qué duele económicamente

Para un gimnasio de 300 miembros a USD 30/mes:

- churn mensual del 8% = 24 miembros perdidos = **USD 720/mes** de ingreso recurrente evaporado.
- costo de adquirir un miembro nuevo: USD 25–40 en pauta.
- reducir el churn del 8% al 5% vale más que sumar 20 miembros nuevos, y cuesta mucho menos.

GetGym se vende con ese número: **si retenés 2 miembros más por mes, la herramienta ya se pagó sola.**

### 2.3 Competencia y hueco de mercado

El software existente en la región (Trainingym, Bsport, Gymneo, planillas de Excel, WhatsApp) está construido para **administrar** (cobrar, controlar acceso, facturar). Ninguno está construido para **retener**. Además:

- son caros para un gimnasio mediano,
- están en inglés o mal traducidos,
- no tienen app decente para el miembro,
- no dan señales accionables, dan reportes históricos.

El hueco: una herramienta barata, en español, que le diga al dueño **"estos 7 miembros se van a ir este mes, hacé esto"**.

---

## 3. User personas

### 3.1 Roberto — Dueño de gimnasio (usuario que paga)

- 42 años, Medellín, Colombia. Dueño de un gimnasio de 280 miembros y 4 entrenadores.
- Ex entrenador, no es técnico. Usa el celular más que la computadora.
- Hoy gestiona todo con Excel + WhatsApp + un cuaderno.
- Pierde 30–40% de sus miembros nuevos en los primeros 90 días.
- **Lo que quiere:** abrir la app a las 8 am y en 10 segundos saber quién está en riesgo y a quién llamar hoy.
- **Lo que odia:** cargar datos, software que tarda semanas en configurar, reportes que no le dicen qué hacer.
- **Frase típica:** "Me enteré que se fue cuando no pagó."

### 3.2 Carlos — Entrenador (usuario operativo)

- 29 años, trabaja en el gimnasio de Roberto medio turno.
- Arma rutinas, las escribe a mano o en el bloc de notas del celular.
- **Lo que quiere:** asignar rutinas rápido y ver quién vino y quién no.
- **Lo que no debe poder hacer:** ver pagos, ingresos, ni dar de baja miembros.
- Acceso limitado por diseño.

### 3.3 María — Miembro del gimnasio (usuario final, no paga la SaaS)

- 31 años, entrena 3 veces por semana cuando le va bien.
- Se anota en enero, se cae en marzo. Le pasó tres veces.
- **Lo que quiere:** saber qué tiene que hacer hoy, ver que está progresando, y que alguien note si falta.
- **Lo que la retiene:** racha visible, foto de progreso, rutina asignada con su nombre, un entrenador que la saluda.
- Usa la plataforma 100% desde el celular.

### 3.4 SuperAdmin — Dueño de la plataforma (vos)

- Necesita ver salud del negocio SaaS: gimnasios activos, MRR, churn de cuentas, conversión de trial a pago.
- Necesita poder entrar a cualquier gimnasio para dar soporte.

---

## 4. Alcance del MVP

### 4.1 Dentro del MVP

- Autenticación con email/password y roles (superadmin, owner, trainer, member).
- Multi-tenancy real: cada gimnasio ve solo sus datos.
- CRUD de miembros con **score de riesgo de abandono**.
- Registro de asistencias (check-in manual desde recepción o desde el celular del miembro).
- Rutinas: crear plantillas, asignar a miembros, marcar ejercicios como completados.
- Pagos y membresías: fecha de vencimiento, estado (al día / por vencer / vencido), listado de morosos.
- Dashboard del dueño con las 4 métricas que importan.
- Vista del miembro: rutina de hoy, racha, progreso, agenda.
- Encuesta post-entreno de 1 toque (¿cómo te fue hoy? 😞 😐 🙂 💪).
- Landing pública con planes y registro.
- Panel de SuperAdmin.

### 4.2 Fuera del MVP (explícitamente)

- App móvil nativa (la web es responsive y alcanza).
- Control de acceso por molinete / biometría.
- Facturación fiscal electrónica por país.
- Videollamadas o entrenamiento online en vivo.
- Marketplace de entrenadores.
- Nutrición y planes alimenticios.
- Integración con wearables (Apple Watch, Garmin).
- Multi-sede por gimnasio (fase 2).

> Regla del MVP: si una función no reduce el churn de miembros o no mejora la decisión diaria de Roberto, no entra.

---

## 5. El motor de retención (el corazón del producto)

### 5.1 Score de riesgo de abandono

Cada miembro tiene un `risk_score` de 0 a 100 recalculado diariamente. Cuanto más alto, más probable que se vaya.

| Señal | Peso | Cálculo |
|---|---|---|
| Días desde la última asistencia | 35 | 0 días = 0 pts · 7 días = 15 pts · 14 días = 30 pts · 21+ días = 35 pts |
| Caída de frecuencia semanal | 25 | Compara promedio de las últimas 2 semanas vs. las 4 anteriores. Caída >50% = 25 pts |
| Sin rutina asignada | 15 | Si `assigned_routine_id IS NULL` = 15 pts |
| Estado de pago | 15 | Vencido = 15 pts · Por vencer (≤7 días) = 7 pts |
| Antigüedad < 90 días | 10 | Los primeros 90 días son los de mayor riesgo = 10 pts |

**Bandas:**

- `0–29` → 🟢 Saludable
- `30–59` → 🟡 Atención
- `60–100` → 🔴 En riesgo

### 5.2 Acciones sugeridas

El dashboard no muestra el score y ya. Muestra **qué hacer**:

- 🔴 "María no viene hace 16 días. Mandale un mensaje." → botón *Abrir WhatsApp* con mensaje pre-armado.
- 🟡 "Carlos bajó de 4 a 1 visita por semana." → botón *Asignar nueva rutina*.
- 🔴 "7 miembros sin rutina asignada." → botón *Asignar en lote*.

### 5.3 Retención del lado del miembro

- **Racha (streak):** días/semanas consecutivas cumpliendo el objetivo semanal.
- **Progreso visible:** peso, medidas, fotos antes/después.
- **Rutina personal:** con su nombre y el nombre del entrenador que se la armó.
- **Logros:** badges por hitos (primera semana, 10 entrenos, 1 mes sin faltar, 50 entrenos).
- **Encuesta post-entreno:** feedback de 1 toque que alimenta al entrenador.

---

## 6. Funcionalidades por rol

### 6.1 🟣 SuperAdmin

| # | Pantalla | Ruta | Qué hace |
|---|---|---|---|
| 1 | Landing pública | `/` | Propuesta de valor, planes, CTA de registro |
| 2 | Dashboard global | `/admin` | Gimnasios activos, MRR, usuarios activos, churn de cuentas |
| 3 | Gestión de gimnasios | `/admin/gyms` | Listado, alta, edición, suspensión, impersonar |
| 4 | Gestión de usuarios | `/admin/users` | Todos los usuarios, cambio de rol, reset de acceso |
| 5 | Planes y facturación | `/admin/billing` | Configuración de planes, historial de pagos, fallidos |
| 6 | Analytics | `/admin/analytics` | Cohortes, retención de cuentas, conversión trial→pago |
| 7 | Configuración global | `/admin/settings` | Branding, integraciones, parámetros del sistema |

### 6.2 🔵 Dueño de gimnasio

| # | Pantalla | Ruta | Qué hace |
|---|---|---|---|
| 1 | Dashboard | `/dashboard` | Miembros activos, en riesgo, ingresos del mes, asistencias de hoy + lista de acciones sugeridas |
| 2 | Miembros | `/dashboard/members` | CRUD, filtro por banda de riesgo, ficha individual con historial |
| 3 | Rutinas | `/dashboard/routines` | Crear plantillas, biblioteca de ejercicios, asignar a miembros |
| 4 | Entrenadores | `/dashboard/trainers` | Alta de staff con permisos limitados |
| 5 | Pagos y membresías | `/dashboard/payments` | Cobros, vencimientos, morosos, registro de pago manual |
| 6 | Reportes | `/dashboard/reports` | Asistencia, retención por cohorte, ingresos. Exportable a CSV |
| 7 | Configuración | `/dashboard/settings` | Datos del gimnasio, logo, horarios, branding |
| 8 | Centro de ayuda | `/dashboard/help` | Documentación contextual y onboarding |

### 6.3 🟢 Miembro

| # | Pantalla | Ruta | Qué hace |
|---|---|---|---|
| 1 | Dashboard personal | `/app` | Próxima sesión, racha actual, entreno de hoy, motivación |
| 2 | Plan de entrenamiento | `/app/routine` | Rutina asignada, ejercicios con series/reps/video, marcar completado |
| 3 | Progreso | `/app/progress` | Peso, medidas, fotos antes/después, gráficos de evolución |
| 4 | Agenda | `/app/schedule` | Calendario de clases y sesiones, reservar/cancelar |
| 5 | Comunidad | `/app/community` | Feed interno del gimnasio, posteos y reacciones |
| 6 | Logros y rachas | `/app/achievements` | Badges, niveles, streak |
| 7 | Encuestas post-entreno | modal en `/app` | Feedback de 1 toque al terminar |
| 8 | Configuración | `/app/settings` | Datos personales, notificaciones, preferencias |

### 6.4 🟠 Entrenador (acceso reducido dentro de `/dashboard`)

Ve: miembros asignados, rutinas, asistencias, respuestas de encuestas.
**No ve:** pagos, ingresos, reportes financieros, configuración del gimnasio, gestión de staff.

---

## 7. Arquitectura técnica

### 7.1 Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, rutas por rol, deploy simple |
| UI | React + TypeScript | Tipado estricto, menos bugs |
| Estilos | Tailwind CSS + shadcn/ui | Velocidad y consistencia visual |
| Gráficos | Recharts | Ligero, suficiente para el MVP |
| Base de datos | Supabase (PostgreSQL) | Auth + DB + Storage + RLS en un solo servicio |
| Auth | Supabase Auth (email/password) | JWT nativo, integrado con RLS |
| Storage | Supabase Storage | Fotos de progreso, logos, avatares |
| Pagos | Stripe (Checkout + Webhooks) | Suscripciones de los gimnasios |
| Email | Resend o SendGrid | Bienvenida, recuperación, avisos de vencimiento |
| Errores | Sentry | Monitoreo en producción |
| Analytics | GA4 / Plausible | Uso de la landing y del producto |
| Deploy | Netlify | Dominio propio, CI desde Git |

### 7.2 Multi-tenancy

Modelo: **tenant por fila** (`gym_id` en cada tabla), con Row Level Security de Postgres.

Regla no negociable: **toda tabla de datos de negocio tiene `gym_id` y una política RLS que filtra por el gimnasio del usuario autenticado.** Nunca se filtra solo en el frontend.

### 7.3 Estructura de carpetas

```
getgym/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # landing
│   │   ├── pricing/
│   │   ├── login/
│   │   └── register/
│   ├── admin/                        # superadmin
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── gyms/
│   │   ├── users/
│   │   ├── billing/
│   │   ├── analytics/
│   │   └── settings/
│   ├── dashboard/                    # owner + trainer
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── members/[id]/
│   │   ├── routines/
│   │   ├── trainers/
│   │   ├── payments/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── help/
│   ├── app/                          # miembro
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── routine/
│   │   ├── progress/
│   │   ├── schedule/
│   │   ├── community/
│   │   ├── achievements/
│   │   └── settings/
│   └── api/
│       ├── webhooks/stripe/
│       └── cron/risk-score/
├── components/
│   ├── ui/                           # shadcn
│   ├── charts/
│   ├── members/
│   └── layout/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── risk-score.ts
│   ├── permissions.ts
│   └── utils.ts
├── types/
│   └── database.types.ts
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── middleware.ts                     # protección de rutas por rol
├── PRD.md
└── .env.local
```

---

## 8. Modelo de datos

### 8.1 Tablas principales

**`gyms`** — el tenant
`id`, `name`, `slug`, `logo_url`, `address`, `city`, `country`, `phone`, `timezone`, `plan` (free|starter|pro|enterprise), `subscription_status` (trialing|active|past_due|canceled), `stripe_customer_id`, `trial_ends_at`, `created_at`

**`profiles`** — extiende `auth.users`
`id` (FK a auth.users), `gym_id` (nullable para superadmin), `role` (superadmin|owner|trainer|member), `full_name`, `email`, `phone`, `avatar_url`, `is_active`, `created_at`

**`members`** — datos de negocio del miembro
`id`, `gym_id`, `profile_id` (nullable: puede existir sin cuenta), `full_name`, `email`, `phone`, `birth_date`, `goal`, `joined_at`, `status` (active|paused|churned), `assigned_trainer_id`, `assigned_routine_id`, `risk_score`, `risk_band`, `last_attendance_at`, `membership_expires_at`, `created_at`

**`attendances`**
`id`, `gym_id`, `member_id`, `checked_in_at`, `source` (staff|self), `created_at`

**`routines`** — plantilla
`id`, `gym_id`, `name`, `description`, `level` (principiante|intermedio|avanzado), `days_per_week`, `created_by`, `created_at`

**`routine_exercises`**
`id`, `routine_id`, `day_index`, `order_index`, `exercise_name`, `sets`, `reps`, `rest_seconds`, `video_url`, `notes`

**`routine_assignments`**
`id`, `gym_id`, `routine_id`, `member_id`, `assigned_by`, `assigned_at`, `is_active`

**`workout_logs`** — el miembro marcó que entrenó
`id`, `gym_id`, `member_id`, `routine_id`, `day_index`, `completed_at`, `duration_minutes`

**`payments`**
`id`, `gym_id`, `member_id`, `amount`, `currency`, `method` (cash|transfer|card), `paid_at`, `period_start`, `period_end`, `status` (paid|pending|failed), `created_by`

**`progress_entries`**
`id`, `gym_id`, `member_id`, `recorded_at`, `weight_kg`, `body_fat_pct`, `chest_cm`, `waist_cm`, `hip_cm`, `arm_cm`, `thigh_cm`, `photo_url`, `notes`

**`classes`** y **`class_bookings`**
Agenda: `id`, `gym_id`, `name`, `trainer_id`, `starts_at`, `ends_at`, `capacity` · booking: `class_id`, `member_id`, `status`

**`surveys`** — encuesta post-entreno
`id`, `gym_id`, `member_id`, `workout_log_id`, `mood` (1–4), `difficulty` (1–5), `comment`, `created_at`

**`achievements`** y **`member_achievements`**
`code`, `name`, `description`, `icon`, `threshold` · unión con `member_id`, `unlocked_at`

**`posts`** y **`post_reactions`** — comunidad interna del gimnasio

**`audit_logs`**
`id`, `gym_id`, `actor_id`, `action`, `entity`, `entity_id`, `metadata`, `created_at`

### 8.2 Reglas de RLS (resumen)

- `superadmin`: acceso total (política con `role = 'superadmin'`).
- `owner`: acceso total **dentro de su `gym_id`**.
- `trainer`: lectura de miembros/rutinas/asistencias de su gym; escritura solo en rutinas, asignaciones y asistencias. **Sin acceso a `payments`.**
- `member`: lectura y escritura solo de **sus propias filas** (`member_id = auth.uid()` vía `profile_id`).
- Sin excepciones: ninguna tabla queda con RLS deshabilitado.

---

## 9. Integraciones externas

| Servicio | Uso | Fase |
|---|---|---|
| Stripe | Suscripción de gimnasios, Checkout + Customer Portal + webhooks | MVP |
| Resend / SendGrid | Bienvenida, recuperación de contraseña, aviso de vencimiento | MVP |
| Supabase Storage | Fotos de progreso, logos, avatares | MVP |
| WhatsApp (deep link `wa.me`) | Contactar miembro en riesgo desde el dashboard | MVP |
| Sentry | Errores en producción | MVP |
| GA4 / Plausible | Analytics de landing y producto | MVP |
| Twilio | SMS/WhatsApp Business automatizado | Fase 2 |

---

## 10. Seguridad

- **Auth:** Supabase Auth, JWT en cookies httpOnly. Contraseñas hasheadas con bcrypt por Supabase (nunca implementar hashing propio).
- **RBAC:** rol en `profiles.role`, verificado en middleware (routing) **y** en RLS (datos). Doble capa obligatoria.
- **Aislamiento de tenants:** RLS por `gym_id` en el 100% de las tablas de negocio.
- **Variables de entorno:** `SUPABASE_SERVICE_ROLE_KEY` jamás en el cliente. Solo en route handlers del servidor.
- **Validación:** Zod en cada entrada de usuario, en cliente y servidor.
- **Rate limiting:** en login, registro y endpoints públicos.
- **Webhooks de Stripe:** verificación de firma obligatoria.
- **Storage:** buckets privados con URLs firmadas para fotos de progreso.
- **Auditoría:** toda acción destructiva (baja de miembro, cambio de rol, registro de pago) va a `audit_logs`.
- **Datos personales:** las fotos de progreso son dato sensible. Nunca públicas, nunca en bucket abierto.

---

## 11. Métricas de éxito

### Del producto (para Roberto)

- Miembros nuevos activos al día 90: **de 60–70% a 80%+**.
- Churn mensual de miembros: **de 8% a ≤5%**.
- % de miembros con rutina asignada: **>90%**.
- Miembros en 🔴 contactados dentro de las 48 h: **>80%**.

### Del negocio (para vos)

- Trial → pago: **>25%**.
- Churn de cuentas mensual: **<5%**.
- Tiempo de onboarding de un gimnasio nuevo: **<30 minutos**.
- Uso semanal del dashboard por el dueño: **≥4 días/semana**.

---

## 12. Planes y precios

| Plan | Precio | Miembros | Entrenadores | Incluye |
|---|---|---|---|---|
| Free | USD 0 | hasta 20 | 1 | Dashboard básico, miembros, asistencias |
| Starter | USD 17/mes | hasta 150 | 3 | Todo Free + rutinas, pagos, score de riesgo |
| Pro | USD 39/mes | hasta 500 | 10 | Todo Starter + reportes, comunidad, branding |
| Enterprise | a medida | ilimitado | ilimitado | Multi-sede, API, soporte prioritario |

Trial de 14 días en Starter, sin tarjeta.

---

## 13. Roadmap por fases

**Fase 1 — PRD** ✅ (este documento)
**Fase 2 — Vistas con Claude Code:** las 23 pantallas con datos mock, responsive, sin backend.
**Fase 3 — Supabase:** esquema, migraciones, RLS, seed de datos de prueba.
**Fase 4 — Lógica real:** registro, login, middleware por rol, CRUD conectado, cálculo de `risk_score`.
**Fase 5 — Testeo del MVP:** recorrido completo por los 3 roles, feedback estructurado.
**Fase 6 — Seguridad:** checklist pre-deploy (RLS, claves, validación, rate limiting).
**Fase 7 — Deploy:** Netlify + dominio propio + Stripe en vivo.

**Post-MVP:** multi-sede, app nativa, automatizaciones de WhatsApp, integración con wearables.

---

## 14. Instrucciones para Claude Code

Cuando construyas sobre este PRD:

1. **Respetá la estructura de carpetas de la sección 7.3 al pie de la letra.**
2. **TypeScript estricto.** Nada de `any`.
3. **Mobile-first.** María usa solo el celular; Roberto también, la mitad del tiempo.
4. **Una pantalla a la vez.** No generes 23 vistas de un saque: pedí confirmación entre bloques.
5. **Datos mock en Fase 2**, en `lib/mock-data.ts`, con la misma forma que los tipos de la sección 8. Así el cambio a Supabase es solo reemplazar la fuente.
6. **Nunca filtres tenants solo en el frontend.** Filtro en RLS siempre.
7. **Español (LATAM neutro) en toda la interfaz.** Código y nombres de variables en inglés.
8. **Estética:** claro y cálido, igual a la referencia de producto real (getgym.app). Fondo general crema `#FBF7EE`, tarjetas en blanco `#FFFFFF` con borde `#EDE7DA`, texto principal `#181818`, texto secundario `#6B6558`. Acento único cálido (terracota) `#E8734A` para CTAs, badges de rol e íconos destacados — no un color distinto por rol; el rol se identifica con una etiqueta de texto (ej. "SUPERADMIN"), no con un esquema de color propio. Botones primarios sólidos en negro `#181818` con texto blanco. Estados: verde `#1F9D55` para variaciones positivas, rojo `#D64545` para negativas y alertas de riesgo alto, ámbar `#C98A1E` para riesgo medio. Tipografía: una sola familia sans-serif redondeada (tipo Inter o similar) con pesos claros para jerarquía, sin mezclar una segunda tipografía display. Tarjetas con esquinas redondeadas moderadas y sombra suave, consistentes entre sí. Nada de gradientes decorativos ni de mayúsculas sostenidas en las etiquetas.
9. Antes de escribir código de una fase nueva, **releé este PRD** y listá qué vas a construir para que lo aprueben.

---

*Fin del documento.*
