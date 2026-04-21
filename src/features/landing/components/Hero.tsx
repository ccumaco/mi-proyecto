'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden bg-white dark:bg-navy">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 blur-[120px]">
          <div className="aspect-[1155/678] w-[72rem] bg-emerald-green opacity-40"></div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="mb-6 flex">
            <span className="text-emerald-green font-bold tracking-widest text-sm uppercase">
              {t('badge')}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-navy dark:text-white leading-[1.1] tracking-tighter mb-6">
            {t('title').split(' ').map((word, i) => (
              i === 4 ? <span key={i} className="text-emerald-green"> {word} </span> : ` ${word} `
            ))}
          </h1>
          <p className="text-lg md:text-xl text-slate-gray dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-emerald-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              {t('requestInfoButton')}
            </Link>
            <Link
              href="#services"
              className="bg-slate-100 dark:bg-white/5 text-navy dark:text-emerald-green border border-navy/5 dark:border-emerald-green/20 px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
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
          <div className="absolute -inset-4 bg-emerald-green/10 blur-[100px] rounded-full"></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/40"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/40"></div>
                <div className="w-3 h-3 rounded-full bg-navy/40 dark:bg-slate-400/40"></div>
              </div>
              <div className="h-2 w-32 bg-slate-100 dark:bg-white/5 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-32 bg-slate-50 dark:bg-white/5 rounded-xl p-4 flex flex-col justify-between border border-slate-100 dark:border-white/5">
                <span className="text-xs text-slate-gray dark:text-slate-400 font-medium uppercase tracking-wider">Recaudo Mensual</span>
                <span className="text-2xl font-black text-emerald-green tracking-tight">$84,200</span>
              </div>
              <div className="h-32 bg-slate-50 dark:bg-white/5 rounded-xl p-4 flex flex-col justify-between border border-slate-100 dark:border-white/5">
                <span className="text-xs text-slate-gray dark:text-slate-400 font-medium uppercase tracking-wider">Ocupación</span>
                <span className="text-2xl font-black text-navy dark:text-white tracking-tight">98.4%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-12 bg-slate-50 dark:bg-white/5 rounded-lg flex items-center px-4 gap-4 border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-full bg-emerald-green/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-green"></div>
                </div>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                <div className="w-12 h-2 bg-emerald-green/40 rounded-full"></div>
              </div>
              <div className="h-12 bg-slate-50/50 dark:bg-white/5 rounded-lg flex items-center px-4 gap-4 border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-full bg-navy/10 dark:bg-white/10 flex items-center justify-center">
                   <div className="w-3 h-3 rounded-full bg-navy dark:bg-white/40"></div>
                </div>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-white/5 rounded-full"></div>
                <div className="w-12 h-2 bg-navy/20 dark:bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
