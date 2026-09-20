'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import {
  Building2,
  Tag,
  Users,
  Sparkles,
  Plug,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Phone,
  MapPin,
  ExternalLink,
  Plus,
  Camera,
  Trash2,
  Edit2,
  X,
  Save,
  MessageSquare,
  ShieldCheck,
  Send
} from 'lucide-react';

interface GymOffer {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  badge: string;
  isActive: boolean;
}

export default function SettingsPage() {
  const supabase = createClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'gimnasio' | 'ofertas' | 'equipo' | 'plan' | 'integraciones' | 'automatizaciones'>('gimnasio');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [gymId, setGymId] = useState('a0000000-0000-0000-0000-000000000001');

  // Gym Profile & Logo
  const [logoUrl, setLogoUrl] = useState<string | null>('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=150&q=80');
  const [formData, setFormData] = useState({
    name: 'Iron Strength',
    slug: 'iron-strength',
    location: 'Medellín · Colombia',
    country: 'Colombia',
    website: 'https://ironstrength.co',
    phone: '+57 300 555 1234',
    schedule: 'Lun a Sáb · 06:00 — 22:00'
  });

  // Offers State
  const [offers, setOffers] = useState<GymOffer[]>([
    {
      id: 'off-1',
      title: 'Plan Black Anual (2 Meses Gratis)',
      description: 'Acceso total ilimitado + 1 evaluación corporal mensual y acceso a todas las sedes.',
      price: '$120.000 COP',
      period: 'mes',
      badge: 'Más Vendido',
      isActive: true
    },
    {
      id: 'off-2',
      title: 'Plan Trimestral Fuerza & Cardio',
      description: 'Acceso ilimitado a zona de pesas y clases grupales de lunes a domingo.',
      price: '$140.000 COP',
      period: 'mes',
      badge: 'Popular',
      isActive: true
    },
    {
      id: 'off-3',
      title: 'Pase Mensual Libre',
      description: 'Sin permanencia mínima, acceso general de 06:00 a 22:00.',
      price: '$160.000 COP',
      period: 'mes',
      badge: 'Flexible',
      isActive: true
    }
  ]);
  const [editingOffer, setEditingOffer] = useState<GymOffer | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Integrations State
  const [integrations, setIntegrations] = useState({
    whatsapp: true,
    stripe: true,
    mercadopago: true,
    googleCalendar: false
  });

  // Automations State
  const [automations, setAutomations] = useState({
    riskAlert7Days: true,
    welcomeNewMember: true,
    birthdayDiscount: true,
    postWorkoutSurvey: true
  });

  useEffect(() => {
    fetchGymSettings();
    const savedOffers = localStorage.getItem('gympulse_owner_offers');
    if (savedOffers) {
      try {
        setOffers(JSON.parse(savedOffers));
      } catch (e) {}
    }
    const savedLogo = localStorage.getItem('gympulse_owner_logo');
    if (savedLogo) setLogoUrl(savedLogo);
  }, []);

  const fetchGymSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      let targetGymId = 'a0000000-0000-0000-0000-000000000001';

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('gym_id')
          .eq('id', user.id)
          .single();
        if (profile?.gym_id) targetGymId = profile.gym_id;
      }

      setGymId(targetGymId);

      const { data: gym } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', targetGymId)
        .single();

      if (gym) {
        setFormData({
          name: gym.name || 'Iron Strength',
          slug: gym.name ? gym.name.toLowerCase().replace(/\s+/g, '-') : 'iron-strength',
          location: gym.city ? `${gym.city} · ${gym.country || 'Colombia'}` : 'Medellín · Colombia',
          country: gym.country || 'Colombia',
          website: 'https://ironstrength.co',
          phone: gym.phone || '+57 300 555 1234',
          schedule: 'Lun a Sáb · 06:00 — 22:00'
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const url = uploadEvent.target?.result as string;
        setLogoUrl(url);
        localStorage.setItem('gympulse_owner_logo', url);
        setSavedSuccess('Logotipo del gimnasio actualizado correctamente.');
        setTimeout(() => setSavedSuccess(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGymInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(null);

      const [cityPart, countryPart] = formData.location.split('·').map(s => s.trim());

      await supabase
        .from('gyms')
        .update({
          name: formData.name,
          phone: formData.phone,
          country: formData.country || countryPart || 'Colombia',
          city: cityPart || 'Medellín'
        })
        .eq('id', gymId);

      setSavedSuccess('Datos del gimnasio guardados exitosamente.');
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    let updated: GymOffer[];
    if (offers.some(o => o.id === editingOffer.id)) {
      updated = offers.map(o => o.id === editingOffer.id ? editingOffer : o);
    } else {
      updated = [editingOffer, ...offers];
    }

    setOffers(updated);
    localStorage.setItem('gympulse_owner_offers', JSON.stringify(updated));
    setIsOfferModalOpen(false);
    setEditingOffer(null);
    setSavedSuccess('Oferta guardada correctamente.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    localStorage.setItem('gympulse_owner_offers', JSON.stringify(updated));
    setSavedSuccess('Oferta eliminada.');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar gymName={formData.name} highRiskCount={0} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader gymName={formData.name} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#535862]">
              GESTIÓN GENERAL
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
              Configuración del Gimnasio
            </h1>
            <p className="text-xs text-[#535862] mt-0.5">
              Personaliza tu marca, logotipo, promociones comerciales, pasarelas e integraciones.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-4 bg-[#ECFDF3] border border-[#A6F4C5] rounded-2xl flex items-center gap-3 text-xs text-[#027A48] font-semibold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#039855] shrink-0" />
              <span>{savedSuccess}</span>
            </div>
          )}

          {/* Settings Layout: Left Sub-nav & Right Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-navigation Tabs */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-[#E9EAEB] shadow-sm space-y-1">
              {[
                { id: 'gimnasio', label: 'Datos & Logo', icon: Building2 },
                { id: 'ofertas', label: 'Ofertas & Promociones', icon: Tag },
                { id: 'equipo', label: 'Equipo & Roles', icon: Users },
                { id: 'integraciones', label: 'WhatsApp & Pagos', icon: Plug },
                { id: 'automatizaciones', label: 'Alertas Automáticas', icon: MessageSquare },
                { id: 'plan', label: 'Plan SaaS GymPulse', icon: Sparkles }
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

            {/* Right Card */}
            <div className="lg:col-span-9">
              {/* TAB 1: DATOS & LOGO */}
              {activeTab === 'gimnasio' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Identidad del Gimnasio</h2>
                    <p className="text-xs text-[#535862] mt-0.5">
                      Aparece en las pantallas de tus miembros, recibos y mensajes automáticos.
                    </p>
                  </div>

                  {/* Logo uploader */}
                  <div className="p-5 bg-[#FAF8F5] rounded-3xl border border-[#E9EAEB] flex items-center gap-5">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-[#E9EAEB] overflow-hidden flex items-center justify-center shadow-xs">
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-8 h-8 text-[#717680]" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#181D27]">Logotipo Oficial</h4>
                      <p className="text-[11px] text-[#717680]">Recomendado PNG transparente o JPG cuadrado (500x500 px)</p>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="text-xs font-bold text-[#F26522] hover:underline cursor-pointer"
                      >
                        Subir nueva imagen de logo
                      </button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSaveGymInfo} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          NOMBRE DEL GIMNASIO
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          SLUG PÚBLICO
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          CIUDAD Y SEDE
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          PAÍS
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          TELÉFONO DE RECEPCIÓN / WHATSAPP
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#D5D7DA] bg-white text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#535862] uppercase tracking-wider mb-1.5">
                          HORARIO DE ATENCIÓN
                        </label>
                        <input
                          type="text"
                          value={formData.schedule}
                          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
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
                        {saving ? 'Guardando...' : 'Guardar Datos del Gimnasio'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: OFERTAS CRUD */}
              {activeTab === 'ofertas' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#181D27]">Ofertas & Planes Comerciales</h2>
                      <p className="text-xs text-[#535862]">Estas promociones aparecen en el Dashboard de tus miembros para incentivar renovaciones.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingOffer({
                          id: `off-${Date.now()}`,
                          title: '',
                          description: '',
                          price: '$130.000 COP',
                          period: 'mes',
                          badge: 'Nuevo',
                          isActive: true
                        });
                        setIsOfferModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#F26522]" />
                      <span>Nueva Oferta</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div key={offer.id} className="p-5 rounded-2xl border border-[#E9EAEB] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#181D27]">{offer.title}</h4>
                            <span className="text-[10px] font-bold bg-[#FDF2EC] text-[#D94F00] px-2 py-0.5 rounded-full border border-[#FAD7C5]">
                              {offer.badge}
                            </span>
                            {offer.isActive ? (
                              <span className="text-[10px] font-bold text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded">Activa</span>
                            ) : (
                              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Pausada</span>
                            )}
                          </div>
                          <p className="text-xs text-[#535862]">{offer.description}</p>
                          <div className="text-xs font-black text-[#181D27] pt-1">
                            {offer.price} / {offer.period}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOffer(offer);
                              setIsOfferModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-white border border-[#E9EAEB] text-[#535862] hover:text-[#181D27] transition cursor-pointer"
                            title="Editar oferta"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-2 rounded-xl bg-white border border-[#E9EAEB] text-neutral-400 hover:text-[#D92D20] hover:bg-[#FEF3F2] transition cursor-pointer"
                            title="Eliminar oferta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EQUIPO */}
              {activeTab === 'equipo' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Equipo y Permisos</h2>
                    <p className="text-xs text-[#535862]">Propietarios, administradores y entrenadores de Iron Strength.</p>
                  </div>
                  <div className="divide-y divide-[#F2F4F7]">
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#181D27]">Roberto Martínez</h4>
                        <p className="text-[11px] text-[#535862]">roberto@ironstrength.co · Sede Medellín</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Dueño (Owner)
                      </span>
                    </div>
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#181D27]">Camila Pérez</h4>
                        <p className="text-[11px] text-[#535862]">camila@ironstrength.co · Crossfit & Funcional</p>
                      </div>
                      <span className="text-xs font-bold text-[#181D27] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E9EAEB]">
                        Coach Principal
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INTEGRACIONES */}
              {activeTab === 'integraciones' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Integraciones de Pasarelas & WhatsApp</h2>
                    <p className="text-xs text-[#535862]">Automatiza cobros y mensajes de retención.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'whatsapp', name: 'WhatsApp Cloud API / Web', desc: 'Envío de alertas de inactividad y bienvenida a miembros en 1 toque.', status: 'Conectado' },
                      { key: 'stripe', name: 'Stripe Payments', desc: 'Cobro recurrente automático con tarjetas de crédito internacionales.', status: 'Activo' },
                      { key: 'mercadopago', name: 'Mercado Pago / PSE', desc: 'Cobro local en Colombia por PSE, transferencias bancarias y efectivo.', status: 'Activo' }
                    ].map((item) => (
                      <div key={item.key} className="p-4 rounded-2xl border border-[#E9EAEB] bg-[#FAF8F5] flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#181D27]">{item.name}</h4>
                            <span className="text-[10px] font-bold text-[#039855] bg-[#ECFDF3] px-2 py-0.5 rounded-full">{item.status}</span>
                          </div>
                          <p className="text-[11px] text-[#535862] mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSavedSuccess(`Configuración de ${item.name} guardada.`);
                            setTimeout(() => setSavedSuccess(null), 3000);
                          }}
                          className="px-3 py-1.5 bg-white border border-[#E9EAEB] text-xs font-bold text-[#181D27] hover:bg-[#F2F4F7] rounded-xl transition cursor-pointer"
                        >
                          Configurar API
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AUTOMATIZACIONES */}
              {activeTab === 'automatizaciones' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-[#181D27]">Automatizaciones de Retención</h2>
                    <p className="text-xs text-[#535862]">Disparadores automáticos que retienen socios sin esfuerzo manual.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'riskAlert7Days', title: 'Alerta tras 7 días sin asistir', desc: 'Sugiere al coach enviar un mensaje amistoso de motivación por WhatsApp.' },
                      { key: 'welcomeNewMember', title: 'Bienvenida con rutina inicial', desc: 'Envía guía de inicio rápido cuando un nuevo socio se registra en Iron Strength.' },
                      { key: 'birthdayDiscount', title: 'Felicitación de cumpleaños + descuento', desc: 'Notifica 10% de descuento en renovación el día del cumpleaños del alumno.' },
                      { key: 'postWorkoutSurvey', title: 'Micro-encuesta post-entreno', desc: 'Habilita la encuesta de satisfacción de 3 preguntas tras completar la rutina.' }
                    ].map((item) => (
                      <div key={item.key} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-[#181D27] block">{item.title}</span>
                          <span className="text-[11px] text-[#535862]">{item.desc}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={(automations as any)[item.key]}
                            onChange={(e) => {
                              const updated = { ...automations, [item.key]: e.target.checked };
                              setAutomations(updated);
                              setSavedSuccess('Automatización actualizada.');
                              setTimeout(() => setSavedSuccess(null), 3000);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#181D27]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PLAN SAAS */}
              {activeTab === 'plan' && (
                <div className="bg-white rounded-3xl p-7 md:p-8 border border-[#E9EAEB] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#181D27]">Tu Plan GymPulse SaaS</h2>
                      <p className="text-xs text-[#535862]">Software contratado por Iron Strength Medellín.</p>
                    </div>
                    <span className="text-xs font-bold text-[#F26522] bg-[#FDF2EC] border border-[#FAD7C5] px-3 py-1 rounded-full uppercase">
                      Plan Pro Activo
                    </span>
                  </div>
                  <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E9EAEB] text-xs text-[#344054] space-y-2">
                    <p>• <strong>Miembros Ilimitados</strong> con análisis de riesgo y semáforo de churn.</p>
                    <p>• <strong>Plantillas de rutinas & Catálogo de ejercicios</strong> completo.</p>
                    <p>• <strong>Reportes automáticos ejecutivos</strong> y soporte prioritario.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* OFFER EDIT/CREATE MODAL */}
      {isOfferModalOpen && editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F4F7]">
              <h3 className="text-base font-black text-[#181D27]">
                {editingOffer.id.startsWith('off-') && offers.some(o => o.id === editingOffer.id) ? 'Editar Oferta' : 'Nueva Oferta Comercial'}
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#535862] uppercase mb-1">Título de la Oferta</label>
                <input
                  type="text"
                  required
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  placeholder="Ej. Plan Semestral Promo"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] text-xs font-bold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#535862] uppercase mb-1">Descripción / Beneficios</label>
                <textarea
                  rows={2}
                  required
                  value={editingOffer.description}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  placeholder="Acceso total + asesoría..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] text-xs text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#535862] uppercase mb-1">Precio</label>
                  <input
                    type="text"
                    required
                    value={editingOffer.price}
                    onChange={(e) => setEditingOffer({ ...editingOffer, price: e.target.value })}
                    placeholder="$120.000 COP"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] text-xs font-bold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#535862] uppercase mb-1">Etiqueta</label>
                  <input
                    type="text"
                    value={editingOffer.badge}
                    onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })}
                    placeholder="Popular / Descuento"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5D7DA] text-xs font-semibold text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#F2F4F7]">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#535862] hover:bg-[#FAF8F5] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181D27] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  Guardar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
