"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import {
  idSchema,
  productFormSchema,
  productUpdateSchema,
  stockUpdateSchema,
} from "@/lib/validators";
import {
  assertProductImage,
  createProductImagePath,
  createSupabaseStorageAdminClient,
  getProductImageBucket,
} from "@/lib/supabase/storage";

type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type ProductManager = {
  id: string;
  role: "FARMER" | "ADMIN";
};

const productInclude = {
  category: true,
  farmer: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  images: {
    orderBy: {
      position: "asc" as const,
    },
  },
  inventory: true,
};

async function requireProductManager(): Promise<ProductManager> {
  try {
    const user = await getCurrentUser();
    console.log("[Auth] Session:", { userId: user?.id, role: user?.role });

    if (!user?.id) {
      throw new Error("You must be signed in to manage products.");
    }

    if (user.role !== "FARMER" && user.role !== "ADMIN") {
      throw new Error("Only farmers and admins can manage products.");
    }

    return {
      id: user.id,
      role: user.role,
    };
  } catch (error) {
    console.error("[Auth] Error in requireProductManager:", error);
    throw error;
  }
}

function getFormStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value))
    .filter(Boolean);
}

function getProductPayload(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
    imageUrls: getFormStringArray(formData, "imageUrls"),
    imagePaths: getFormStringArray(formData, "imagePaths"),
  };
}

