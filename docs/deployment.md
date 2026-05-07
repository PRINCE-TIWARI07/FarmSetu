# FarmSetu Production Deployment Guide

This guide is optimized for a stable hackathon demo on Vercel with Supabase Postgres, Storage, and Realtime.

## 1. Local Production Check

Run these before deploying:

```bash
npm install
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

Or run the combined production gate:

```bash
npm run check:prod
```

For the final judging runbook, also use [final-demo-checklist.md](final-demo-checklist.md).

## 2. Required Environment Variables

Set these in Vercel Project Settings:

```bash
NEXT_PUBLIC_APP_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"

AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_SECRET="same-value-as-auth-secret-for-compatibility"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
SUPABASE_STORAGE_BUCKET="product-images"

DATABASE_URL="your-supabase-pooled-postgres-url"
DIRECT_URL="your-supabase-direct-postgres-url"

RAZORPAY_KEY_ID="your-razorpay-key-id-if-payment-routes-are-present"
RAZORPAY_KEY_SECRET="your-razorpay-secret-if-payment-routes-are-present"
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

## 3. Google OAuth Setup

In Google Cloud Console, add these authorized redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

## 4. Supabase Setup

Run the database schema for first setup or schema sync:

```bash
npm run db:push
npm run db:seed
```

For production migrations, prefer:

```bash
npx prisma migrate deploy
npm run db:seed
```

In Supabase SQL Editor, run:

```sql
-- supabase/storage-setup.sql
```

Then run:

```sql
-- supabase/realtime-setup.sql
```

Confirm:

- `product-images` bucket exists and is public.
- `Product`, `ProductImage`, and `Inventory` are added to Realtime publication.
- The service role key is never exposed to the browser.

## 5. Vercel Deployment

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

Useful production commands:

```bash
vercel env pull .env.production.local
npm run db:generate
npm run build
npx prisma migrate deploy
```

Use these Vercel settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave default
- Node.js version: project default unless Vercel reports a package mismatch

The repository includes `vercel.json` with the build and install commands for predictable deployments.

## 6. Demo Stability Checklist

Before judging:

- Open the production URL in a fresh browser profile.
- Sign in with Google.
- Confirm `/dashboard` redirects by role.
- Confirm protected routes redirect unauthenticated users to `/login`.
- Confirm categories exist in the database.
- Confirm product image upload works against Supabase Storage.
- Confirm product tables are enabled for Realtime.
- Confirm realtime subscriptions do not duplicate after navigating away and back.
- Confirm the browser console has no hydration, auth, or Supabase channel errors.
- Keep Supabase SQL Editor open for emergency role/product edits.

## 7. Feature-Flow Validation

Validate these only when the corresponding routes/models exist in the deployed branch:

- Orders
- Checkout
- Payments
- Delivery tracking
- Notifications

For this repository snapshot, the implemented production-critical surface is auth, role routing, product schema/actions, Supabase Storage setup, Supabase Realtime setup for product tables, and polished fallback/dashboard shells.
