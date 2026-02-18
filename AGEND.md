# PropManagement - Roadmap & Seguimiento de Tareas 📅

Este documento rastrea el progreso técnico y la evolución de la plataforma.

## ✅ Hitos Completados (Milestones)

### 🚀 Milestone 1: Arquitectura Base y Reorganización Profesional
- [x] **Gestión de Sesión:** Hidratación de Redux desde el servidor (SSR) para eliminar parpadeos.
- [x] **Sincronización Real-time:** `AuthProvider` para cambios de sesión instantáneos.
- [x] **Clean Routing:** Implementación de Route Groups (`(auth)`, `(dashboard)`) con URLs limpias (sin prefijo `/auth/`).
- [x] **Dark Mode Premium:** Soporte completo con `next-themes` y selector en el Header.

### 🎨 Milestone 2: Sistema de Diseño y Refactorización
- [x] **Diseño Atómico:** Creación de componentes UI core (`Button`, `Input`, `Card`, `Badge`).
- [x] **Refactorización Auth:** Login, Registro, Recuperación y Reset 100% funcionales y estilizados.
- [x] **Dashboard de Usuario:** Vistas de Perfil, Edición de Perfil y Pagos (UI/UX completada).
- [x] **Paneles Administrativos:** Refactorización de las vistas Admin y Super Admin con arquitectura modular.
- [x] **Modularidad de Características:** Migración de la Landing Page a `src/features/landing`.

---

## 🏗️ Próximos Pasos (En Desarrollo)

### 🔌 Fase 3: Conectividad y Datos Reales (Prioridad Alta)
- [ ] **Tablas en Supabase:** Crear el esquema de base de datos para `announcements`, `payments` y `units`.
- [ ] **Fetching de Datos:** Reemplazar los `dummyData` por llamadas reales a Supabase usando el cliente de servidor.
- [ ] **Roles Dinámicos:** Implementar la lógica de asignación de roles en la base de datos (actualmente son metadatos).

### 🏠 Funcionalidades del Residente
- [ ] **Pasarela de Pagos:** Integrar un webhook de prueba para simular el pago de administración.
- [ ] **Sistema de PQRS:** Formulario para crear solicitudes de mantenimiento desde el dashboard.
- [ ] **Documentación:** Carga y visualización de archivos PDF reales desde Supabase Storage.

### 🏢 Gestión Administrativa
- [ ] **CRUD de Residentes:** Interfaz para que el Admin pueda crear/editar usuarios de su conjunto.
- [ ] **Generador de Comunicados:** Panel para redactar anuncios que se guarden en la DB.

---

## 🛠️ Notas de la Sesión Actual
- La arquitectura de carpetas es ahora **escalable y profesional**.
- Se han corregido conflictos críticos de importación de `next/headers` en el cliente.
- El sistema es **100% responsivo** y soporta **temas claro/oscuro**.

---
*Última actualización: 17 de Febrero de 2026 - ¡Arquitectura Core Finalizada!*
