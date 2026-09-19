import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rutas públicas que no deben ser accesibles si ya está autenticado
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Rutas protegidas por rol
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isMemberAppRoute = pathname.startsWith('/app');

  // Si no está logueado e intenta acceder a ruta protegida
  if (!user && (isAdminRoute || isDashboardRoute || isMemberAppRoute)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si está logueado, consultar su rol para control de acceso y redirección
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'member';

    // Si ya está autenticado e intenta ir a login/register, redirigir a su panel
    if (isAuthRoute && pathname !== '/reset-password') {
      if (role === 'superadmin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else if (role === 'member') {
        return NextResponse.redirect(new URL('/app', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Control de acceso entre roles:
    if (isAdminRoute && role !== 'superadmin') {
      return NextResponse.redirect(new URL(role === 'member' ? '/app' : '/dashboard', request.url));
    }

    if (isDashboardRoute && role !== 'owner' && role !== 'trainer') {
      return NextResponse.redirect(new URL(role === 'superadmin' ? '/admin' : '/app', request.url));
    }

    if (isMemberAppRoute && role !== 'member') {
      return NextResponse.redirect(new URL(role === 'superadmin' ? '/admin' : '/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
