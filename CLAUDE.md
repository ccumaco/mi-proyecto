# CLAUDE.md

## Project Overview

**PropAdmin PRO** — A property/community management platform for residential administrators in Spanish-speaking markets. Built with Next.js, TypeScript, and Supabase.

**Note:** This is a project-specific documentation. For full-stack overview, API contracts, and shared types, see the root [CLAUDE.MD](../CLAUDE.MD).

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16 (App Router)               |
| Language  | TypeScript 5 (strict)                 |
| Styling   | Tailwind CSS 4 + PostCSS              |
| Icons     | Font Awesome 7 (SVG)                  |
| State     | Redux Toolkit 2                       |
| Auth/DB   | Supabase (PostgreSQL, Auth, Realtime) |
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
│   ├── (dashboard)/      # Protected routes
│   ├── auth/callback/    # OAuth callback handler
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
    ├── supabase.ts              # Browser client
    ├── supabase/server.ts       # Server-side client (SSR + cookies)
    └── api.ts                   # Custom API client for backend integration
supabase/
├── config.toml           # Local dev config
└── migrations/           # SQL migration files
```

## Path Aliases

`@/*` maps to `./src/*` — always use this for imports.

## Database Schema

Key tables (all with RLS enabled):

- **profiles** — User profiles, linked to `auth.users`. Fields: `id`, `email`, `full_name`, `display_name`, `phone`, `nit`, `role`
- **properties** — Residential complexes. Fields: `name`, `nit`, `address`, `country`, `city`, `units_count`, `admin_id`
- **units** — Apartments/units. Fields: `unit_number`, `block`, `property_id`, `resident_id`
- **announcements** — Community announcements. Fields: `title`, `content`, `author_id`, `type`
- **payments** — Payment tracking. Fields: `unit_id`, `amount`, `status`, `payment_period`

The `handle_new_user()` trigger auto-creates a profile row on signup, cleaning phone/nit data and handling ON CONFLICT.

## Authentication

Implemented via Redux Thunks in `src/lib/redux/slices/authSlice.ts`:

- **Password auth:** `loginWithPassword()`, `signUpWithPassword()` (with metadata: full_name, phone, nit, role)
- **OTP auth:** `sendOtpToEmail()`, `sendOtpToPhone()`, `verifyOtp()`, `verifyPhoneOtp()`
- **Session:** Server-side via SSR cookies; client-side via `createClientBrowser()`

Redux selectors: `selectIsAuthenticated`, `selectUser`, `selectUserRole`, `selectAuthStatus`, `selectAuthError`

Auth state shape:

```ts
{ isAuthenticated: boolean, user: User | null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null }
```

## Backend Integration

The frontend integrates with the backend API at `http://localhost:4000/api` via `src/lib/api.ts`:

- **Auth Endpoints:** Register, login, refresh, logout, me
- **Data Endpoints:** Properties, units, announcements, payments, uploads
- **Token Management:** JWT tokens stored in localStorage with auto-refresh

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Local Supabase ports: API `54321`, DB `54322`, Studio `54323`, Email `54324`.

## Key Conventions

- **Language:** UI text and user-facing strings are in **Spanish** (Latin American market)
- **Phone field:** Use `phone` (not `celular`) in database and auth metadata
- **Roles:** `admin`, `resident`, `super-admin`
- **Route groups:** `(auth)` for public auth pages, `(dashboard)` for protected pages
- **Migrations:** Place new SQL files in `supabase/migrations/` with timestamp prefix `YYYYMMDDHHMMSS_description.sql`
- **Imports:** Always use `@/` alias, never relative paths like `../../`

## Development Notes

- No CI/CD or production deployment configured yet — local development only
- No `.env.example` file; use the local Supabase dev keys above
- Test OTP phone: `+573000000000` → code `123456` (configured in supabase/config.toml)
- Email confirmations are **disabled** in local Supabase config
- Minimum password length: 6 characters
