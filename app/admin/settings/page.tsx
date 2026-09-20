'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Settings,
  Users,
  Palette,
  Key,
  Plug,
  Mail,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'branding' | 'auth' | 'integrations' | 'email' | 'notifications'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: 'GymPulse SAS',
    taxId: '901.452.881-3',
    corporateEmail: 'hola@gympulse.app',
    supportEmail: 'soporte@gympulse.app',
    fiscalAddress: 'Cra 11 # 82-01, Of. 402, Bogotá, Colombia',
    baseCurrency: 'USD',
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) setProfile(profileData);
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'team', label: 'Equipo interno', icon: Users },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'auth', label: 'Autenticación', icon: Key },
    { id: 'integrations', label: 'Integraciones', icon: Plug },
    { id: 'email', label: 'Plantillas de email', icon: Mail },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              PLATAFORMA
            </div>
            <h1 className="text-3xl font-black text-[#181D27]">
              Configuración de la plataforma
            </h1>
            <p className="text-xs text-[#535862]">
              Equipo interno, branding, integraciones y plantillas globales.
            </p>
          </div>

          {/* Main 2-Column Grid Matching Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Nav Menu */}
            <div className="md:col-span-4 p-3 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#F3EFEA] text-[#181D27] font-bold shadow-2xs'
                        : 'text-[#535862] hover:text-[#181D27] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F26522]' : 'text-[#9CA3AF]'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right Tab Content */}
            <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-6">
              {activeTab === 'general' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">
                      Datos generales
                    </h2>
                    <p className="text-xs text-[#535862]">
                      Información corporativa que aparece en facturas y emails.
                    </p>
                  </div>

                  {savedSuccess && (
                    <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
                      Configuración general guardada exitosamente.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        RAZÓN SOCIAL
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        NIT / CUIT
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. 901.452.881-3"
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        EMAIL CORPORATIVO
                      </label>
                      <input
                        type="email"
                        value={formData.corporateEmail}
                        onChange={(e) => setFormData({ ...formData, corporateEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        SOPORTE
                      </label>
                      <input
                        type="email"
                        value={formData.supportEmail}
                        onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        DIRECCIÓN FISCAL
                      </label>
                      <input
                        type="text"
                        placeholder="Dirección legal"
                        value={formData.fiscalAddress}
                        onChange={(e) => setFormData({ ...formData, fiscalAddress: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                        MONEDA BASE
                      </label>
                      <input
                        type="text"
                        value={formData.baseCurrency}
                        onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Informative Note Matching Image 2 */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#535862] text-[11px] leading-relaxed">
                    Estos datos configuran la identidad global de <strong>GymPulse</strong>. En futuras actualizaciones vas a poder persistirlos en la tabla <code className="px-1 py-0.5 rounded bg-[#F3EFEA] font-mono text-[10px]">platform_settings</code>.
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'team' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Equipo interno</h2>
                    <p className="text-xs text-[#535862]">Administradores y operadores globales de GymPulse.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#181D27] text-white flex items-center justify-center font-bold text-xs">
                        YC
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#181D27]">Yeison Carreño</div>
                        <div className="text-[11px] text-[#535862]">yeison@gympulse.app · SuperAdmin Principal</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                      Propietario
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Branding</h2>
                    <p className="text-xs text-[#535862]">Logotipos, paleta de colores y temas de la plataforma.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-3">
                    <div className="text-xs font-bold text-[#181D27]">Isotipo e Isologo</div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#181D27] text-white flex items-center justify-center font-bold">
                        ⚡
                      </div>
                      <div className="text-xs font-extrabold text-[#181D27]">GymPulse</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'auth' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Autenticación</h2>
                    <p className="text-xs text-[#535862]">Políticas de seguridad, Supabase Auth y RLS.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs space-y-1">
                    <div className="font-bold">✓ Supabase Auth Activo</div>
                    <div>Confirmación de email obligatoria y RLS multi-tenant habilitados.</div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Integraciones</h2>
                    <p className="text-xs text-[#535862]">Conexión con pasarelas de pago y proveedores de mensajería.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                      <div className="text-xs font-bold text-[#181D27]">Mercado Pago</div>
                      <div className="text-[10px] text-[#16A34A] font-semibold">● Conectado (LATAM)</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] space-y-1">
                      <div className="text-xs font-bold text-[#181D27]">WhatsApp Cloud API</div>
                      <div className="text-[10px] text-[#F26522] font-semibold">● Modo Sandbox</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Plantillas de Email</h2>
                    <p className="text-xs text-[#535862]">Emails transaccionales de bienvenida, recuperación y retención.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#535862]">
                    Plantillas HTML dinámicas configuradas con Supabase SMTP y Resend.
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-[#181D27]">Notificaciones</h2>
                    <p className="text-xs text-[#535862]">Alertas automáticas para el equipo SuperAdmin.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#535862]">
                    Notificaciones activas para nuevos registros de gimnasios y reportes de churn.
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
