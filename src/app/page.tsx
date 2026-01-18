// src/app/page.tsx
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import AboutSection from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Benefits from '@/components/sections/Benefits';
import FinalCTA from '@/components/sections/FinalCTA';
import Footer from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      {/* 1. Navegación y selector de tema */}
      <Navbar />

      <main className="mx-auto flex w-full flex-col">
        {/* 2. Sección Hero: Innovación Inmobiliaria */}
        <Hero />

        {/* 3. Sección Nosotros: Líderes en transformación */}
        <AboutSection />

        {/* 4. Sección Soluciones: Pagos, Comunicación y Reportes */}
        <Services />

        {/* 5. Sección Beneficios: Tranquilidad y Ahorro */}
        <Benefits />

        {/* 6. Llamado a la Acción final */}
        <FinalCTA />
      </main>

      {/* 7. Pie de página con contacto y enlaces legales */}
      <Footer />
    </>
  );
}
