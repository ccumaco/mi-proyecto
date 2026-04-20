# CLAUDE.md

## Project Overview

**PropAdmin PRO** — A property/community management platform for residential administrators in Spanish-speaking markets. Built with Next.js, TypeScript, and Redux Toolkit. Desplegado en Vercel.

**Note:** This is a project-specific documentation. For full-stack overview, API contracts, and shared types, see the root [CLAUDE.MD](../CLAUDE.MD).

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16 (App Router)               |
| Language  | TypeScript 5 (strict)                 |
| Styling   | Tailwind CSS 4 + PostCSS              |
| Icons     | Font Awesome 7 (SVG)                  |
| State     | Redux Toolkit 2                       |
| Auth      | JWT via backend propio (apiClient)    |
| Theme     | next-themes (dark mode)               |
| Linting   | ESLint 9 + Prettier 3                 |

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # Run ESLint
npm run prettier:fix # Auto-format all files
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, register, recovery, reset-password
│   │   ├── recovery/     # Solicitar reset — usa apiClient.forgotPassword()
│   │   └── reset-password/ # Confirmar reset — usa apiClient.resetPassword()
│   ├── (dashboard)/      # Protected routes (protección via layouts + Redux + JWT)
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── layout/           # Layout components
│   ├── providers/        # Redux, Auth, Theme providers
│   ├── shared/           # Shared components
│   └── ui/               # Reusable UI (Input, Button, etc.)
├── features/
│   └── landing/          # Landing page features
└── lib/
    ├── redux/
    │   ├── store.ts
    │   └── slices/authSlice.ts  # Auth thunks + selectors
    ├── api.ts                   # Custom API client + ApiError class
    └── roles.ts                 # Role type, UserRole, normalizeRole(), getRoleLabel()
```

## Path Aliases

`@/*` maps to `./src/*` — always use this for imports.

## Authentication

Implementado vía Redux Thunks en `src/lib/redux/slices/authSlice.ts`. Todo el flujo de autenticación consume el backend propio a través de `apiClient` (no Supabase):

- **Password auth:** `loginWithPassword()`, `signUpWithPassword()` (con metadata: full_name, phone, nit, role)
- **OTP auth:** `sendOtpToPhone()`, `verifyPhoneOtp()`
- **Reset de contraseña:** `recovery/page.tsx` llama `apiClient.forgotPassword({ email })`; `reset-password/page.tsx` llama `apiClient.resetPassword({ token, password })`
- **Sesión:** Tokens JWT almacenados en localStorage con auto-refresh; protección de rutas manejada por layouts con Redux
- **Registro atómico:** `registerAdminWithProperty()` ejecuta transacción backend: crea user + property + units (opcional) en una sola operación

Redux selectors: `selectIsAuthenticated`, `selectUser`, `selectUserRole`, `selectAuthStatus`, `selectAuthError`

Auth state shape:

```ts
{ isAuthenticated: boolean, user: User | null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null }
```

## Flujo de Registro (3 Pasos)

**Paso 1 — Tu cuenta:** fullName, email, phone (con selector de extensión + número), password, términos.
- Phone extension selector: custom dropdown con banderas reales (flagcdn.com) para 16 países + códigos telefónicos
- Al avanzar a Paso 2, el país se sincroniza automáticamente según la extensión seleccionada

**Paso 2 — Tu copropiedad:** complexName, NIT, address, country, city (selects dinámicos por país).
- Validación async de NIT (verifica duplicado en backend)
- Si validation error, redirige a Paso 2 con mensaje en campo NIT

**Paso 3 — Estructura física (opcional):** torres, pisos, aptos.
- Botón "Omitir y terminar" para crear propiedad sin torres (completar después desde `/admin/propiedad/torres`)
- Si error en towers, redirige a Paso 3 con mensaje en campo towers

Todo lo anterior se envía en **una sola llamada atómica** a backend: `registerAdminWithProperty()` ejecuta `prisma.$transaction()` → crea user + property + units (si aplica).

## Backend Integration

El frontend integra con el backend API (Railway) vía `src/lib/api.ts`. La URL base se configura con `NEXT_PUBLIC_API_URL`:

- **Auth Endpoints:** Register, login, refresh, logout, me, forgot-password, reset-password, OTP request/verify
- **Data Endpoints:** Properties, units, announcements, payments, uploads, zones, reservations
- **Token Management:** JWT tokens stored in localStorage with auto-refresh
- **Error Handling:** `ApiError` class with typed `kind`: `network | auth | client | server`
- **Imágenes:** Los campos `imageUrl` en zonas y documentos contienen `secure_url` de Cloudinary — nunca rutas locales `/api/uploads/...` para recursos nuevos

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PRIVATE_INALAMBRIA=<inalambria-api-key>
```

## Phone Extension Selector

Implementado como **custom dropdown** (no `<select>` nativo) para soportar banderas SVG. Ubicado en `(auth)/register/page.tsx`:

- **Datos:** Array `EXTENSIONES[]` con { value: '+57', label: 'Colombia', flag: 'co' } — 16 países
- **Render:** Button que muestra bandera (img via flagcdn.com/20x15/co.png) + código extension + chevron
- **Dropdown:** Lista con imágenes de banderas, nombre país, y código telefónico
- **Click outside:** useRef + useEffect cierra dropdown al hacer click fuera
- **Sync a país:** Al avanzar Paso 1 → Paso 2, se sincroniza country automáticamente vía `EXTENSION_TO_COUNTRY` mapping

## Key Conventions

- **Language:** UI text and user-facing strings are in **Spanish** (Latin American market)
- **Phone field:** Use `phone` (not `celular`) in database and auth metadata. Formato: `{extension} {number}` e.g. `+57 300 000 0000`
- **Roles:** `SUPER_ADMIN`, `ADMIN`, `RESIDENT` (canonical DB format — use `normalizeRole()` from `@/lib/roles.ts` to convert legacy/external strings)
- **Route groups:** `(auth)` for public auth pages, `(dashboard)` for protected pages
- **Imports:** Always use `@/` alias, never relative paths like `../../`
- **Banderas:** Usa flagcdn.com para imágenes SVG (20x15px estándar). Código ISO en minúsculas (e.g., 'co', 'mx', 'us')

## Development Notes

- Frontend desplegado en **Vercel**; backend desplegado en **Railway**
- El middleware de Next.js no usa Supabase — solo deja pasar las requests; la protección de rutas la manejan los layouts con Redux + JWT
- No `.env.example` file; configurar `NEXT_PUBLIC_API_URL` apuntando al backend
- Test OTP phone: `+573000000000` → code `123456`
- Minimum password length: 6 characters
