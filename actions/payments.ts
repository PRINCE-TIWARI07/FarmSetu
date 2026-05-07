"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { getEnv } from "@/lib/env";
import { idSchema, razorpayVerificationSchema } from "@/lib/validators";

type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the payment fields.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  return user;
}

function revalidatePaymentViews() {
  revalidatePath("/dashboard");
  revalidatePath("/buyer/dashboard");
  revalidatePath("/farmer/dashboard");
  revalidatePath("/admin/dashboard");
}

function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}) {
  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function getPaymentStatus(orderIdInput: unknown): Promise<ActionResult> {
  try {
    noStore();
    const user = await requireUser();
    const orderId = idSchema.parse(orderIdInput);
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (user.role !== "ADMIN" && order.buyerId !== user.id) {
      throw new Error("You can only view your own payment status.");
    }

    return { ok: true, data: order.payment };
  } catch (error) {
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to load payment status."),
    };
  }
}

export async function createRazorpayOrder(orderIdInput: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const orderId = idSchema.parse(orderIdInput);
    const env = getEnv();

    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys are not configured.");
    }

    assertRateLimit(`payment:create:${user.id}`, {
      limit: 20,
      windowMs: 60_000,
    });

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (user.role !== "ADMIN" && order.buyerId !== user.id) {
      throw new Error("You can only pay for your own orders.");
    }

    if (order.status === "CANCELLED") {
      throw new Error("Cancelled orders cannot be paid.");
    }

    if (order.payment?.status === "PAID") {
      throw new Error("This order is already paid.");
    }

    if (order.razorpayOrderId) {
      return {
        ok: true,
        data: {
          razorpayOrderId: order.razorpayOrderId,
          keyId: env.RAZORPAY_KEY_ID,
          amount: Math.round(Number(order.totalAmount) * 100),
        },
      };
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(Number(order.totalAmount) * 100),
        currency: "INR",
        receipt: order.id,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to create Razorpay order.");
    }

    const razorpayOrder = (await response.json()) as { id?: string };

    if (!razorpayOrder.id) {
      throw new Error("Razorpay did not return an order id.");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        razorpayOrderId: razorpayOrder.id,
        payment: {
          upsert: {
            create: {
              amount: order.totalAmount,
              status: "CREATED",
              providerOrderId: razorpayOrder.id,
            },
            update: {
              status: "CREATED",
              providerOrderId: razorpayOrder.id,
            },
          },
        },
      },
    });

    revalidatePaymentViews();
    return {
      ok: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        keyId: env.RAZORPAY_KEY_ID,
        amount: Math.round(Number(order.totalAmount) * 100),
      },
    };
  } catch (error) {
    console.error("[Payments] Create Razorpay order failed:", error);
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to start payment."),
    };
  }
}

export async function verifyRazorpayPayment(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const payload = razorpayVerificationSchema.parse(input);
    const env = getEnv();

    if (!env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret is not configured.");
    }

    const order = await prisma.order.findUnique({
      where: {
        id: payload.orderId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (user.role !== "ADMIN" && order.buyerId !== user.id) {
      throw new Error("You can only verify payment for your own order.");
    }

    if (order.razorpayOrderId !== payload.razorpayOrderId) {
      throw new Error("Payment order id does not match.");
    }

    const isValid = verifyRazorpaySignature({
      orderId: payload.razorpayOrderId,
      paymentId: payload.razorpayPaymentId,
      signature: payload.razorpaySignature,
      secret: env.RAZORPAY_KEY_SECRET,
    });

    if (!isValid) {
      await prisma.payment.update({
        where: {
          orderId: order.id,
        },
        data: {
          status: "FAILED",
          providerPaymentId: payload.razorpayPaymentId,
          providerSignature: payload.razorpaySignature,
        },
      });

      throw new Error("Payment signature verification failed.");
    }

    const paidOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "PAID",
        payment: {
          upsert: {
            create: {
              amount: order.totalAmount,
              status: "PAID",
              providerOrderId: payload.razorpayOrderId,
              providerPaymentId: payload.razorpayPaymentId,
              providerSignature: payload.razorpaySignature,
            },
            update: {
              status: "PAID",
              providerOrderId: payload.razorpayOrderId,
              providerPaymentId: payload.razorpayPaymentId,
              providerSignature: payload.razorpaySignature,
            },
          },
        },
        tracking: {
          create: {
            status: "PAID",
            message: "Payment received successfully.",
          },
        },
      },
      include: {
        payment: true,
        tracking: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: "Payment successful",
        message: "Your FarmSetu payment was verified successfully.",
      },
    });

    revalidatePaymentViews();
    return { ok: true, data: paidOrder };
  } catch (error) {
    console.error("[Payments] Verify payment failed:", error);
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to verify payment."),
    };
  }
}
