import { z } from "zod";

export const idSchema = z.string().min(1);
export const emailSchema = z.email();

export const productFormSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.coerce.number().positive().max(1_000_000),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  categoryId: idSchema,
  imageUrls: z.array(z.url()).max(8).default([]),
  imagePaths: z.array(z.string().min(1)).max(8).default([]),
});

export const productUpdateSchema = productFormSchema.extend({
  id: idSchema,
});

export const stockUpdateSchema = z.object({
  productId: idSchema,
  stock: z.coerce.number().int().min(0).max(1_000_000),
});

export const orderItemSchema = z.object({
  productId: idSchema,
  quantity: z.coerce.number().int().min(1).max(999),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(50),
});

export const razorpayVerificationSchema = z.object({
  orderId: idSchema,
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const trackingUpdateSchema = z.object({
  orderId: idSchema,
  status: z.string().trim().min(2).max(80),
  message: z.string().trim().min(2).max(500),
});
