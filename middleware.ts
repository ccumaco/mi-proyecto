import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/recovery', '/reset-password'];

const protectedPaths = ['/profile', '/admin', '/super-admin'];

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const isPublic = publicPaths.some((p) => currentPath === p || currentPath.startsWith(p + '/'));
  const isProtected = protectedPaths.some((p) => currentPath === p || currentPath.startsWith(p + '/'));

  // La protección real de rutas la manejan los layouts con Redux + JWT.
  // El middleware solo deja pasar — sin dependencia de Supabase.
  if (!isPublic && !isProtected) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
