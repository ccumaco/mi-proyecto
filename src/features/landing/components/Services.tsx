'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Megaphone, 
  BarChart3, 
  Headphones 
} from 'lucide-react';

export default function Services() {
  const t = useTranslations('landing.services');

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-navy/50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <span className="text-emerald-green font-bold tracking-widest text-sm uppercase">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-navy dark:text-white mt-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-slate-gray dark:text-slate-400 mt-4 max-w-2xl text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1 - Pagos Online (Grande) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="text-emerald-green w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
                {t('service1Title')}
              </h3>
              <p className="text-slate-gray dark:text-slate-400 max-w-md">
                {t('service1Desc')}
              </p>
            </div>
            {/* Abstract representation of payment */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-5 group-hover:opacity-10 transition-opacity">
               <div className="absolute top-1/2 right-0 w-64 h-64 bg-emerald-green rounded-full blur-3xl"></div>
            </div>
          </motion.div>

          {/* Bento Card 2 - Comunicación (Pequeña) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="w-12 h-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
              <Megaphone className="text-emerald-green w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
              {t('service2Title')}
            </h3>
            <p className="text-slate-gray dark:text-slate-400">
              {t('service2Desc')}
            </p>
          </motion.div>

          {/* Bento Card 3 - Reportes (Pequeña) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="w-12 h-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="text-emerald-green w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
              {t('service3Title')}
            </h3>
            <p className="text-slate-gray dark:text-slate-400">
              {t('service3Desc')}
            </p>
          </motion.div>

          {/* Bento Card 4 - Soporte (Grande) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
                <Headphones className="text-emerald-green w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">
                {t('service4Title')}
              </h3>
              <p className="text-slate-gray dark:text-slate-400 max-w-md">
                {t('service4Desc')}
              </p>
            </div>
             <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-5 group-hover:opacity-10 transition-opacity">
               <div className="absolute bottom-0 right-0 w-48 h-48 bg-navy dark:bg-white rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
