'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import {
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [gymName, setGymName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
      }

      if (!gymName.trim()) {
        throw new Error('Por favor ingresá el nombre de tu gimnasio.');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: 'owner',
            full_name: fullName.trim(),
            gym_name: gymName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Si el email no requiere confirmación y ya hay sesión
      if (data?.session) {
        router.push('/dashboard');
        return;
      }

      // En caso de confirmación de correo requerida
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error al registrar:', err);
      setError(
        err.message ||
          'Ocurrió un error inesperado al crear tu cuenta. Por favor intentá nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex flex-col font-sans selection:bg-[#F26522]/20">
      {/* Header superior */}
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

      {/* Contenido Principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg space-y-6">
          {isSuccess ? (
            /* Pantalla de Confirmación de Email Requerida */
            <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF3] border border-[#ABEFC6] text-[#067647] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522]">
                  PASO FINAL · CONFIRMACIÓN
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#181D27] tracking-tight">
                  Revisá tu correo
                </h2>
                <p className="text-xs text-[#535862] max-w-sm mx-auto leading-relaxed">
                  Enviamos un enlace de confirmación a{' '}
                  <strong className="text-[#181D27]">{email}</strong>. Hacé clic en el botón del correo para activar tu gimnasio <strong className="text-[#181D27]">"{gymName}"</strong> e ingresar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-left text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#181D27]">
                  <Sparkles className="w-4 h-4 text-[#F26522]" />
                  ¿No recibiste el correo?
                </div>
                <ul className="text-[11px] text-[#535862] list-disc list-inside space-y-1">
                  <li>Revisá tu carpeta de Spam o Correo no deseado.</li>
                  <li>Esperá 1-2 minutos para que llegue a tu bandeja.</li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#181D27] text-[#FFFFFF] text-xs font-bold hover:bg-[#2C323E] transition-all shadow-md"
                >
                  Ir al Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Formulario de Registro */
            <>
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F26522]/10 border border-[#F26522]/20 text-[#F26522] text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prueba Gratis de 14 Días
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#181D27] tracking-tight">
                  Creá tu cuenta de Dueño
                </h1>
                <p className="text-xs text-[#535862]">
                  ¿Ya tenés cuenta?{' '}
                  <Link href="/login" className="font-bold text-[#F26522] hover:underline">
                    Iniciá sesión acá
                  </Link>
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#EBE7DF] rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] space-y-5">
                {error && (
                  <div className="p-3.5 rounded-2xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre del Gimnasio */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                      NOMBRE DE TU GIMNASIO / BOX
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={gymName}
                        onChange={(e) => setGymName(e.target.value)}
                        placeholder="Ej. Iron Strength, Spartan Club"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Nombre del Dueño */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                      TU NOMBRE COMPLETO
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Roberto Martínez"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                        CORREO ELECTRÓNICO
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vos@tudominio.com"
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Teléfono / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                        WHATSAPP / TELÉFONO
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+57 300 123 4567"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#EBE7DF] text-xs text-[#181D27] placeholder-[#9CA3AF] focus:bg-[#FFFFFF] focus:border-[#181D27] focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#535862]">
                      CONTRASEÑA
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
                    <p className="text-[10px] text-[#9CA3AF]">
                      Usa al menos 8 caracteres con letras y números.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#F26522] text-[#FFFFFF] text-xs font-bold hover:bg-[#D95314] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(242,101,34,0.25)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Creando gimnasio y cuenta...
                      </>
                    ) : (
                      <>
                        Comenzar 14 días gratis <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[11px] text-center text-[#9CA3AF] leading-relaxed pt-2">
                  Al registrarte, aceptás los{' '}
                  <span className="text-[#535862] underline cursor-pointer">
                    Términos del Servicio
                  </span>{' '}
                  y la{' '}
                  <span className="text-[#535862] underline cursor-pointer">
                    Política de Privacidad
                  </span>
                  .
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
