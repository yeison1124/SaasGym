'use client';

import { useState, useRef, useEffect } from 'react';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Lock,
  CheckCircle2,
  Calendar as CalendarIcon,
  LogOut,
  Camera,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MemberSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'perfil' | 'notificaciones' | 'membresia' | 'privacidad' | 'seguridad'>('perfil');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Perfil State
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
  const [form, setForm] = useState({
    nombre: 'María',
    apellido: 'Jiménez',
    email: 'maria@ironstrength.co',
    telefono: '+57 312 987 6543',
    peso: '56',
    altura: '168',
    fechaNacimiento: '1995-03-12',
    objetivoPrincipal: 'Ganar fuerza y recomposición corporal'
  });

  // Notificaciones State
  const [notifications, setNotifications] = useState({
    whatsappReminders: true,
    emailWeekly: true,
    coachMessages: true,
    communityAlerts: true,
    promoOffers: false
  });

  // Privacidad State
  const [privacy, setPrivacy] = useState({
    showInRanking: true,
    sharePRs: true,
    allowSocialComments: true,
    anonymousAnalytics: true
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  // Seguridad State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gympulse_member_profile');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setForm(prev => ({ ...prev, ...parsed }));
        if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
      } catch (e) {}
    }
    const savedNotifs = localStorage.getItem('gympulse_member_notifs');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {}
    }
    const savedPriv = localStorage.getItem('gympulse_member_privacy');
    if (savedPriv) {
      try {
        setPrivacy(JSON.parse(savedPriv));
      } catch (e) {}
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const url = uploadEvent.target?.result as string;
        setAvatarUrl(url);
        localStorage.setItem('gympulse_member_profile', JSON.stringify({ ...form, avatarUrl: url }));
        setSavedSuccess('Foto de perfil actualizada.');
        setTimeout(() => setSavedSuccess(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('gympulse_member_profile', JSON.stringify({ ...form, avatarUrl }));
      setSaving(false);
      setSavedSuccess('Datos personales guardados correctamente.');
      setTimeout(() => setSavedSuccess(null), 3000);
    }, 600);
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('gympulse_member_notifs', JSON.stringify(notifications));
    setSavedSuccess('Preferencias de notificaciones guardadas.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleSavePrivacy = () => {
    localStorage.setItem('gympulse_member_privacy', JSON.stringify(privacy));
    setSavedSuccess('Preferencias de privacidad guardadas.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!passwordForm.currentPassword) {
      setPasswordError('Ingresá tu contraseña actual.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSavedSuccess('Contraseña cambiada con éxito.');
      setTimeout(() => setSavedSuccess(null), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName={`${form.nombre} ${form.apellido}`} />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName={`${form.nombre} ${form.apellido}`} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717680]">
              AJUSTES DE CUENTA
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
              Configuración Personal
            </h1>
            <p className="text-xs text-[#535862] mt-0.5">
              Gestioná tus datos personales, notificaciones, privacidad y seguridad de acceso.
            </p>
          </div>

          {/* Feedback banner */}
          {savedSuccess && (
            <div className="p-4 bg-[#ECFDF3] border border-[#A6F4C5] rounded-2xl flex items-center gap-3 text-xs text-[#027A48] font-semibold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#039855] shrink-0" />
              <span>{savedSuccess}</span>
            </div>
          )}

          {/* 2-Column Settings Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-Nav Tabs */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-[#E9EAEB] shadow-sm space-y-1">
              {[
                { id: 'perfil', label: 'Perfil y Datos', icon: User },
                { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
                { id: 'membresia', label: 'Mi Membresía', icon: CreditCard },
                { id: 'privacidad', label: 'Privacidad y Términos', icon: Shield },
                { id: 'seguridad', label: 'Seguridad y Contraseña', icon: Lock }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#181D27] text-white font-bold shadow-xs'
                        : 'text-[#535862] hover:bg-[#FAF8F5] hover:text-[#181D27]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Content */}
            <div className="lg:col-span-9">
              {/* TAB 1: PERFIL */}
              {activeTab === 'perfil' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Datos Personales</h2>
                    <p className="text-xs text-[#535862] mt-0.5">
                      Esta información se muestra en tu perfil, asistencia y reportes de progreso.
                    </p>
                  </div>

                  {/* Avatar Uploader */}
                  <div className="flex items-center gap-5 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                    <div className="relative group">
                      <img
                        src={avatarUrl}
                        alt={form.nombre}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#181D27]">Foto de perfil</h4>
                      <p className="text-[11px] text-[#717680]">JPG o PNG de hasta 5MB</p>
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="text-xs font-bold text-[#F26522] hover:underline cursor-pointer"
                      >
                        Subir nueva foto
                      </button>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          NOMBRE
                        </label>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          APELLIDO
                        </label>
                        <input
                          type="text"
                          value={form.apellido}
                          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          CORREO ELECTRÓNICO
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          TELÉFONO / WHATSAPP
                        </label>
                        <input
                          type="text"
                          value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    {/* Datos físicos */}
                    <div className="pt-2 space-y-4">
                      <h3 className="text-xs font-bold text-[#181D27]">Datos Físicos & Objetivos</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                            PESO (KG)
                          </label>
                          <input
                            type="number"
                            value={form.peso}
                            onChange={(e) => setForm({ ...form, peso: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                            ALTURA (CM)
                          </label>
                          <input
                            type="number"
                            value={form.altura}
                            onChange={(e) => setForm({ ...form, altura: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                            FECHA DE NACIMIENTO
                          </label>
                          <input
                            type="date"
                            value={form.fechaNacimiento}
                            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          OBJETIVO PRINCIPAL
                        </label>
                        <input
                          type="text"
                          value={form.objetivoPrincipal}
                          onChange={(e) => setForm({ ...form, objetivoPrincipal: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-60 cursor-pointer"
                      >
                        {saving ? 'Guardando...' : 'Guardar cambios de perfil'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: NOTIFICACIONES */}
              {activeTab === 'notificaciones' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Preferencias de Notificaciones</h2>
                    <p className="text-xs text-[#535862]">Elige los canales y tipos de avisos que deseas recibir.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'whatsappReminders',
                        title: 'Recordatorios de clases por WhatsApp',
                        desc: 'Avisos automáticos 2 horas antes del inicio de tus clases reservadas.'
                      },
                      {
                        key: 'emailWeekly',
                        title: 'Resumen semanal por correo electrónico',
                        desc: 'Reporte cada lunes con tus días asistidos, volumen entrenado y XP ganados.'
                      },
                      {
                        key: 'coachMessages',
                        title: 'Mensajes y ajustes de rutina de tu Coach',
                        desc: 'Notificaciones inmediatas cuando tu entrenador actualice ejercicios o notas.'
                      },
                      {
                        key: 'communityAlerts',
                        title: 'Reacciones y comentarios en la Comunidad',
                        desc: 'Alertas cuando otros miembros feliciten tus publicaciones o batan récords.'
                      },
                      {
                        key: 'promoOffers',
                        title: 'Ofertas exclusivas y renovaciones de membresía',
                        desc: 'Descuentos especiales de Iron Strength y promociones antes de vencer tu plan.'
                      }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#181D27] block">{item.title}</span>
                          <span className="text-[11px] text-[#535862]">{item.desc}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={(notifications as any)[item.key]}
                            onChange={(e) => {
                              const updated = { ...notifications, [item.key]: e.target.checked };
                              setNotifications(updated);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#181D27]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotifications}
                      className="px-6 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Guardar preferencias de notificaciones
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: MEMBRESÍA */}
              {activeTab === 'membresia' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Tu Membresía Actual</h2>
                    <p className="text-xs text-[#535862]">Detalles del plan contratado en Iron Strength Medellín.</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#F9F5EE] border border-[#EBE1D0] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#F26522] tracking-wider">PLAN BLACK ANUAL</span>
                      <span className="text-xs font-bold text-[#039855] bg-[#ECFDF3] border border-[#A6F4C5] px-3 py-1 rounded-full">
                        Al día (Activo)
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#181D27]">Acceso Total Ilimitado</h3>
                      <p className="text-xs text-[#535862] mt-0.5">Musculación, Crossfit, Clases Grupales y Asesoría Personalizada.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EBE1D0]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#717680] block">FECHA DE INICIO</span>
                        <span className="text-xs font-bold text-[#181D27]">01 de Enero, 2026</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#717680] block">VÁLIDO HASTA</span>
                        <span className="text-xs font-bold text-[#181D27]">31 de Diciembre, 2026</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#717680] block">MÉTODO DE PAGO</span>
                        <span className="text-xs font-bold text-[#181D27]">Tarjeta Visa •••• 4242</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#181D27] block">¿Deseas cambiar o congelar tu plan?</span>
                      <span className="text-[11px] text-[#535862]">Contacta con administración de Iron Strength para gestionar cambios.</span>
                    </div>
                    <a
                      href="https://wa.me/573129876543?text=Hola,%20quisiera%20consultar%20sobre%20mi%20membresia%20Plan%20Black"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Hablar por WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 4: PRIVACIDAD */}
              {activeTab === 'privacidad' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Privacidad de Perfil y Datos</h2>
                    <p className="text-xs text-[#535862]">Decide qué información es visible para otros miembros del gimnasio.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'showInRanking',
                        title: 'Mostrarme en el Ranking Mensual',
                        desc: 'Permitir que mi nombre y asistencias aparezcan en la tabla de clasificación.'
                      },
                      {
                        key: 'sharePRs',
                        title: 'Compartir Récords Personales (PR)',
                        desc: 'Hacer visibles mis mejores marcas de fuerza en la comunidad.'
                      },
                      {
                        key: 'allowSocialComments',
                        title: 'Permitir que otros miembros comenten mis logros',
                        desc: 'Habilitar la caja de felicitaciones en publicaciones del feed.'
                      },
                      {
                        key: 'anonymousAnalytics',
                        title: 'Colaborar con estadísticas anónimas',
                        desc: 'Permitir al gimnasio medir tiempos de uso de máquinas para evitar congestión.'
                      }
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#181D27] block">{item.title}</span>
                          <span className="text-[11px] text-[#535862]">{item.desc}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={(privacy as any)[item.key]}
                            onChange={(e) => {
                              const updated = { ...privacy, [item.key]: e.target.checked };
                              setPrivacy(updated);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#181D27]"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSavePrivacy}
                      className="px-6 py-2.5 bg-[#181D27] hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Guardar opciones de privacidad
                    </button>
                  </div>

                  {/* Legal links */}
                  <div className="pt-4 border-t border-[#F2F4F7] flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#181D27] hover:text-[#F26522] transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ver Términos de Servicio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrivacyPolicyModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#181D27] hover:text-[#F26522] transition cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Ver Política de Privacidad y Tratamiento de Datos</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: SEGURIDAD */}
              {activeTab === 'seguridad' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Seguridad de la Cuenta</h2>
                    <p className="text-xs text-[#535862]">Actualiza tu contraseña y configura la autenticación de doble factor.</p>
                  </div>

                  {passwordError && (
                    <div className="p-3.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-2xl flex items-center gap-2.5 text-xs text-[#B42318] font-semibold">
                      <AlertCircle className="w-4 h-4 text-[#D92D20] shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Password change form */}
                  <form onSubmit={handleChangePassword} className="space-y-4 p-5 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#F26522]" />
                        <h3 className="text-xs font-bold text-[#181D27]">Cambiar Contraseña</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="text-xs text-[#717680] hover:text-[#181D27] inline-flex items-center gap-1"
                      >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showPass ? 'Ocultar' : 'Mostrar'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#535862] uppercase tracking-wider mb-1">
                          CONTRASEÑA ACTUAL
                        </label>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#535862] uppercase tracking-wider mb-1">
                          NUEVA CONTRASEÑA
                        </label>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#535862] uppercase tracking-wider mb-1">
                          CONFIRMAR NUEVA
                        </label>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Repite la contraseña"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {saving ? 'Actualizando...' : 'Actualizar contraseña'}
                      </button>
                    </div>
                  </form>

                  {/* 2FA Section */}
                  <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E9EAEB] text-[#181D27] flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#181D27]">Autenticación en Dos Pasos (2FA)</h4>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            twoFactorEnabled ? 'bg-[#ECFDF3] text-[#039855] border border-[#A6F4C5]' : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {twoFactorEnabled ? 'ACTIVADA' : 'DESACTIVADA'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#535862] mt-0.5">
                          Protege tu cuenta solicitando un código temporal al iniciar sesión.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        setSavedSuccess(twoFactorEnabled ? '2FA Desactivada.' : '2FA Activada con éxito.');
                        setTimeout(() => setSavedSuccess(null), 3000);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        twoFactorEnabled
                          ? 'bg-[#FEF3F2] text-[#B42318] hover:bg-[#FECDCA]'
                          : 'bg-[#181D27] text-white hover:bg-black'
                      }`}
                    >
                      {twoFactorEnabled ? 'Desactivar 2FA' : 'Activar 2FA'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Términos de Servicio */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <h3 className="text-base font-black text-[#181D27]">Términos de Servicio — GymPulse & Iron Strength</h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-xs font-bold text-[#717680] hover:text-[#181D27]"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#535862] space-y-3 leading-relaxed pr-2">
              <p><strong>1. Uso de la Plataforma:</strong> GymPulse es un software que facilita la administración, reserva de clases, seguimiento de rutinas y comunidad para los miembros de Iron Strength.</p>
              <p><strong>2. Membresía y Acceso:</strong> El acceso a las instalaciones físicas está sujeto al estado activo y al día de la membresía contratada.</p>
              <p><strong>3. Responsabilidad Física:</strong> El usuario declara encontrarse en condiciones aptas para la práctica de actividad física y seguir las instrucciones de los entrenadores certificados.</p>
              <p><strong>4. Reservas y Cancelaciones:</strong> Las clases reservadas deben cancelarse con al menos 2 horas de anticipación para permitir el cupo a otros miembros.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition"
            >
              He leído y acepto los términos
            </button>
          </div>
        </div>
      )}

      {/* Modal Política de Privacidad */}
      {showPrivacyPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <h3 className="text-base font-black text-[#181D27]">Política de Privacidad y Tratamiento de Datos</h3>
              <button
                onClick={() => setShowPrivacyPolicyModal(false)}
                className="text-xs font-bold text-[#717680] hover:text-[#181D27]"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#535862] space-y-3 leading-relaxed pr-2">
              <p><strong>1. Recolección de Datos:</strong> Recopilamos datos personales (nombre, correo, teléfono, peso, fotos de progreso opcionales) con la única finalidad de personalizar tus rutinas y gestionar tu membresía.</p>
              <p><strong>2. Seguridad y Encriptación:</strong> Tus contraseñas están encriptadas con bcrypt y el acceso a la base de datos se encuentra protegido bajo políticas de Row Level Security (RLS) en Supabase.</p>
              <p><strong>3. Derechos ARCO:</strong> Puedes solicitar en cualquier momento la actualización, rectificación o supresión de tus datos personales a través del panel de configuración.</p>
            </div>
            <button
              onClick={() => setShowPrivacyPolicyModal(false)}
              className="w-full py-2.5 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
