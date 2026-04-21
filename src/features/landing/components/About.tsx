'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Rocket } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('landing.about');

  return (
    <section className="bg-white dark:bg-navy py-24 px-8 overflow-hidden" id="nosotros">
      <div className="max-w-7xl mx-auto">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-navy dark:text-white leading-tight mb-6 tracking-tight">
                {t('title')}
              </h2>
              <p className="text-xl text-slate-gray dark:text-slate-400 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col gap-4 group">
                <div className="w-14 h-14 bg-emerald-green/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                  <ShieldCheck className="text-emerald-green w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{t('pillar1Title')}</h3>
                  <p className="text-sm text-slate-gray dark:text-slate-400">{t('pillar1Desc')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 group">
                <div className="w-14 h-14 bg-emerald-green/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                  <Eye className="text-emerald-green w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{t('pillar2Title')}</h3>
                  <p className="text-sm text-slate-gray dark:text-slate-400">{t('pillar2Desc')}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 group">
                <div className="w-14 h-14 bg-emerald-green/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110">
                  <Rocket className="text-emerald-green w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{t('pillar3Title')}</h3>
                  <p className="text-sm text-slate-gray dark:text-slate-400">{t('pillar3Desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-green/10 blur-3xl rounded-full"></div>
            <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10">
              <img
                alt={t('imageAlt')}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT8waJBUeU5j-sIgDU5ghwPTSGgn6jMBO4Gx8SoNOAElcZPA5rWUCMw45TidRFIhYeiOIDK72wxIbFEhIjTuV-ew8N25BPrXzblLhQnI1M8Z8qjyuwU4HDh-jbk8DeiZ95ttqypEUzD1IAYsEnGWQmTwaCq6RyfxUNGfVOO8E0btwlwR4bAI9AtzHnDHzbk1p-V8v2NQ5VWB2UVT14kZGqF3zfO8-iN9VGqeutTPNjP44FyIBBNBUBINlwW3NxJ2mHxTmIb_24Hufy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