function revalidateProductViews() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/buyer/dashboard");
  revalidatePath("/farmer/dashboard");
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the form fields.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export async function getCategories() {
  noStore();

  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getNewestProducts() {
  noStore();

  return prisma.product.findMany({
    include: productInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: 48,
  });
}

export async function getFarmerProducts(): Promise<ActionResult> {
  try {
    noStore();
    console.log("[Products] Fetching farmer products");

    const user = await requireProductManager();
    console.log("[Products] User verified:", { id: user.id, role: user.role });

    const products = await prisma.product.findMany({
      where: user.role === "ADMIN" ? undefined : { farmerId: user.id },
      include: productInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });

    console.log("[Products] Retrieved", products.length, "products");
    return { ok: true, data: products };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to load products.");
    console.error("[Products] Error fetching farmer products:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}

export async function uploadProductImages(
  formData: FormData,
): Promise<ActionResult<Array<{ url: string; path: string }>>> {
  try {
    console.log("[Upload] Starting image upload");
    const user = await requireProductManager();
    assertRateLimit(`upload:${user.id}`, { limit: 12, windowMs: 60_000 });

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

    console.log("[Upload] File count:", files.length);

    if (files.length === 0) {
      console.log("[Upload] No files to upload");
      return { ok: true, data: [] };
    }

    if (files.length > 8) {
      throw new Error("Upload up to 8 images per product.");
    }

    const supabase = createSupabaseStorageAdminClient();
    const bucket = getProductImageBucket();
    const uploadedImages = [];

    for (const file of files) {
      assertProductImage(file);

      const path = createProductImagePath(user.id, file);
      console.log("[Upload] Uploading file:", { name: file.name, path });
      
      const upload = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

      if (upload.error) {
        console.error("[Upload] Supabase error:", upload.error);
        throw new Error(upload.error.message);
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      uploadedImages.push({ url: data.publicUrl, path });
      console.log("[Upload] File uploaded successfully:", { url: data.publicUrl });
    }

    console.log("[Upload] All files uploaded:", uploadedImages.length);
    return { ok: true, data: uploadedImages };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to upload images.");
    console.error("[Upload] Error:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    console.log("[Create] Starting product creation");
    const user = await requireProductManager();
    assertRateLimit(`product:create:${user.id}`, {
      limit: 20,
      windowMs: 60_000,
    });

    const payload = productFormSchema.parse(getProductPayload(formData));
    console.log("[Create] Payload validated:", { title: payload.title, categoryId: payload.categoryId });

    if (payload.imageUrls.length !== payload.imagePaths.length) {
      throw new Error("Every product image needs a matching storage path.");
    }

    console.log("[Create] Creating product in database...");
    const product = await prisma.product.create({
      data: {
        title: payload.title,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        categoryId: payload.categoryId,
        farmerId: user.id,
        inventory: {
          create: {
            stock: payload.stock,
          },
        },
        images: {
          create: payload.imageUrls.map((url, position) => ({
            url,
            path: payload.imagePaths[position],
            alt: payload.title,
            position,
          })),
        },
      },
      include: productInclude,
    });

    console.log("[Create] Product created:", { id: product.id, title: product.title });
    revalidateProductViews();

    return { ok: true, data: product };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to create product.");
    console.error("[Create] Error:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  try {
    console.log("[Update] Starting product update");
    const user = await requireProductManager();
    assertRateLimit(`product:update:${user.id}`, {
      limit: 40,
      windowMs: 60_000,
    });

    const payload = productUpdateSchema.parse({
      id: formData.get("id"),
      ...getProductPayload(formData),
    });
    console.log("[Update] Payload validated:", { id: payload.id, title: payload.title });

    if (payload.imageUrls.length !== payload.imagePaths.length) {
      throw new Error("Every product image needs a matching storage path.");
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: payload.id },
      include: { images: true },
    });

    if (!existingProduct) {
      throw new Error("Product not found.");
    }

    if (user.role !== "ADMIN" && existingProduct.farmerId !== user.id) {
      throw new Error("You can only update your own products.");
    }

    const nextImagePaths = new Set(payload.imagePaths);
    const removedImagePaths = existingProduct.images
      .map((image) => image.path)
      .filter((path) => !nextImagePaths.has(path));

    console.log("[Update] Updating product in database...");
    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({
        where: { productId: payload.id },
      });

      return tx.product.update({
        where: { id: payload.id },
        data: {
          title: payload.title,
          description: payload.description,
          price: payload.price,
          stock: payload.stock,
          categoryId: payload.categoryId,
          inventory: {
            upsert: {
              create: {
                stock: payload.stock,
              },
              update: {
                stock: payload.stock,
              },
            },
          },
          images: {
            create: payload.imageUrls.map((url, position) => ({
              url,
              path: payload.imagePaths[position],
              alt: payload.title,
              position,
            })),
          },
        },
        include: productInclude,
      });
    });

    if (removedImagePaths.length > 0) {
      console.log("[Update] Removing", removedImagePaths.length, "old images from storage...");
      const supabase = createSupabaseStorageAdminClient();
      const removeResult = await supabase.storage
        .from(getProductImageBucket())
        .remove(removedImagePaths);
      if (removeResult.error) {
        console.warn("[Update] Error removing old images:", removeResult.error);
      } else {
        console.log("[Update] Old images removed successfully");
      }
    }

    console.log("[Update] Product updated:", { id: product.id });
    revalidateProductViews();

    return { ok: true, data: product };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to update product.");
    console.error("[Update] Error:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}

export async function updateProductStock(
  formData: FormData,
): Promise<ActionResult> {
  try {
    console.log("[Stock] Starting stock update");
    const user = await requireProductManager();
    assertRateLimit(`product:stock:${user.id}`, {
      limit: 80,
      windowMs: 60_000,
    });

    const payload = stockUpdateSchema.parse({
      productId: formData.get("productId"),
      stock: formData.get("stock"),
    });
    console.log("[Stock] Payload validated:", { productId: payload.productId, stock: payload.stock });

    const product = await prisma.product.findUnique({
      where: { id: payload.productId },
      select: { farmerId: true },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (user.role !== "ADMIN" && product.farmerId !== user.id) {
      throw new Error("You can only update your own product stock.");
    }

    console.log("[Stock] Updating stock in database...");
    const updatedProduct = await prisma.product.update({
      where: { id: payload.productId },
      data: {
        stock: payload.stock,
        inventory: {
          upsert: {
            create: {
              stock: payload.stock,
            },
            update: {
              stock: payload.stock,
            },
          },
        },
      },
      include: productInclude,
    });

    console.log("[Stock] Stock updated:", { productId: updatedProduct.id, stock: updatedProduct.stock });
    revalidateProductViews();

    return { ok: true, data: updatedProduct };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to update stock.");
    console.error("[Stock] Error:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}

export async function deleteProduct(formData: FormData): Promise<ActionResult> {
  try {
    console.log("[Delete] Starting product deletion");
    const user = await requireProductManager();
    assertRateLimit(`product:delete:${user.id}`, {
      limit: 20,
      windowMs: 60_000,
    });

    const productId = idSchema.parse(formData.get("productId"));
    console.log("[Delete] Product ID:", productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (user.role !== "ADMIN" && product.farmerId !== user.id) {
      throw new Error("You can only delete your own products.");
    }

    console.log("[Delete] Deleting product from database...");
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    console.log("[Delete] Product deleted:", deletedProduct.id);

    const imagePaths = product.images.map((image) => image.path);
    if (imagePaths.length > 0) {
      console.log("[Delete] Deleting", imagePaths.length, "images from storage...");
      const supabase = createSupabaseStorageAdminClient();
      const removeResult = await supabase.storage.from(getProductImageBucket()).remove(imagePaths);
      if (removeResult.error) {
        console.warn("[Delete] Error deleting images:", removeResult.error);
      } else {
        console.log("[Delete] Images deleted successfully");
      }
    }

    revalidateProductViews();

    return { ok: true, data: undefined };
  } catch (error) {
    const errorMsg = getActionErrorMessage(error, "Unable to delete product.");
    console.error("[Delete] Error:", error, "Message:", errorMsg);
    return {
      ok: false,
      error: errorMsg,
    };
  }
}
