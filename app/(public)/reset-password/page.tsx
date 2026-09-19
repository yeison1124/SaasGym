'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error al actualizar contraseña:', err);
      setError(err.message || 'No pudimos actualizar tu contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex flex-col font-sans selection:bg-[#F26522]/20">
      {/* Top Bar */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6">
          {isSuccess ? (
            <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[#181D27] tracking-tight">
                  ¡Contraseña actualizada!
                </h2>
                <p className="text-xs text-[#535862] max-w-sm mx-auto leading-relaxed">
                  Tu contraseña fue cambiada exitosamente. Te estamos redirigiendo a tu panel...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <h1 className="text-3xl sm:text-4xl font-black text-[#181D27] tracking-tight">
                  Nueva contraseña
                </h1>
                <p className="text-xs text-[#535862]">
                  Ingresá tu nueva clave para acceder a GetGym.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-5">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                      NUEVA CONTRASEÑA
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9CA3AF] hover:text-[#181D27]"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                      CONFIRMAR CONTRASEÑA
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repetí tu nueva contraseña"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#181D27] text-[#FFFFFF] text-xs font-bold hover:bg-[#2C323E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Guardando nueva clave...
                      </>
                    ) : (
                      <>
                        Guardar contraseña y entrar <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
