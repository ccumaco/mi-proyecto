import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
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
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  if (
    session &&
    (pathname === '/auth/login' || pathname === '/auth/register')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    !session &&
    (pathname.startsWith('/profile') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/super-admin'))
  ) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (
      pathname.startsWith('/admin') &&
      profile?.role !== 'admin' &&
      profile?.role !== 'superAdmin'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname.startsWith('/super-admin') && profile?.role !== 'superAdmin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/auth/login',
    '/auth/register',
    '/profile/:path*',
    '/admin/:path*',
    '/super-admin/:path*',
  ],
};
