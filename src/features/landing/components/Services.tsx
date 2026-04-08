import { getTranslations } from 'next-intl/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faBullhorn,
  faChartColumn,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export default async function Services() {
  const t = await getTranslations('landing.services');

  const services: { title: string; desc: string; icon: IconDefinition }[] = [
    {
      title: t('service1Title'),
      desc: t('service1Desc'),
      icon: faCreditCard,
    },
    {
      title: t('service2Title'),
      desc: t('service2Desc'),
      icon: faBullhorn,
    },
    {
      title: t('service3Title'),
      desc: t('service3Desc'),
      icon: faChartColumn,
    },
    {
      title: t('service4Title'),
      desc: t('service4Desc'),
      icon: faHeadset,
    },
  ];

  return (
    <section id="servicios" className="bg-gray-50 py-24 dark:bg-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="px-4 pt-20 pb-4 sm:px-6 lg:px-8" id="servicios">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-primary mb-3 text-sm font-bold tracking-[0.2em] uppercase">
              {t('badge')}
            </h2>
            <h3 className="text-navy text-3xl font-black sm:text-4xl dark:text-white">
              {t('title')}
            </h3>
            <p className="text-slate-gray mx-auto mt-4 max-w-2xl text-lg dark:text-slate-400">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-[#191919]"
            >
              <div className="text-primary mb-4">
                <FontAwesomeIcon icon={s.icon} className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-secondary text-sm dark:text-gray-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
