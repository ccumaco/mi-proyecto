'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Benefits() {
  const t = useTranslations('landing.benefits');

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
    <section className="bg-slate-50 dark:bg-navy/80 py-24 px-8 overflow-hidden" id="beneficios">
      <div className="max-w-7xl mx-auto">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-green/10 rounded-full blur-3xl"></div>
            <div className="grid grid-cols-2 gap-6 relative">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                alt="Real estate office"
                className="h-48 w-full rounded-[2rem] object-cover shadow-xl border border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABPbDz6ib5mCDjqNswKB_IDfepvZqnUycW70V5CfkorygA3_VxDX9AsoyIb6fmEgDdQzWwN9f_G_dRHYBxU_rXAv5v7JY-Uzu9hQB9MmAI5UapH9TCbkC8Cyth6YiUb7Rf_ItB0CdUwYIyhijuzE5nEcBDIoaXJYZ-2fjOUSvuw3vBRWroa2Ur1yFtQTyqRwpHWGe-Eni-SxfnDr8Q0I8tUy0SkU4vJT6SoPSTycv5gNeiHTiFOd1HjWL1FHVlSc-BZdcHogJpo5zL"
              />
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                alt="Modern lobby"
                className="mt-12 h-64 w-full rounded-[2rem] object-cover shadow-xl border border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8PkjP8AyNH_cTyT7d5d-8-TWm8CjS6F1__7qEMYaZTCJuotvvv56cS4tdzBoGEeES7uo1B5cGeVcRjXaLHulscEA-D_yy5Zhyr6otZFLzLh17HwwUSCNyrbGKClu3NWPox6jKB8b8KrOHInEZ1uoBQoXOJWuPMzXdG8H-N7QkV1ZhjQS-Yo5grqlDi6rUjn0_eOrkigK0OOoK4pubDoBNWAw2Chdr721EV-wqb25FarRV3FdL8VQdIYeftf61-xN4g6wpKi1gcibn"
              />
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                alt="Architecture building"
                className="-mt-12 h-64 w-full rounded-[2rem] object-cover shadow-xl border border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOOQGGt0v0Ugm-iVnzoiuNddX4QWgYN4r-Apn_auoA4_fRt4I3WuFbWd1cXXxrzZbY5Xk2zAb7aOtQ8yhoZDxe8OOG__YHjsjhbNbnj7MQU67Z3dXEOfv9FMxLrdyFq-tz9o3GjeQ9eyqCfYN3dxq2_cl7Mb5yg_n66sTEnxq6AXx7-S-ezoG10aLjq4HTZ9dB0Cxl1_hrUkHftjBxGCbHeJBHHf-gpUdggw2OUg1IX_mx3njr-2k0TUfB5EhOsYNOEEldlnXsMbuf"
              />
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                alt="Windows"
                className="h-48 w-full rounded-[2rem] object-cover shadow-xl border border-white/10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaLsjpvoLo8MRJLaUy9ZRGNAu5B5wh8JxpfwwpfaoiJf8lZBClQTchK6-V9giJ63Yeur8fqnZsCHWVtVZkIFpzvmdcUg17zOAzwNt-2W8lntwUKOeZ6X5ziXeQjXuTCIlVhCt_nK8ZoRfids_TMqbjIng-8XOBvClDcsd8SPdloYJbGBQsDbFKPzMoWuJdmljRHhCjpXLexlMuDS0S0DFG6FBMtcvWYBz9OlQcuxfKuxKQkMzy9vfsuIg0vggQn7R3FQmbsbgGU5IB"
              />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 flex flex-col gap-10"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-navy dark:text-white mb-6 tracking-tight leading-tight">
                {t('title')}
              </h2>
              <p className="text-xl text-slate-gray dark:text-slate-400 leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
            
            <ul className="grid gap-8">
              {benefits.map((b, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-10 h-10 bg-emerald-green/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="text-emerald-green w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-navy dark:text-white mb-2">
                      {b.title}
                    </h5>
                    <p className="text-slate-gray dark:text-slate-400 leading-relaxed">
                      {b.detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
