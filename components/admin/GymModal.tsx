'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Building2, MapPin, Phone, CreditCard, Loader2, Sparkles, CheckCircle2, User, Camera } from 'lucide-react';

interface GymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gymToEdit?: any | null;
}

export function GymModal({ isOpen, onClose, onSuccess, gymToEdit }: GymModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [plan, setPlan] = useState<'free' | 'starter' | 'pro' | 'enterprise'>('pro');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'trialing' | 'canceled'>('active');
  const [city, setCity] = useState('Medellín');
  const [country, setCountry] = useState('CO');
  const [address, setAddress] = useState('Sede Principal');
  const [phone, setPhone] = useState('+57 300 000 0000');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gymToEdit) {
      setName(gymToEdit.name || '');
      setPlan(gymToEdit.plan || 'pro');
      setSubscriptionStatus(gymToEdit.subscription_status || 'active');
      setCity(gymToEdit.city || 'Medellín');
      setCountry(gymToEdit.country || 'CO');
      setAddress(gymToEdit.address || '');
      setPhone(gymToEdit.phone || '');
      setLogoUrl(gymToEdit.logo_url || null);
    } else {
      setName('');
      setOwnerName('');
      setOwnerEmail('');
      setPlan('pro');
      setSubscriptionStatus('active');
      setCity('Medellín');
      setCountry('CO');
      setAddress('Sede Poblado');
      setPhone('+57 300 123 4567');
      setLogoUrl(null);
    }
    setError(null);
  }, [gymToEdit, isOpen]);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setLogoUrl(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error('El nombre del gimnasio es obligatorio.');
      }

      if (gymToEdit) {
        // Edit existing gym
        const { error: updateError } = await supabase
          .from('gyms')
          .update({
            name: name.trim(),
            plan,
            subscription_status: subscriptionStatus,
            city: city.trim(),
            country: country.trim(),
            address: address.trim(),
            phone: phone.trim(),
          })
          .eq('id', gymToEdit.id);

        if (updateError) throw updateError;
      } else {
        // Create new gym
        const slug =
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') +
          '-' +
          Math.random().toString(36).substring(2, 7);

        const { data: newGym, error: insertError } = await supabase
          .from('gyms')
          .insert({
            name: name.trim(),
            slug,
            plan,
            subscription_status: subscriptionStatus,
            city: city.trim() || 'Medellín',
            country: country.trim() || 'CO',
            address: address.trim() || 'Sede Principal',
            phone: phone.trim(),
            trial_ends_at: subscriptionStatus === 'trialing' ? new Date(Date.now() + 14 * 86400000).toISOString() : null,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;

        // Auto-provision Owner account in Supabase Auth if provided
        if (ownerEmail.trim()) {
          try {
            const { data: authData, error: authErr } = await supabase.auth.signUp({
              email: ownerEmail.trim().toLowerCase(),
              password: 'Password123!',
              options: {
                data: {
                  full_name: ownerName.trim() || `Dueño ${name.trim()}`,
                  role: 'owner',
                  gym_id: newGym.id,
                },
              },
            });

            if (!authErr && authData?.user) {
              await supabase.from('profiles').upsert({
                id: authData.user.id,
                gym_id: newGym.id,
                full_name: ownerName.trim() || `Dueño ${name.trim()}`,
                email: ownerEmail.trim().toLowerCase(),
                phone: phone.trim() || null,
                role: 'owner',
                is_active: true,
              });
            }
          } catch (authExc) {
            console.warn('Owner auth provisioning warning:', authExc);
          }
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al guardar gimnasio:', err);
      setError(err.message || 'Ocurrió un error al guardar el gimnasio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#EBE7DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#181D27]">
                {gymToEdit ? 'Editar Gimnasio' : 'Alta de Nuevo Gimnasio (Tenant)'}
              </h3>
              <p className="text-xs text-[#535862]">
                {gymToEdit ? 'Modificá la configuración del gimnasio' : 'Crea el tenant y aprovisiona la cuenta del dueño'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#9CA3AF] hover:text-[#181D27] hover:bg-[#EBE7DF]/50 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] text-xs">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
              Nombre del Gimnasio *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Iron Strength, Titan Crossfit"
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all font-bold"
            />
          </div>

          {/* Owner auto-provisioning if creating */}
          {!gymToEdit && (
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EBE7DF] space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#F26522]" />
                <h4 className="text-xs font-bold text-[#181D27]">Cuenta del Dueño (Owner Principal)</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#717680] block mb-1">Nombre Dueño</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Roberto Martínez"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#717680] block mb-1">Email Dueño</label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="roberto@gimnasio.co"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#717680]">Se creará con contraseña provisional <code className="font-bold text-[#181D27]">Password123!</code></p>
            </div>
          )}

          {/* Plan & Estado Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                Plan Asignado
              </label>
              <select
                value={plan}
                onChange={(e: any) => setPlan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all font-semibold"
              >
                <option value="free">Free ($0/mes)</option>
                <option value="starter">Starter ($29/mes)</option>
                <option value="pro">Pro ($59/mes)</option>
                <option value="enterprise">Enterprise ($149/mes)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                Estado Suscripción
              </label>
              <select
                value={subscriptionStatus}
                onChange={(e: any) => setSubscriptionStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all font-semibold"
              >
                <option value="active">Activo (Facturando)</option>
                <option value="trialing">Onboarding / Trial 14d</option>
                <option value="canceled">Cancelado / Churned</option>
              </select>
            </div>
          </div>

          {/* País & Ciudad */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                País
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
              >
                <option value="CO">🇨🇴 Colombia</option>
                <option value="MX">🇲🇽 México</option>
                <option value="AR">🇦🇷 Argentina</option>
                <option value="CL">🇨🇱 Chile</option>
                <option value="PE">🇵🇪 Perú</option>
                <option value="EC">🇪🇨 Ecuador</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                Ciudad
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej. Medellín, Bogotá"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Dirección & Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                Dirección
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle 10 # 43E"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 000 0000"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-semibold text-[#535862] border border-[#EBE7DF] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-2xl bg-[#181D27] hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> {gymToEdit ? 'Guardar Cambios' : 'Crear Gimnasio & Owner'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
