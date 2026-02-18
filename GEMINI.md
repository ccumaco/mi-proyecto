# PropManagement - Manifesto Tecnológico 🚀

Este documento define la arquitectura, estándares y convenciones del proyecto. **Es de lectura obligatoria para cualquier intervención técnica.**

## 🏗️ Arquitectura del Sistema

### 1. Gestión de Estado Híbrida (SSR + Redux)
- **Fuente de Verdad:** Supabase Auth gestiona la sesión mediante cookies.
- **Hidratación:** El `RootLayout` (Server Component) recupera la sesión y la inyecta como `preloadedState` en el Store de Redux.
- **Sincronización:** El `AuthProvider` (Client Component) escucha cambios en tiempo real vía `onAuthStateChange` para mantener Redux actualizado sin recargar la página.

### 2. Estructura de Directorios (Feature-Based)
Hemos adoptado una arquitectura modular para asegurar la escalabilidad:

- `src/app/(auth)`: Grupo de rutas para procesos de autenticación (Login, Registro).
- `src/app/(dashboard)`: Grupo de rutas protegido para paneles de administración.
- `src/features/`: Lógica de negocio y componentes complejos agrupados por dominio (ej: `landing/`).
- `src/components/ui/`: Componentes atómicos/primitivos (Botones, Inputs, Cards).
- `src/components/layout/`: Estructuras maestras (Sidebars, Headers).
- `src/components/shared/`: Utilidades de UI como `RoleGuard`.

### 3. Sistema de Roles (RBAC)
- Los roles se gestionan en los metadatos del usuario (`user_metadata.role`).
- Roles soportados: `user`, `admin`, `super-admin`.
- **Protección:** Middleware para rutas y `RoleGuard` para elementos visuales.

## 🛠️ Stack Tecnológico
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4.
- **Estado:** Redux Toolkit (RTK).
- **Backend:** Supabase (Auth, DB, Storage, SSR).
- **UI:** FontAwesome 6, Geist Sans/Mono.

## 📏 Convenciones de Código
- **Componentes:** Usar `'use client'` solo cuando sea estrictamente necesario (hooks, eventos).
- **UI:** Antes de crear un nuevo componente visual, verificar si puede ser un átomo en `src/components/ui`.
- **Imports:** Usar alias `@/` para todas las rutas absolutas.
- **Git:** Mensajes de commit claros y en español.

## 🔐 Seguridad
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en el cliente.
- Siempre validar la sesión en el servidor (`layout.tsx` o `page.tsx`) mediante `createClient()` de `supabase/server`.
