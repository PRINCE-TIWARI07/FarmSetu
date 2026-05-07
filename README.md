# FarmSetu

FarmSetu is a direct farm-to-consumer marketplace MVP built with Next.js App Router, Prisma, PostgreSQL, Supabase Storage, Supabase Realtime, Zustand, and Server Actions.

## Getting Started

Install dependencies and generate Prisma:

```bash
npm install
npm run db:generate
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for the Vercel, Supabase, Google OAuth, and demo-stability checklist.

## Core Scripts

- `npm run dev` - start local development
- `npm run build` - generate Prisma and build Next.js
- `npm run db:push` - push Prisma schema to the database
- `npm run db:seed` - seed marketplace categories
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint

## Demo Boundaries

Currently implemented foundations:

- Google auth foundation
- Product database schema
- Product CRUD server actions
- Supabase Storage helpers
- Supabase Realtime setup SQL
- Production error/loading/protected-route scaffolding
