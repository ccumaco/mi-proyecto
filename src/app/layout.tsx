import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/lib/fontawesome';
import './globals.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { createClient } from '@/lib/supabase/server'; // Import the custom helper
import { RootState } from '@/lib/redux/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PropManagement - Dashboard Residencial',
  description: 'Gestión moderna y eficiente de comunidades',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the custom createClient helper for server components
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const initialState: RootState = {
    auth: {
      isAuthenticated: !!session,
      user: session?.user || null,
      status: 'idle',
      error: null,
    },
    // Initialize other slices if you have them
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <ReduxProvider initialState={initialState}>
            <AuthProvider>{children}</AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
