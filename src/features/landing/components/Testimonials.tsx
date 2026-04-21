'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const t = useTranslations('landing.testimonials');

  const testimonials = [
    {
      quote: t('quote1'),
      author: t('author1'),
      role: t('role1'),
      initials: 'CR',
    },
    {
      quote: t('quote2'),
      author: t('author2'),
      role: t('role2'),
      initials: 'MG',
    },
    {
      quote: t('quote3'),
      author: t('author3'),
      role: t('role3'),
      initials: 'RS',
    },
  ];

  return (
    <section className="bg-white py-24 dark:bg-navy">
      <div className="mx-auto max-w-7xl px-8">
        <div className="text-center mb-16">
          <h2 className="text-emerald-green text-sm font-bold tracking-widest uppercase mb-4">
            {t('badge')}
          </h2>
          <p className="text-3xl font-black text-navy dark:text-white tracking-tight sm:text-4xl">
            {t('title')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-50 dark:bg-white/5 rounded-2xl border-l-4 border-emerald-green shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-lg italic text-slate-gray dark:text-slate-300 mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-green flex items-center justify-center text-white font-black text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-bold text-navy dark:text-white">{testimonial.author}</div>
                  <div className="text-xs text-emerald-green font-bold uppercase tracking-tighter">
                    {testimonial.role.split(' - ')[1] || testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
