import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  AUTH_GOOGLE_ID: z.string().min(1).optional(),
  AUTH_GOOGLE_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("product-images"),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
});

const productionEnvSchema = envSchema.superRefine((env, context) => {
  if (env.DATABASE_URL.includes("your-project-ref")) {
    context.addIssue({
      code: "custom",
      path: ["DATABASE_URL"],
      message: "DATABASE_URL still contains the Supabase placeholder project ref.",
    });
  }

  if (env.DIRECT_URL?.includes("your-project-ref")) {
    context.addIssue({
      code: "custom",
      path: ["DIRECT_URL"],
      message: "DIRECT_URL still contains the Supabase placeholder project ref.",
    });
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!env.AUTH_SECRET && !env.NEXTAUTH_SECRET) {
    context.addIssue({
      code: "custom",
      path: ["AUTH_SECRET"],
      message: "AUTH_SECRET or NEXTAUTH_SECRET is required in production.",
    });
  }
});

export function getEnv() {
  return productionEnvSchema.parse(process.env);
}
