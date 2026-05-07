# FarmSetu Final Demo Checklist

Use this before every hackathon judging run.

## 1. Local Quality Gate

```bash
npm run db:generate
npm run typecheck
npm run lint
npm run build
```

Shortcut:

```bash
npm run check:prod
```

If Turbopack cannot bind an internal worker port in a restricted terminal, rerun the build in a normal local terminal.

## 2. Responsive Audit

Check these widths in browser dev tools:

- 360px mobile
- 390px mobile
- 768px tablet
- 1024px tablet landscape
- 1440px desktop

Verify:

- Navbar menu opens and closes cleanly.
- No horizontal page overflow.
- Buttons remain at least 44px tall on touch screens.
- Dashboard metric cards stack cleanly.
- Dialogs fit within the viewport and scroll internally.
- Tables scroll horizontally inside their container.

## 3. Core Demo Flow

Run through the implemented pieces first:

- Home page loads quickly.
- Google login opens from `/login`.
- `/dashboard` redirects by role.
- Unauthenticated dashboard routes redirect to `/login`.
- Farmer/admin product server actions are protected.
- Product image storage bucket is reachable.
- Product database tables exist and categories are seeded.

Only demo these full marketplace flows after their UI/backend slices are present:

- Cart checkout
- Payment completion
- Order creation
- Farmer order management
- Tracking timeline
- Notification dropdown

## 4. Supabase Production Checklist

- `Product`, `ProductImage`, and `Inventory` are in the Realtime publication.
- `product-images` bucket exists.
- Bucket is public-read.
- Service role key is only in server/Vercel env vars.
- Seed categories exist: Fruits, Vegetables, Dairy, Grains, Organic.
- A test farmer user has role `FARMER`.
- A test buyer user has role `BUYER`.
- A test admin user has role `ADMIN`.

## 5. Vercel Environment Checklist

```bash
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=product-images
DATABASE_URL=
DIRECT_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## 6. Judge-Safe Recovery

If a demo action fails:

- Refresh once.
- Return to `/dashboard`.
- Use Supabase table editor to confirm role/product data.
- Keep `/login` and `/` open in separate tabs.
- Avoid live schema edits during judging.
