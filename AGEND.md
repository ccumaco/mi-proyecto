# PropManagement - Roadmap & Seguimiento de Tareas 📅

Este documento sirve para rastrear el progreso del proyecto y planificar los próximos pasos técnicos.

## ✅ Hitos Completados (Milestones)

### 🚀 Milestone 1: Arquitectura Base y Reorganización Profesional
- [x] **Gestión de Sesión:** Implementación de hidratación de Redux desde el servidor (SSR) para evitar parpadeos de usuario.
- [x] **Sincronización en Tiempo Real:** Creación del `AuthProvider` para escuchar cambios de Supabase en tiempo real.
- [x] **Arquitectura Route Groups:** Organización de rutas en `(auth)` y `(dashboard)` para separar layouts limpios.
- [x] **Diseño Atómico:** Implementación de componentes UI base en `src/components/ui/` (`Button`, `Input`, `Card`).
- [x] **Estructura Modular:** Reorganización de la landing page en `src/features/landing`.
- [x] **Sistema de Roles (RBAC):** Sidebar dinámico y `RoleGuard` según el rol (`user`, `admin`, `super-admin`).

---

## 🏗️ Tareas Pendientes (Backlog)

### 📊 Dashboard de Usuario (Residente)
- [ ] **Módulo de Perfil:** Editar información personal, cambio de avatar.
- [ ] **Pagos:** Integración con pasarela, historial de recibos, descarga de PDFs.
- [ ] **PQRS:** Sistema de creación y seguimiento de tickets/peticiones.

### 🏢 Dashboard Administrador
- [ ] **Gestión de Residentes:** Tabla CRUD de usuarios por conjunto.
- [ ] **Control Financiero:** Generación de reportes de morosidad y cobros.
- [ ] **Comunicados:** Creación de anuncios con notificaciones push/email.

### 🛡️ Dashboard Super Administrador
- [ ] **Gestión de Conjuntos:** Alta de nuevas copropiedades en el sistema.
- [ ] **Logs del Sistema:** Auditoría de acciones críticas.

### 🎨 Mejoras de UI/UX
- [ ] Implementar esqueletos de carga (`Skeletons`) en tablas.
- [ ] Refactorizar el formulario de Login con los nuevos componentes `Input` y `Button`.
- [ ] Añadir animaciones suaves con Framer Motion (opcional).

---

## 🛠️ Notas de Desarrollo (Próxima Sesión)
- **Prioridad 1:** Refactorizar `Login` y `Register` para usar la carpeta `(auth)` correctamente y componentes `UI`.
- **Prioridad 2:** Implementar el flujo de "Editar Perfil" en el dashboard.
- **Prioridad 3:** Conectar la lista de anuncios con datos reales de la base de datos de Supabase.

---
*Última actualización: 17 de Febrero de 2026*
