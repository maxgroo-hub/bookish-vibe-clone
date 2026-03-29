# LibraVault

A modern library management system built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Project Layout

The main application code lives in `bookish-vibes-main/`. The root directory contains Firebase hosting config (unused in Replit) and a root `package.json` for Firebase tools.

## Running the App

The workflow runs: `cd bookish-vibes-main && npm run dev`
The app is served on port 5000.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development server and build
- **Tailwind CSS** for styling
- **shadcn/ui** (Radix UI) for UI components
- **React Router v6** for routing
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Framer Motion** for animations
- **Supabase** for auth and PostgreSQL database

## Environment Variables Required

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon/public key
- `VITE_ADMIN_CODE` - (optional) Admin registration code, defaults to `LIBRAVAULT_ADMIN`

## Supabase Setup

Run SQL migrations in this order via the Supabase SQL editor:
1. `bookish-vibes-main/supabase/migrations/001_profiles.sql`
2. `bookish-vibes-main/supabase/migrations/002_library_tables.sql`

Also enable Google OAuth in Supabase Dashboard and configure redirect URLs.

## Deployment

Configured as a static site deployment:
- Build: `cd bookish-vibes-main && npm run build`
- Public dir: `bookish-vibes-main/dist`
