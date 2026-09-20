'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PlanEditModal } from '@/components/admin/PlanEditModal';
import {
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Edit2,
  Check,
} from 'lucide-react';

export default function SuperAdminPlansPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [gyms, setGyms] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<any | null>(null);

  const loadPlansData = async () => {
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

      // Fetch dynamic platform_plans
      const { data: plansData, error: plansError } = await supabase
        .from('platform_plans')
        .select('*')
        .order('order_index', { ascending: true });

      if (plansData && plansData.length > 0) {
        setPlans(plansData);
      }

      // Fetch all gyms to compute active clients per plan
      const { data: gymsData } = await supabase
        .from('gyms')
        .select('*')
        .order('created_at', { ascending: true });
      if (gymsData) setGyms(gymsData);
    } catch (err) {
      console.error('Error loading plans data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlansData();
  }, []);

  const handleEditPlan = (plan: any) => {
    setPlanToEdit(plan);
    setIsModalOpen(true);
  };

  // Counts & calculations
  const totalGyms = gyms.length;
  const activeGyms = gyms.filter((g) => g.subscription_status === 'active');

  // Compute stats per plan dynamically
  const planPricesMap: Record<string, number> = {};
  plans.forEach((p) => {
    planPricesMap[p.id] = Number(p.price) || 0;
  });

  const totalMrr = activeGyms.reduce((acc, g) => {
    const key = (g.plan || 'starter').toLowerCase();
    return acc + (planPricesMap[key] ?? 17);
  }, 0);

  // Determine top plan
  let topPlanName = 'Enterprise';
  let topPlanMrr = 0;

  plans.forEach((p) => {
    const clientsCount = activeGyms.filter((g) => (g.plan || '').toLowerCase() === p.id).length;
    const planTotal = clientsCount * Number(p.price);
    if (planTotal >= topPlanMrr) {
      topPlanMrr = planTotal;
      topPlanName = p.name;
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <AdminSidebar gymsCount={totalGyms} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader profile={profile} />

        <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                NEGOCIO
              </div>
              <h1 className="text-3xl font-black text-[#181D27]">
                Planes
              </h1>
              <p className="text-xs text-[#535862]">
                Catálogo de planes ofrecidos a los gimnasios. Editá los precios en tiempo real para impactar la landing page.
              </p>
            </div>
          </div>

          {/* Top 3 KPI Cards Matching Image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#181D27] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  CLIENTES TOTALES
                </div>
                <div className="text-2xl font-black text-[#181D27]">{activeGyms.length}</div>
                <div className="text-[10px] text-[#535862]">repartidos en {plans.length} planes</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-[#F26522] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  MRR POR PLANES
                </div>
                <div className="text-2xl font-black text-[#181D27]">${totalMrr} USD</div>
                <div className="text-[10px] text-[#535862]">suscripciones activas</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EBE7DF] shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF4ED] text-[#F26522] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  PLAN ESTRELLA
                </div>
                <div className="text-2xl font-black text-[#181D27]">{topPlanName}</div>
                <div className="text-[10px] text-[#535862]">${topPlanMrr} de MRR</div>
              </div>
            </div>
          </div>

          {/* Dynamic Plan Cards in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {plans.map((p) => {
              const clientsCount = activeGyms.filter(
                (g) => (g.plan || '').toLowerCase() === p.id
              ).length;
              const planMrr = clientsCount * Number(p.price);
              const features = Array.isArray(p.features) ? p.features : [];
              const isEnterprise = p.id === 'enterprise';
              const isStarter = p.id === 'starter';

              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-3xl bg-[#FFFFFF] shadow-card flex flex-col justify-between space-y-6 relative transition-all ${
                    p.is_popular
                      ? 'border-2 border-[#F26522]'
                      : 'border border-[#EBE7DF]'
                  }`}
                >
                  {p.badge && (
                    <div
                      className={`absolute -top-3 right-5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-xs ${
                        isEnterprise
                          ? 'bg-[#181D27] text-white'
                          : 'bg-[#F26522] text-white'
                      }`}
                    >
                      {p.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          isEnterprise
                            ? 'bg-[#181D27] text-white'
                            : isStarter
                            ? 'bg-[#FFF4ED] text-[#F26522]'
                            : 'bg-[#F3EFEA] text-[#535862]'
                        }`}
                      >
                        {p.name}
                      </div>

                      <button
                        onClick={() => handleEditPlan(p)}
                        className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#535862] hover:text-[#181D27] border border-[#EBE7DF] transition-all cursor-pointer"
                        title="Editar precio y opciones de este plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#181D27]">
                          ${Number(p.price)}
                        </span>
                        <span className="text-xs text-[#535862] font-semibold">
                          /{p.billing_period || 'monthly'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#535862] mt-1.5 leading-relaxed min-h-[32px]">
                        {p.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-[#F3EFEA] text-xs">
                      {features.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2 text-[#535862]">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="pt-4 border-t border-[#EBE7DF] flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[9px] font-bold text-[#9CA3AF] uppercase">CLIENTES</div>
                        <div className="font-extrabold text-[#181D27] text-sm">{clientsCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-bold text-[#9CA3AF] uppercase">MRR</div>
                        <div className="font-extrabold text-[#181D27] text-sm">${planMrr}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEditPlan(p)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#181D27] border border-[#EBE7DF] transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-[#F26522]" />
                      Editar Precio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      <PlanEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={planToEdit}
        onPlanSaved={loadPlansData}
      />
    </div>
  );
}
