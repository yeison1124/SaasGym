'use client';

import React, { useState } from 'react';
import { X, Save, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  gymId: string;
  userId: string;
  members: any[];
  onPaymentSaved: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  gymId,
  userId,
  members = [],
  onPaymentSaved,
}: PaymentModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [amount, setAmount] = useState(34);
  const [description, setDescription] = useState('Mensualidad');
  const [method, setMethod] = useState<'card' | 'cash' | 'transfer'>('cash');
  const [status, setStatus] = useState<'paid' | 'pending'>('paid');
  const [periodMonths, setPeriodMonths] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + Number(periodMonths));

      const { error: insertErr } = await supabase.from('payments').insert({
        gym_id: gymId,
        member_id: memberId,
        amount: Number(amount),
        currency: 'USD',
        method,
        status,
        paid_at: status === 'paid' ? now.toISOString() : null,
        period_start: now.toISOString(),
        period_end: periodEnd.toISOString(),
        created_by: userId,
      });

      if (insertErr) throw insertErr;

      // Update member status and expiry if paid
      if (status === 'paid') {
        await supabase
          .from('members')
          .update({
            status: 'active',
            membership_expires_at: periodEnd.toISOString(),
            risk_score: 5,
            risk_band: 'saludable',
          })
          .eq('id', memberId);
      }

      onPaymentSaved();
      onClose();
    } catch (err: any) {
      console.error('Error recording payment:', err);
      setError(err.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181D27]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-2xl overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-[#EBE7DF] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26522]">
              Caja & Pagos
            </div>
            <h2 className="text-xl font-black text-[#181D27]">Registrar Cobro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EBE7DF] text-[#535862] hover:text-[#181D27] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEE4E2] border border-[#FECDCA] text-[#D92D20] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
              Seleccionar Miembro
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-bold text-[#181D27] focus:outline-none focus:border-[#181D27]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Monto (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-[#181D27]">$</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-sm font-black text-[#181D27] focus:outline-none focus:border-[#181D27]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Método de Pago
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="card">Tarjeta</option>
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Concepto
              </label>
              <input
                type="text"
                placeholder="Ej. Mensualidad junio"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] focus:outline-none focus:border-[#181D27]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#535862]">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs font-semibold text-[#181D27] focus:outline-none focus:border-[#181D27]"
              >
                <option value="paid">Confirmado / Pagado</option>
                <option value="pending">Pendiente de cobro</option>
              </select>
            </div>
          </div>

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
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
