# LibraVault

A modern library management system built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Project Structure

- `src/` - Main source code
  - `App.tsx` - Root component with routing and protected routes
  - `pages/` - Page components
    - `public/` - Landing, SignIn, SignUp, ResetPassword, AuthCallback
    - `dashboard/` - Member dashboard pages
    - `admin/` - Admin panel pages
  - `components/` - Reusable UI components
    - `auth/ProtectedRoute.tsx` - Role-based route guard
    - `layout/` - DashboardLayout, AdminLayout
  - `context/AuthContext.tsx` - Supabase session sync context
  - `hooks/useLibraryData.ts` - All TanStack Query data hooks (books, borrows, reservations, notifications, admin stats, members)
  - `store/index.ts` - Zustand auth + UI state
  - `lib/` - Utility functions
    - `supabase.ts` - Supabase client
    - `auth.ts` - Auth helper functions (signIn, signUp, Google, reset)
- `public/` - Static assets
- `supabase/migrations/` - SQL migration files

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development server and build
- **Tailwind CSS** for styling
- **shadcn/ui** (Radix UI) for UI components
- **React Router v6** for routing
- **TanStack Query** for data fetching
- **Zustand** for state management (persisted in localStorage)
- **Framer Motion** for animations
- **Recharts** for charts
- **React Hook Form** + Zod for forms
- **Supabase** for auth and database backend

## Authentication

Supabase powers all authentication:
- **Email/password** sign in and sign up
- **Google OAuth** (requires Google provider enabled in Supabase dashboard)
- **Password reset** via email link
- **Role-based access**: `member` (user dashboard) and `admin` (admin panel)
- **Guest login** still available for demo purposes
- Protected routes redirect unauthenticated users to `/signin`
- Admins trying to access `/dashboard` are redirected to `/admin` and vice versa

### Required Supabase Setup

1. Run `supabase/migrations/001_profiles.sql` in your Supabase SQL editor (profiles, triggers)
2. Run `supabase/migrations/002_library_tables.sql` in your Supabase SQL editor (books, borrows, reservations, notifications + RLS + seed data)
3. Enable Google OAuth in Supabase Dashboard → Authentication → Providers → Google
4. Add your site URL to Supabase Dashboard → Authentication → URL Configuration:
   - Site URL: your Replit dev domain
   - Redirect URLs: `https://<your-domain>/auth/callback`

### Admin Code

To register as admin, users must enter an admin code. Default: `LIBRAVAULT_ADMIN`
Override by setting the `VITE_ADMIN_CODE` secret.

## Environment Variables

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key
- `VITE_ADMIN_CODE` - (optional) Admin registration code, defaults to `LIBRAVAULT_ADMIN`

## Running the App

```bash
npm run dev
```

The app runs on port 5000.

## Build

```bash
npm run build
```
