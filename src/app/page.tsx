// src/app/page.tsx
import Navbar from '@/components/sections/Homepage/Navbar';
import Hero from '@/components/sections/Homepage/Hero';
import AboutSection from '@/components/sections/Homepage/About';
import Services from '@/components/sections/Homepage/Services';
import Benefits from '@/components/sections/Homepage/Benefits';
import FinalCTA from '@/components/sections/Homepage/FinalCTA';
import Footer from '@/components/sections/Homepage/Footer';

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
