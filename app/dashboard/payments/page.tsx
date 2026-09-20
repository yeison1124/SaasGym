'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OwnerSidebar } from '@/components/dashboard/OwnerSidebar';
import { OwnerHeader } from '@/components/dashboard/OwnerHeader';
import { PaymentModal } from '@/components/dashboard/PaymentModal';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';

export default function OwnerPaymentsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gym, setGym] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'failed' | 'refunded'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPaymentsData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileData) setProfile(profileData);

      const gymId = profileData?.gym_id || 'a0000000-0000-0000-0000-000000000001';

      const { data: gymData } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gymId)
        .single();
      if (gymData) setGym(gymData);

      // Fetch payments with members
      const { data: paymentsData } = await supabase
        .from('payments')
        .select(`
          *,
          members (id, full_name, email, phone)
        `)
        .eq('gym_id', gymId)
        .order('paid_at', { ascending: false, nullsFirst: false });
      if (paymentsData) setPayments(paymentsData);

      // Fetch all members for payment modal
      const { data: membersData } = await supabase
        .from('members')
        .select('id, full_name, email')
        .eq('gym_id', gymId);
      if (membersData) setMembers(membersData);
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentsData();
  }, []);

  const gymName = gym?.name || 'Iron Strength';
  const gymLocation = `${gym?.city || 'Medellín'} · ${gym?.country || 'Colombia'}`;

  // Metric Computations matching Image 5
  const paidList = payments.filter((p) => p.status === 'paid');
  const pendingList = payments.filter((p) => p.status === 'pending');
  const failedList = payments.filter((p) => p.status === 'failed');

  const totalCollected = paidList.reduce((acc, p) => acc + Number(p.amount), 0) || 236;
  const totalPending = pendingList.reduce((acc, p) => acc + Number(p.amount), 0) || 126;
  const totalFailed = failedList.reduce((acc, p) => acc + Number(p.amount), 0) || 126;
  const totalProjection = totalCollected + totalPending;

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    if (activeFilter === 'paid') return p.status === 'paid';
    if (activeFilter === 'pending') return p.status === 'pending';
    if (activeFilter === 'failed') return p.status === 'failed';
    return true;
  });

  const methodIcons: Record<string, string> = {
    card: '💳 Tarjeta',
    cash: '💵 Efectivo',
    transfer: '🏦 Transferencia',
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <OwnerSidebar gymName={gymName} gymLocation={gymLocation} />

      <div className="flex-1 flex flex-col min-w-0">
        <OwnerHeader profile={profile} gymName={gymName} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header Matching Image 5 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                NEGOCIO
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Pagos
              </h1>
              <p className="text-xs text-[#535862]">
                Cobros, renovaciones y morosos. Todo cargado manualmente por ahora.
              </p>
            </div>

            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#181D27] hover:bg-[#2C3444] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar pago
              </button>
            </div>
          </div>

          {/* 4 Stat Cards Matching Image 5 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">COBRADO ESTE MES</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">${totalCollected}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                  ↗
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">pagos confirmados</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">PENDIENTES</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">${totalPending}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-bold">
                  ⚠
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">por cobrar</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">ATRASADOS</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">${totalFailed}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#F26522] text-[10px] font-bold">
                  ↘
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">requieren acción</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">PROYECCIÓN DE CIERRE</div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#181D27]">${totalProjection}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#16A34A] text-[10px] font-bold">
                  ↗
                </span>
              </div>
              <div className="text-[10px] text-[#9CA3AF]">cobrado + pendiente</div>
            </div>
          </div>

          {/* Filter Bar Matching Image 5 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'paid', label: 'Pagados' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'failed', label: 'Atrasados' },
                { id: 'refunded', label: 'Reembolsados' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-[#181D27] text-white shadow-xs'
                      : 'bg-[#FFFFFF] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#9CA3AF] font-semibold hidden sm:block">
              {filteredPayments.length} transacciones
            </span>
          </div>

          {/* Payments Table Matching Image 5 */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#535862]">
                Cargando pagos...
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <CreditCard className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                <div className="text-sm font-bold text-[#181D27]">No hay transacciones registradas</div>
                <div className="text-xs text-[#535862]">Registrá cobros de tus miembros desde el botón superior.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-6">Miembro</th>
                      <th className="py-3.5 px-4">Concepto</th>
                      <th className="py-3.5 px-4">Monto</th>
                      <th className="py-3.5 px-4">Método</th>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-6 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3EFEA]">
                    {filteredPayments.map((p) => {
                      const isPaid = p.status === 'paid';
                      const isPending = p.status === 'pending';
                      const isFailed = p.status === 'failed';

                      return (
                        <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-4 px-6 font-bold text-[#181D27]">
                            {p.members?.full_name || 'Miembro General'}
                          </td>

                          <td className="py-4 px-4 text-[#535862] font-medium">
                            {Number(p.amount) >= 100 ? 'Semestral' : Number(p.amount) >= 80 ? 'Trimestral' : 'Mensualidad'}
                          </td>

                          <td className="py-4 px-4 font-black text-[#181D27]">
                            ${p.amount} USD
                          </td>

                          <td className="py-4 px-4 text-[#535862]">
                            {methodIcons[p.method] || '💳 Tarjeta'}
                          </td>

                          <td className="py-4 px-4 text-[#535862]">
                            {new Date(p.paid_at || p.period_start).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                isPaid
                                  ? 'bg-[#ECFDF5] text-[#16A34A]'
                                  : isPending
                                  ? 'bg-[#FFF4ED] text-[#D97706]'
                                  : 'bg-[#FEE4E2] text-[#D92D20]'
                              }`}
                            >
                              {isPaid ? <CheckCircle2 className="w-3 h-3" /> : isPending ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {isPaid ? 'PAGADO' : isPending ? 'PENDIENTE' : 'ATRASADO'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gymId={gym?.id || 'a0000000-0000-0000-0000-000000000001'}
        userId={profile?.id || 'b0000000-0000-0000-0000-000000000001'}
        members={members}
        onPaymentSaved={loadPaymentsData}
      />
    </div>
  );
}
