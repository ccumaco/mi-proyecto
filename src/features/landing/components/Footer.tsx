import { getTranslations } from 'next-intl/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faShareNodes,
  faAt,
  faGlobe,
  faLocationDot,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

export default async function Footer() {
  const t = await getTranslations('landing.footer');

  return (
    <footer className="dark:bg-background-dark border-t border-slate-200 bg-white px-4 pt-16 pb-8 sm:px-6 lg:px-8 dark:border-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-xl text-white"
                />
              </div>
              <h2 className="text-navy text-lg font-bold dark:text-white">
                {t('brand')}
              </h2>
            </div>
            <p className="text-slate-gray text-sm leading-relaxed dark:text-slate-400">
              {t('brandDesc')}
            </p>
            <div className="flex gap-4">
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <FontAwesomeIcon icon={faShareNodes} className="text-base" />
              </a>
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <FontAwesomeIcon icon={faAt} className="text-base" />
              </a>
              <a
                className="text-slate-gray hover:bg-primary flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-all hover:text-white dark:bg-slate-800"
                href="#"
              >
                <FontAwesomeIcon icon={faGlobe} className="text-base" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">{t('companyTitle')}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('aboutUs')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('careers')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('blog')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('press')}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">{t('supportTitle')}</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('helpCenter')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('termsOfService')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a
                  className="text-slate-gray hover:text-primary text-sm transition-colors dark:text-slate-400"
                  href="#"
                >
                  {t('systemStatus')}
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-navy font-bold dark:text-white">{t('contactTitle')}</h4>
            <ul className="flex flex-col gap-4">
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-primary text-xl"
                />
                <span>{t('address')}</span>
              </li>
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-primary text-xl"
                />
                <span>{t('phone')}</span>
              </li>
              <li className="text-slate-gray flex gap-3 text-sm dark:text-slate-400">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-primary text-xl"
                />
                <span>{t('email')}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row dark:border-slate-800">
          <p className="text-slate-gray text-center text-xs md:text-left dark:text-slate-500">
            {t('copyright')}
          </p>
          <div className="flex gap-6">
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              {t('privacyLink')}
            </a>
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              {t('cookiesLink')}
            </a>
            <a
              className="text-slate-gray text-xs hover:underline dark:text-slate-500"
              href="#"
            >
              {t('securityLink')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
