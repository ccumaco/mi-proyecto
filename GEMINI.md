# AGENDA - PropManagement

## 📋 Descripción del Proyecto

**PropManagement** es una plataforma web de administración de conjuntos residenciales que moderniza la gestión de comunidades con tecnología de punta y procesos financieros transparentes.

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 16.1.2** - Framework de React con App Router
- **React 19.2.3** - Biblioteca de interfaces de usuario
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4.1.18** - Framework de estilos utilitarios

### Backend/Base de Datos

- **Supabase** - Backend as a Service
  - `@supabase/supabase-js` - Cliente de Supabase
  - `@supabase/ssr` - Integración SSR con Supabase

### Utilidades

- **next-themes** - Soporte para tema oscuro/claro
- **Font Awesome** - Biblioteca de iconos

### Herramientas de Desarrollo

- **ESLint 9** - Linter de código
- **Prettier 3.8** - Formateador de código
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Landing page
│   ├── admin/              # Panel de administrador
│   ├── super-admin/        # Panel de super administrador
│   ├── profile/            # Perfil de usuario
│   └── auth/
│       ├── login/          # Inicio de sesión
│       ├── register/       # Registro
│       ├── recovery/       # Recuperación de contraseña
│       └── reset-password/ # Restablecer contraseña
├── components/
│   └── sections/
│       ├── Navbar.tsx      # Barra de navegación
│       ├── Hero.tsx        # Sección principal
│       ├── About.tsx       # Sección nosotros
│       ├── Services.tsx    # Sección servicios
│       ├── Benefits.tsx    # Sección beneficios
│       ├── FinalCTA.tsx    # Llamado a la acción
│       └── Footer.tsx      # Pie de página
├── lib/
│   └── supabase.ts         # Configuración de Supabase
└── proxy.ts
```

## ✨ Características Principales

### 🏠 Landing Page

- Navbar con navegación responsive
- Hero section con diseño moderno
- Sección "Quiénes somos"
- Catálogo de servicios
- Beneficios destacados
- Llamado a la acción (CTA)
- Footer con información de contacto

### 🔐 Sistema de Autenticación

- Inicio de sesión
- Registro de usuarios
- Recuperación de contraseña
- Restablecimiento de contraseña
- Integración con Supabase Auth

### 👤 Roles de Usuario

- **Usuario** - Perfil básico
- **Administrador** - Panel de administración
- **Super Administrador** - Panel con permisos completos

### 🎨 UI/UX

- Diseño responsive (mobile-first)
- Soporte para tema claro/oscuro
- Fuentes optimizadas (Geist Sans/Mono)
- Animaciones y transiciones suaves
- Componentes con Tailwind CSS

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## 📝 Tareas Pendientes

- [ ] Implementar dashboard de usuario
- [ ] Sistema de pagos de cuotas
- [ ] Módulo de comunicación/notificaciones
- [ ] Reportes financieros
- [ ] Gestión de residentes
- [ ] Sistema de PQRS (Peticiones, Quejas, Reclamos, Sugerencias)

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.
