import { getTranslations } from 'next-intl/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default async function Benefits() {
  const t = await getTranslations('landing.benefits');

  const benefits = [
    {
      title: t('benefit1Title'),
      detail: t('benefit1Desc'),
    },
    {
      title: t('benefit2Title'),
      detail: t('benefit2Desc'),
    },
    {
      title: t('benefit3Title'),
      detail: t('benefit3Desc'),
    },
  ];

  return (
    <section
      className="bg-background-light dark:bg-background-dark px-4 py-20 sm:px-6 lg:px-8"
      id="beneficios"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="bg-primary/10 absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl"></div>
            <div className="bg-emerald-green/10 absolute -right-4 -bottom-4 h-32 w-32 rounded-full blur-2xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <img
                alt="Real estate office"
                className="h-48 w-full rounded-2xl object-cover shadow-lg"
                data-alt="Office interior with glass walls and plant"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABPbDz6ib5mCDjqNswKB_IDfepvZqnUycW70V5CfkorygA3_VxDX9AsoyIb6fmEgDdQzWwN9f_G_dRHYBxU_rXAv5v7JY-Uzu9hQB9MmAI5UapH9TCbkC8Cyth6YiUb7Rf_ItB0CdUwYIyhijuzE5nEcBDIoaXJYZ-2fjOUSvuw3vBRWroa2Ur1yFtQTyqRwpHWGe-Eni-SxfnDr8Q0I8tUy0SkU4vJT6SoPSTycv5gNeiHTiFOd1HjWL1FHVlSc-BZdcHogJpo5zL"
              />
              <img
                alt="Modern lobby"
                className="mt-8 h-64 w-full rounded-2xl object-cover shadow-lg"
                data-alt="Modern building lobby with sleek furniture"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8PkjP8AyNH_cTyT7d5d-8-TWm8CjS6F1__7qEMYaZTCJuotvvv56cS4tdzBoGEeES7uo1B5cGeVcRjXaLHulscEA-D_yy5Zhyr6otZFLzLh17HwwUSCNyrbGKClu3NWPox6jKB8b8KrOHInEZ1uoBQoXOJWuPMzXdG8H-N7QkV1ZhjQS-Yo5grqlDi6rUjn0_eOrkigK0OOoK4pubDoBNWAw2Chdr721EV-wqb25FarRV3FdL8VQdIYeftf61-xN4g6wpKi1gcibn"
              />
              <img
                alt="Architecture building"
                className="-mt-8 h-64 w-full rounded-2xl object-cover shadow-lg"
                data-alt="Blue glass skyscraper facade close up"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOOQGGt0v0Ugm-iVnzoiuNddX4QWgYN4r-Apn_auoA4_fRt4I3WuFbWd1cXXxrzZbY5Xk2zAb7aOtQ8yhoZDxe8OOG__YHjsjhbNbnj7MQU67Z3dXEOfv9FMxLrdyFq-tz9o3GjeQ9eyqCfYN3dxq2_cl7Mb5yg_n66sTEnxq6AXx7-S-ezoG10aLjq4HTZ9dB0Cxl1_hrUkHftjBxGCbHeJBHHf-gpUdggw2OUg1IX_mx3njr-2k0TUfB5EhOsYNOEEldlnXsMbuf"
              />
              <img
                alt="Windows"
                className="h-48 w-full rounded-2xl object-cover shadow-lg"
                data-alt="Modern building windows pattern architecture"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaLsjpvoLo8MRJLaUy9ZRGNAu5B5wh8JxpfwwpfaoiJf8lZBClQTchK6-V9giJ63Yeur8fqnZsCHWVtVZkIFpzvmdcUg17zOAzwNt-2W8lntwUKOeZ6X5ziXeQjXuTCIlVhCt_nK8ZoRfids_TMqbjIng-8XOBvClDcsd8SPdloYJbGBQsDbFKPzMoWuJdmljRHhCjpXLexlMuDS0S0DFG6FBMtcvWYBz9OlQcuxfKuxKQkMzy9vfsuIg0vggQn7R3FQmbsbgGU5IB"
              />
            </div>
          </div>
          <div className="order-1 flex flex-col gap-8 lg:order-2">
            <div>
              <h2 className="text-navy mb-4 text-3xl font-black sm:text-4xl dark:text-white">
                {t('title')}
              </h2>
              <p className="text-slate-gray text-lg dark:text-slate-400">
                {t('subtitle')}
              </p>
            </div>
            <ul className="flex flex-col gap-6">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-4">
                  <div className="bg-emerald-green/20 text-emerald-green flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="text-navy font-bold dark:text-white">
                      {b.title}
                    </h5>
                    <p className="text-slate-gray text-sm dark:text-slate-400">
                      {b.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
