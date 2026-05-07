# FarmSetu Production Debugging Checklist

Use this when the Vercel build or live demo behaves differently from local.

## Build Failures

Run locally:

```bash
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

If Prisma types are missing, confirm `prisma/schema.prisma` was generated with:

```bash
npm run db:generate
```

If Turbopack fails in a restricted terminal with an internal port error, rerun the build in a normal terminal or Vercel.

## Auth Failures

Check:

- `AUTH_SECRET` exists.
- `NEXTAUTH_SECRET` matches `AUTH_SECRET` if both are set.
- `NEXTAUTH_URL` matches the deployed URL.
- Google OAuth redirect URI is exactly `/api/auth/callback/google`.
- Vercel production URL is added in Google Cloud Console.

## Supabase Failures

Check:

- `DATABASE_URL` uses the pooled connection string for runtime.
- `DIRECT_URL` uses the direct connection string for migrations.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist for browser realtime.
- `SUPABASE_SERVICE_ROLE_KEY` exists only in server environments.
- `supabase/storage-setup.sql` has been run.
- `supabase/realtime-setup.sql` has been run.

## Realtime Failures

Check in Supabase:

- Realtime is enabled for the project.
- `Product`, `ProductImage`, and `Inventory` are in the `supabase_realtime` publication.
- The SQL setup has set `REPLICA IDENTITY FULL` for update/delete payloads.
- Browser console does not show duplicate channel warnings.
- Components clean up subscriptions when unmounted.

## Payment Failures

Only validate this if the payment routes exist in the deployed branch.

- `RAZORPAY_KEY_ID` is set.
- `RAZORPAY_KEY_SECRET` is set.
- Webhook secret is configured if webhook verification is implemented.
- Test mode and live mode keys are not mixed.
