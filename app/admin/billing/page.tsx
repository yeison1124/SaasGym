'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Receipt,
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  Building2,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  starter: 17,
  pro: 48,
  enterprise: 120,
};

export default function SuperAdminBillingPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBilling() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (profileData) setProfile(profileData);
        }

        const { data: gymsData } = await supabase
          .from('gyms')
          .select('*')
          .order('created_at', { ascending: false });
        if (gymsData) setGyms(gymsData);
      } catch (err) {
        console.error('Error loading billing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBilling();
  }, [supabase]);

  const activeGyms = gyms.filter((g) => g.subscription_status === 'active');
  const currentMrr = activeGyms.reduce((acc, g) => {
    const key = (g.plan || 'starter').toLowerCase();
    return acc + (PLAN_PRICES[key] ?? 17);
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <AdminSidebar gymsCount={gyms.length} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              NEGOCIO
            </div>
            <h1 className="text-3xl font-black text-[#181D27]">
              Facturación
            </h1>
            <p className="text-xs text-[#535862]">
              Historial de cobros, suscripciones y liquidaciones de pasarelas.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                MRR FACTURADO (MES ACTUAL)
              </div>
              <div className="text-3xl font-black text-[#181D27]">${currentMrr} USD</div>
              <div className="text-[10px] text-[#16A34A] font-semibold">● {activeGyms.length} suscripciones al día</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                PASARELA PRINCIPAL
              </div>
              <div className="text-3xl font-black text-[#181D27]">Mercado Pago</div>
              <div className="text-[10px] text-[#535862]">Liquidación automática</div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                TASA DE COBRO EXITOSO
              </div>
              <div className="text-3xl font-black text-[#181D27]">100%</div>
              <div className="text-[10px] text-[#16A34A] font-semibold">0 rechazos registrados</div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card overflow-hidden">
            <div className="p-6 border-b border-[#EBE7DF] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#181D27]">Facturas de Gimnasios</h3>
                <p className="text-[11px] text-[#535862]">Detalle de cobros mensuales por cliente</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] border-b border-[#EBE7DF] text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Gimnasio</th>
                    <th className="py-3.5 px-6">Plan</th>
                    <th className="py-3.5 px-6">Monto</th>
                    <th className="py-3.5 px-6">Estado</th>
                    <th className="py-3.5 px-6">Período</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFEA]">
                  {gyms.map((g) => {
                    const planKey = (g.plan || 'starter').toLowerCase();
                    const price = PLAN_PRICES[planKey] ?? 17;
                    const isActive = g.subscription_status === 'active';

                    return (
                      <tr key={g.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-4 px-6 font-bold text-[#181D27]">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#F26522]" />
                            {g.name}
                          </div>
                        </td>
                        <td className="py-4 px-6 uppercase font-bold text-[#535862]">
                          {g.plan || 'starter'}
                        </td>
                        <td className="py-4 px-6 font-extrabold text-[#181D27]">
                          ${price} USD/mes
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              isActive
                                ? 'bg-[#ECFDF5] text-[#16A34A]'
                                : 'bg-[#FFF4ED] text-[#F26522]'
                            }`}
                          >
                            {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {isActive ? 'Pagado' : 'Suspendido'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#535862]">
                          Septiembre 2026
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
