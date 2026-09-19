'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setIsSent(true);
    } catch (err: any) {
      console.error('Error al solicitar reseteo:', err);
      setError(err.message || 'No pudimos procesar tu solicitud. Verificá tu correo.');
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
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#535862] hover:text-[#181D27] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al login
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6">
          {isSent ? (
            <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522]">
                  CORREO ENVIADO
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#181D27] tracking-tight">
                  Revisá tu bandeja
                </h2>
                <p className="text-xs text-[#535862] max-w-sm mx-auto leading-relaxed">
                  Te enviamos las instrucciones para restablecer tu contraseña a{' '}
                  <strong className="text-[#181D27]">{email}</strong>.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#181D27] text-[#FFFFFF] text-xs font-bold hover:bg-[#2C323E] transition-all shadow-md"
                >
                  Volver a iniciar sesión
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-[#F26522]/10 border border-[#F26522]/20 text-[#F26522] flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#181D27] tracking-tight">
                  Recuperar contraseña
                </h1>
                <p className="text-xs text-[#535862]">
                  Ingresá tu correo y te enviaremos un enlace de recuperación.
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
                      EMAIL REGISTRADO
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vos@ejemplo.com"
                        required
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
                        <Loader2 className="w-4 h-4 animate-spin" /> Enviando enlace...
                      </>
                    ) : (
                      <>
                        Enviar enlace de recuperación <ArrowRight className="w-4 h-4" />
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
