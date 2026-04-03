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

Redux selectors: `selectIsAuthenticated`, `selectUser`, `selectUserRole`, `selectAuthStatus`, `selectAuthError`

Auth state shape:

```ts
{ isAuthenticated: boolean, user: User | null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null }
```

## Backend Integration

El frontend integra con el backend API (Railway) vía `src/lib/api.ts`. La URL base se configura con `NEXT_PUBLIC_API_URL`:

- **Auth Endpoints:** Register, login, refresh, logout, me, forgot-password, reset-password, OTP request/verify
- **Data Endpoints:** Properties, units, announcements, payments, uploads
- **Token Management:** JWT tokens stored in localStorage with auto-refresh
- **Error Handling:** `ApiError` class with typed `kind`: `network | auth | client | server`

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PRIVATE_INALAMBRIA=<inalambria-api-key>
```

## Key Conventions

- **Language:** UI text and user-facing strings are in **Spanish** (Latin American market)
- **Phone field:** Use `phone` (not `celular`) in database and auth metadata
- **Roles:** `SUPER_ADMIN`, `ADMIN`, `RESIDENT` (canonical DB format — use `normalizeRole()` from `@/lib/roles.ts` to convert legacy/external strings)
- **Route groups:** `(auth)` for public auth pages, `(dashboard)` for protected pages
- **Imports:** Always use `@/` alias, never relative paths like `../../`

## Development Notes

- Frontend desplegado en **Vercel**; backend desplegado en **Railway**
- El middleware de Next.js no usa Supabase — solo deja pasar las requests; la protección de rutas la manejan los layouts con Redux + JWT
- No `.env.example` file; configurar `NEXT_PUBLIC_API_URL` apuntando al backend
- Test OTP phone: `+573000000000` → code `123456`
- Minimum password length: 6 characters
