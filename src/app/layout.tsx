import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/lib/fontawesome';
import './globals.css';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RootState } from '@/lib/redux/store';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
  const initialState: RootState = {
    auth: {
      isAuthenticated: false,
      user: null,
      status: 'idle',
      error: null,
    },
  };

  const messages = await getMessages();

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-zinc-900 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ReduxProvider initialState={initialState}>
              <AuthProvider>{children}</AuthProvider>
            </ReduxProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
