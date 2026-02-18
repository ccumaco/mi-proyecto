import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="@container">
          <div className="bg-navy relative flex min-h-[560px] flex-col items-start justify-center overflow-hidden rounded-2xl px-8 py-16 sm:px-16">
            <div className="absolute inset-0 z-0">
              <div className="from-navy via-navy/80 absolute inset-0 z-10 bg-gradient-to-r to-transparent"></div>
              <img
                alt="Modern residential building exterior"
                className="h-full w-full object-cover"
                data-alt="Modern high-rise residential complex under clear sky"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKmyUd6Jp1N9fMgi9UyBV0PdG6zOxVvbbmnqsNkw3PIN_Apg8VOJrKnZJUYwW0qFvkMNuEfOvPJsYS8azRic0fb5g-IVGRy7ouCRttBYKUpON39PTNFJgf18ISCdydJfAxO1rSMOlC7tFeSBmVW6mGmGc8chUSuNhdebgiwrtUrzxzN6c-ZBInCkwz9lBJLdrahn2FF3c5b__6HoV4EzDp0oz_2l6M5LFhXzo3ZAzaNSXf_uxPLGEunv2z3iHYTMCMBUFsG4OODSyu"
              />
            </div>
            <div className="relative z-20 flex max-w-2xl flex-col gap-6">
              <div className="bg-emerald-green/20 text-emerald-green inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                Innovación Inmobiliaria
              </div>
              <h1 className="text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Administración eficiente y transparente para tu conjunto
                residencial
              </h1>
              <p className="text-lg leading-relaxed font-normal text-slate-300 sm:text-xl">
                Modernizamos la gestión de tu comunidad con tecnología de punta
                y procesos financieros claros.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <button className="bg-primary shadow-primary/30 h-14 rounded-xl px-8 text-base font-bold text-white shadow-xl transition-transform hover:scale-[1.02]">
                  Solicitar información
                </button>
                <button className="h-14 rounded-xl border border-white/20 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Ver Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
