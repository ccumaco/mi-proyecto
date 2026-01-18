const services = [
  {
    title: 'Pagos Online',
    desc: 'Recaudo automático y procesamiento seguro.',
    icon: '💳',
  },
  {
    title: 'Comunicación',
    desc: 'Muro de avisos y votaciones digitales.',
    icon: '📣',
  },
  {
    title: 'Reportes',
    desc: 'Dashboards financieros en tiempo real.',
    icon: '📊',
  },
  {
    title: 'Soporte 24/7',
    desc: 'Asistencia técnica y legal disponible.',
    icon: '🎧',
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-gray-50 py-24 dark:bg-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="px-4 pt-20 pb-4 sm:px-6 lg:px-8" id="servicios">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-primary mb-3 text-sm font-bold tracking-[0.2em] uppercase">
              Nuestras Soluciones
            </h2>
            <h3 className="text-navy text-3xl font-black sm:text-4xl dark:text-white">
              Servicios Principales
            </h3>
            <p className="text-slate-gray mx-auto mt-4 max-w-2xl text-lg dark:text-slate-400">
              Todo lo que necesitas para administrar tu conjunto residencial de
              manera profesional y sin complicaciones.
            </p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-8 transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-[#191919]"
            >
              <div className="mb-4 text-4xl">{s.icon}</div>
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
