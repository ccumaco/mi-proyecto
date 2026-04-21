'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FinalCTA() {
  const t = useTranslations('landing.cta');

  return (
    <section className="py-24 px-8 bg-white dark:bg-navy">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-slate-50 dark:bg-white/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-slate-200 dark:border-white/10 backdrop-blur-xl"
      >
        {/* Decorative Blobs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-green/5 rounded-full blur-3xl"></div>
        
        <h2 className="text-4xl md:text-6xl font-black text-navy dark:text-white mb-8 tracking-tighter leading-tight">
          {t('title')}
        </h2>
        <p className="text-xl text-slate-gray dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/register"
            className="inline-block bg-emerald-green text-white px-12 py-5 rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-2xl shadow-emerald-500/20"
          >
            {t('requestAdvisory')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
