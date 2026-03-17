import { createClient } from '@/lib/supabase/server'; // Import the custom helper
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies.
  // The createClient helper already handles setting cookies on the response via cookieStore.set
  const supabase = await createClient();

  // This refreshes the session and updates the cookies.
  // It's crucial for keeping the session alive and accessible across server and client.
  // The createClient helper implicitly handles setting the cookies on the response for us.
  await supabase.auth.getSession();

  // Now, apply the route protection logic
  const {
    data: { session },
  } = await supabase.auth.getSession(); // Get current session after refresh

    const publicPaths = [
      '/',
      '/login',
      '/register',
      '/recovery',
      '/reset-password',
    ];
  
    const protectedPaths = [
      '/profile',
      '/admin',
      '/super-admin',
      '/instruments', // Added new protected path
    ];
  
    const currentPath = request.nextUrl.pathname;
  
    // If trying to access public auth page while authenticated, redirect to profile
    if (session && publicPaths.includes(currentPath) && (currentPath.startsWith('/login') || currentPath.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  
    // If trying to access protected page while unauthenticated, redirect to login
    if (!session && protectedPaths.includes(currentPath)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

  // If no redirection is needed, proceed with the request, ensuring cookies are set.
  // The createClient helper's cookieStore.set calls will implicitly set cookies on the final response.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
