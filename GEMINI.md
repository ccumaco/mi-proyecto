# PropManagement - Roadmap & Seguimiento de Tareas 📅

Este documento rastrea el progreso técnico y la evolución de la plataforma PropAdmin PRO (Frontend).

## ✅ Hitos Completados (Milestones)

### 🚀 Milestone 1: Arquitectura Base y Reorganización Profesional
- [x] **Gestión de Sesión:** Hidratación de Redux desde el servidor (SSR) para eliminar parpadeos.
- [x] **Sincronización Real-time:** `AuthProvider` para cambios de sesión instantáneos.
- [x] **Clean Routing:** Implementación de Route Groups (`(auth)`, `(dashboard)`) con URLs limpias.
- [x] **Dark Mode Premium:** Soporte completo con `next-themes`.

### 🎨 Milestone 2: Sistema de Diseño y Refactorización
- [x] **Diseño Atómico:** Componentes UI core (`Button`, `Input`, `Card`, `Badge`) con Tailwind CSS 4.
- [x] **Refactorización Auth:** Login, Registro, Recuperación y Reset 100% funcionales conectando al Backend propio.
- [x] **Dashboard de Usuario:** Perfil, Edición de Perfil y Pagos (UI/UX completada).
- [x] **Paneles Administrativos:** Vistas Admin y Super Admin con arquitectura modular.
- [x] **Modularidad:** Migración de Landing Page a `src/features/landing`.

### 🔌 Milestone 3: Integración con Backend (API REST)
- [x] **Cliente API:** Implementación de `apiClient` en `src/lib/api.ts` con manejo de errores tipado.
- [x] **Autenticación JWT:** Flujo completo de Login/Register/Refresh con Redux Toolkit.
- [x] **OTP (SMS):** Integración con INALAMBRIA Express para verificación telefónica.
- [x] **Gestión de Reset:** Flujo de recuperación de contraseña vía Email funcional.

---

## 🏗️ Próximos Pasos (En Desarrollo)

### 📊 Conectividad de Datos Reales (Prioridad Alta)
- [ ] **Fetching de Entidades:** Reemplazar `dummyData` por llamadas a `/api/properties`, `/api/units` y `/api/announcements`.
- [ ] **Gestión de Archivos:** Integración total con Cloudinary para visualización de documentos y fotos de zonas.
- [ ] **Roles Dinámicos:** Refinar el acceso basado en roles (`SUPER_ADMIN`, `ADMIN`, `RESIDENT`) según la respuesta del backend.

### 🏠 Funcionalidades del Residente
- [ ] **Pasarela de Pagos:** Integración de Webhooks para pagos de administración (Stripe/PayU/etc).
- [ ] **Sistema de PQRS:** Módulo de solicitudes de mantenimiento conectando con el backend.
- [ ] **Mis Unidades:** Vista detallada de la unidad del residente filtrada por su ID.

### 🏢 Gestión Administrativa
- [ ] **CRUD de Residentes:** Panel para que el Admin gestione usuarios de su propiedad.
- [ ] **Generador de Comunicados:** Editor para crear anuncios que se guarden en la base de datos PostgreSQL.
- [ ] **Zonas Comunes:** Sistema de reservas conectando con los endpoints correspondientes.

---

## 🛠️ Notas de la Sesión Actual
- El proyecto se ha desvinculado de Supabase; ahora usa un **Backend propio en Railway**.
- La comunicación se realiza mediante **JWT** almacenados en `localStorage`.
- Se usa **Cloudinary** para el almacenamiento de archivos (URLs `secure_url`).

---
_Última actualización: 18 de Abril de 2026 - Integración de API Core Finalizada_
