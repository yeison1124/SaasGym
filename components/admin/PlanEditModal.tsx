'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Sparkles, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onPlanSaved: () => void;
}

export function PlanEditModal({ isOpen, onClose, plan, onPlanSaved }: PlanEditModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    billing_period: 'monthly',
    description: '',
    badge: '',
    is_popular: false,
    featuresText: '',
  });

  useEffect(() => {
    if (plan) {
      const features = Array.isArray(plan.features) ? plan.features : [];
      setFormData({
        name: plan.name || '',
        price: Number(plan.price) || 0,
        billing_period: plan.billing_period || 'monthly',
        description: plan.description || '',
        badge: plan.badge || '',
        is_popular: Boolean(plan.is_popular),
        featuresText: features.join('\n'),
      });
      setError(null);
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const featuresArray = formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const { error: updateError } = await supabase
        .from('platform_plans')
        .update({
          name: formData.name,
          price: Number(formData.price),
          billing_period: formData.billing_period,
          description: formData.description,
          badge: formData.badge.trim() ? formData.badge.trim() : null,
          is_popular: formData.is_popular,
          features: featuresArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', plan.id);

      if (updateError) throw updateError;

      onPlanSaved();
      onClose();
    } catch (err: any) {
      console.error('Error updating plan:', err);
      setError(err.message || 'Error al guardar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181D27]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
              Configuración de Planes
            </div>
            <h2 className="text-xl font-black text-[#181D27]">
              Editar Plan {formData.name || plan.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] text-[#D92D20] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Nombre del Plan
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Precio Mensual (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-[#181D27]">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-sm font-black text-[#181D27] focus:outline-none focus:border-[#181D27]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Descripción Corta
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Para quién está pensado este plan"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Badge / Etiqueta Destacada
              </label>
              <input
                type="text"
                placeholder="Ej. MÁS POPULAR"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F26522] focus:ring-[#F26522] border-[#EBE7DF] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#181D27]">Borde Destacado (Popular)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Características (Una por línea)
            </label>
            <textarea
              rows={4}
              value={formData.featuresText}
              onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              placeholder="Hasta 150 miembros activos&#10;Score de riesgo automático&#10;..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27] resize-none"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Al guardar, el nuevo precio se reflejará instantáneamente en la <strong>Landing Page principal</strong> y en los cálculos de ingresos.</span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#EBE7DF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#535862] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Guardando...' : 'Guardar Precio y Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
