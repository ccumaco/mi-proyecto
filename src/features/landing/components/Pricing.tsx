'use client';

import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Pricing() {
  const t = useTranslations('landing.pricing');

  const plans = [
    {
      name: t('planBasicName'),
      price: t('planBasicPrice'),
      description: t('planBasicDesc'),
      features: [
        t('featureUnits', { count: 50 }),
        t('featureSupport', { type: t('supportEmail') }),
        t('featureCloudinary'),
        t('featurePayments'),
      ],
      cta: t('getStarted'),
      popular: false,
    },
    {
      name: t('planProName'),
      price: t('planProPrice'),
      description: t('planProDesc'),
      features: [
        t('featureUnits', { count: 200 }),
        t('featureSupport', { type: t('supportPriority') }),
        t('featureCloudinary'),
        t('featurePayments'),
        t('featureApp'),
      ],
      cta: t('getStarted'),
      popular: true,
    },
    {
      name: t('planEnterpriseName'),
      price: t('planEnterprisePrice'),
      description: t('planEnterpriseDesc'),
      features: [
        t('featureUnlimitedUnits'),
        t('featureSupport', { type: t('supportPriority') }),
        t('featureCloudinary'),
        t('featurePayments'),
        t('featureApp'),
      ],
      cta: t('getStarted'),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32 dark:bg-navy">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="text-emerald-green text-sm font-bold tracking-widest uppercase">
            {t('badge')}
          </h2>
          <p className="text-navy dark:text-white mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            {t('title')}
          </p>
          <p className="text-slate-gray dark:text-slate-400 mt-6 text-lg leading-8">
            {t('subtitle')}
          </p>
        </div>

        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col items-center rounded-[2rem] p-10 ring-1 transition-all ${
                plan.popular
                  ? 'bg-navy ring-emerald-green/30 shadow-2xl dark:bg-slate-800 transform scale-105 z-10'
                  : 'bg-slate-50 ring-slate-200 dark:bg-white/5 dark:ring-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-green text-white text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                  {t('mostPopular')}
                </div>
              )}
              
              <span className={`text-sm font-bold uppercase tracking-widest mb-4 ${
                plan.popular ? 'text-emerald-green' : 'text-slate-gray dark:text-slate-400'
              }`}>
                {plan.name}
              </span>
              
              <div className="flex items-baseline mb-8">
                <span className={`text-5xl font-black tracking-tight ${
                  plan.popular ? 'text-white' : 'text-navy dark:text-white'
                }`}>
                  {plan.price}
                </span>
                <span className={`ml-2 text-sm font-bold ${
                  plan.popular ? 'text-slate-400' : 'text-slate-gray'
                }`}>
                  /{t('monthly')}
                </span>
              </div>

              <ul role="list" className="space-y-4 mb-10 w-full text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-emerald-green text-[10px]"
                      />
                    </div>
                    <span className={plan.popular ? 'text-slate-300' : 'text-slate-gray dark:text-slate-400'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                  plan.popular
                    ? 'bg-emerald-green text-white shadow-lg shadow-emerald-500/20 hover:opacity-90'
                    : 'bg-white dark:bg-white/10 text-navy dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
