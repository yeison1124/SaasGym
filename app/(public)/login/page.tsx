'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirectTo');
  const errorParam = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (
          signInError.message.toLowerCase().includes('email not confirmed') ||
          signInError.message.toLowerCase().includes('unconfirmed')
        ) {
          throw new Error(
            'Tu correo no ha sido confirmado aún. Por favor revisá tu bandeja de entrada o spam y hacé clic en el enlace de activación.'
          );
        } else if (
          signInError.message.toLowerCase().includes('invalid login credentials') ||
          signInError.message.toLowerCase().includes('invalid credentials')
        ) {
          throw new Error('Email o contraseña incorrectos. Por favor verificá tus datos.');
        } else {
          throw signInError;
        }
      }

      if (data?.user) {
        // Consultar el rol del usuario en profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || 'member';

        if (redirectTo) {
          router.push(redirectTo);
        } else if (role === 'superadmin') {
          router.push('/admin');
        } else if (role === 'member') {
          router.push('/member');
        } else {
          // owner o trainer
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          BIENVENIDO DE VUELTA
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#181D27] tracking-tight">
          Iniciá sesión
        </h1>
        <p className="text-xs text-[#535862]">
          ¿Sos dueño y querés registrarte?{' '}
          <Link href="/register" className="font-bold text-[#F26522] hover:underline">
            Creá tu gimnasio gratis
          </Link>
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-5">
        {errorParam && !error && (
          <div className="p-3.5 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Hubo un problema verificando tu sesión. Por favor ingresá tus credenciales.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
              EMAIL
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                CONTRASEÑA
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] font-semibold text-[#535862] hover:text-[#F26522] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#181D27] text-[#FFFFFF] text-xs font-bold hover:bg-[#2C323E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando credenciales...
              </>
            ) : (
              <>
                Entrar a mi panel <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-[#535862]">
            ¿Sos un alumno o entrenador? <br />
            <span className="text-[11px] text-[#9CA3AF]">
              Ingresá con el email y contraseña que te asignó tu gimnasio.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex flex-col font-sans selection:bg-[#F26522]/20">
      {/* Top Bar */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#535862] hover:text-[#181D27] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </Link>
      </header>

      {/* Main Centered Login Box */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20 text-[#535862]">
            <Loader2 className="w-8 h-8 animate-spin text-[#F26522]" />
          </div>
        }>
          <LoginFormContent />
        </Suspense>
      </main>
    </div>
  );
}
