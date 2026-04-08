import { getTranslations } from 'next-intl/server';

export default async function FinalCTA() {
  const t = await getTranslations('landing.cta');

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8" id="contacto">
      <div className="mx-auto max-w-7xl">
        <div className="bg-primary shadow-primary/40 relative overflow-hidden rounded-3xl p-8 text-center text-white shadow-2xl sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 0 L100 0 L100 100 L0 100 Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6">
            <h2 className="text-3xl font-black sm:text-5xl">
              {t('title')}
            </h2>
            <p className="rounded-xl bg-white/20 px-6 py-4 text-lg text-white backdrop-blur-md">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="text-primary h-14 rounded-xl bg-white px-10 text-base font-bold shadow-xl transition-all hover:bg-slate-100">
                {t('requestAdvisory')}
              </button>
              <button className="h-14 rounded-xl border-2 border-white/40 bg-transparent px-10 text-base font-bold text-white transition-all hover:bg-white/10">
                {t('talkToAdvisor')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
