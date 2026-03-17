import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faEye,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

export default function AboutSection() {
  return (
    <section
      className="dark:bg-background-dark/50 bg-white px-4 py-16 sm:px-6 lg:px-8"
      id="nosotros"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="text-navy text-3xl leading-tight font-black sm:text-4xl dark:text-white">
              Líderes en transformación digital inmobiliaria
            </h2>
            <p className="text-slate-gray text-lg leading-relaxed dark:text-slate-400">
              Somos expertos en la gestión de propiedad horizontal, enfocados en
              brindar seguridad, bienestar y valorización a tu patrimonio.
              Nuestra plataforma integra todos los actores de la copropiedad en
              un solo ecosistema digital.
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-3">
                <div className="text-primary">
                  <FontAwesomeIcon icon={faShieldHalved} className="h-9 w-9" />
                </div>
                <h3 className="text-navy text-lg font-bold dark:text-white">
                  Experiencia
                </h3>
                <p className="text-slate-gray text-sm dark:text-slate-400">
                  10+ años gestionando comunidades exitosas.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-emerald-green">
                  <FontAwesomeIcon icon={faEye} className="h-9 w-9" />
                </div>
                <h3 className="text-navy text-lg font-bold dark:text-white">
                  Transparencia
                </h3>
                <p className="text-slate-gray text-sm dark:text-slate-400">
                  Cuentas claras y reportes en tiempo real.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-primary">
                  <FontAwesomeIcon icon={faRocket} className="h-9 w-9" />
                </div>
                <h3 className="text-navy text-lg font-bold dark:text-white">
                  Innovación
                </h3>
                <p className="text-slate-gray text-sm dark:text-slate-400">
                  Herramientas digitales que simplifican todo.
                </p>
              </div>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
            <img
              alt="Luxury residential area"
              className="h-full w-full object-cover"
              data-alt="Beautiful suburban residential houses garden landscape"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT8waJBUeU5j-sIgDU5ghwPTSGgn6jMBO4Gx8SoNOAElcZPA5rWUCMw45TidRFIhYeiOIDK72wxIbFEhIjTuV-ew8N25BPrXzblLhQnI1M8Z8qjyuwU4HDh-jbk8DeiZ95ttqypEUzD1IAYsEnGWQmTwaCq6RyfxUNGfVOO8E0btwlwR4bAI9AtzHnDHzbk1p-V8v2NQ5VWB2UVT14kZGqF3zfO8-iN9VGqeutTPNjP44FyIBBNBUBINlwW3NxJ2mHxTmIb_24Hufy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
