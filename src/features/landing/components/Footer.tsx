'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="bg-white dark:bg-navy py-12 border-t border-slate-100 dark:border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 max-w-7xl mx-auto gap-8">
        <div className="text-xl font-black text-navy dark:text-white">
          PropAdmin <span className="text-emerald-green">PRO</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/privacy" className="text-slate-gray hover:text-emerald-green transition-colors text-sm font-bold">
            {t('privacy')}
          </Link>
          <Link href="/terms" className="text-slate-gray hover:text-emerald-green transition-colors text-sm font-bold">
            {t('termsOfService')}
          </Link>
          <Link href="#contact" className="text-slate-gray hover:text-emerald-green transition-colors text-sm font-bold">
            {t('contactTitle')}
          </Link>
          <a href="#" className="text-slate-gray hover:text-emerald-green transition-colors text-sm font-bold">
            Twitter
          </a>
          <a href="#" className="text-slate-gray hover:text-emerald-green transition-colors text-sm font-bold">
            LinkedIn
          </a>
        </div>
        
        <div className="text-slate-gray text-xs font-bold opacity-60">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
