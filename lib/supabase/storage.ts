import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

export const PRODUCT_IMAGE_BUCKET = "product-images";
export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function createSupabaseStorageAdminClient() {
  const env = getEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for storage writes.");
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export function getProductImageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET ?? PRODUCT_IMAGE_BUCKET;
}

export function assertProductImage(file: File) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP product images are supported.");
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    throw new Error("Product images must be 5MB or smaller.");
  }
}

export function createProductImagePath(farmerId: string, file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "webp";
  const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "webp";
  const uniqueId = crypto.randomUUID();

  return `farmers/${farmerId}/${uniqueId}.${safeExtension}`;
}
