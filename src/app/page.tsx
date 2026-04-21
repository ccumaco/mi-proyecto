// src/app/page.tsx
import Navbar from '@/features/landing/components/Navbar';
import Hero from '@/features/landing/components/Hero';
import AboutSection from '@/features/landing/components/About';
import Services from '@/features/landing/components/Services';
import Benefits from '@/features/landing/components/Benefits';
import FinalCTA from '@/features/landing/components/FinalCTA';
import Footer from '@/features/landing/components/Footer';
import Pricing from '@/features/landing/components/Pricing';
import Testimonials from '@/features/landing/components/Testimonials';

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

        {/* 5.5 Sección Precios */}
        <Pricing />

        {/* 5.7 Sección Testimonios */}
        <Testimonials />

        {/* 6. Llamado a la Acción final */}
        <FinalCTA />
      </main>

      {/* 7. Pie de página con contacto y enlaces legales */}
      <Footer />
    </>
  );
}
