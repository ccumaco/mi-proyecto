'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('landing.hero');

  return (
    <section className="dark:bg-navy relative overflow-hidden bg-white pt-32 pb-24 md:pt-48 md:pb-40">
      {/* Background decoration */}
      <div
        className="absolute inset-0 z-0 opacity-20 dark:opacity-10"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 blur-[120px]">
          <div className="bg-emerald-green aspect-[1155/678] w-[72rem] opacity-40"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="mb-6 flex">
            <span className="text-emerald-green text-sm font-bold tracking-widest uppercase">
              {t('badge')}
            </span>
          </div>
          <h1 className="text-navy mb-6 text-5xl leading-[1.1] font-black tracking-tighter md:text-7xl dark:text-white">
            {t('title')
              .split(' ')
              .map((word, i) =>
                i === 4 ? (
                  <span key={i} className="text-emerald-green">
                    {' '}
                    {word}{' '}
                  </span>
                ) : (
                  ` ${word} `
                )
              )}
          </h1>
          <p className="text-slate-gray mb-10 max-w-lg text-lg leading-relaxed md:text-xl dark:text-slate-400">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-emerald-green rounded-xl px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:opacity-90 active:scale-95"
            >
              {t('watchDemoButton')}
            </Link>
          </div>
        </motion.div>

        {/* Hero Mockup Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-emerald-green/10 absolute -inset-4 rounded-full blur-[100px]"></div>
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/40"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400/40"></div>
                <div className="bg-navy/40 h-3 w-3 rounded-full dark:bg-slate-400/40"></div>
              </div>
              <div className="h-2 w-32 rounded-full bg-slate-100 dark:bg-white/5"></div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="flex h-32 flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                <span className="text-slate-gray text-xs font-medium tracking-wider uppercase dark:text-slate-400">
                  Recaudo Mensual
                </span>
                <span className="text-emerald-green text-2xl font-black tracking-tight">
                  $84,200
                </span>
              </div>
              <div className="flex h-32 flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                <span className="text-slate-gray text-xs font-medium tracking-wider uppercase dark:text-slate-400">
                  Ocupación
                </span>
                <span className="text-navy text-2xl font-black tracking-tight dark:text-white">
                  98.4%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex h-12 items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 dark:border-white/5 dark:bg-white/5">
                <div className="bg-emerald-green/20 flex h-8 w-8 items-center justify-center rounded-full">
                  <div className="bg-emerald-green h-3 w-3 rounded-full"></div>
                </div>
                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-white/10"></div>
                <div className="bg-emerald-green/40 h-2 w-12 rounded-full"></div>
              </div>
              <div className="flex h-12 items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-4 dark:border-white/5 dark:bg-white/5">
                <div className="bg-navy/10 flex h-8 w-8 items-center justify-center rounded-full dark:bg-white/10">
                  <div className="bg-navy h-3 w-3 rounded-full dark:bg-white/40"></div>
                </div>
                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-white/5"></div>
                <div className="bg-navy/20 h-2 w-12 rounded-full dark:bg-white/20"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
