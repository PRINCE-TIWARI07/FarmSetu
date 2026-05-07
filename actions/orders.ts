"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { createOrderSchema, idSchema, trackingUpdateSchema } from "@/lib/validators";

type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const orderInclude = {
  items: {
    include: {
      product: {
        include: {
          farmer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          images: {
            orderBy: {
              position: "asc" as const,
            },
            take: 1,
          },
        },
      },
    },
  },
  payment: true,
  tracking: {
    orderBy: {
      createdAt: "desc" as const,
    },
  },
};

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the submitted fields.";
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

function revalidateOrderViews() {
  revalidatePath("/dashboard");
  revalidatePath("/buyer/dashboard");
  revalidatePath("/farmer/dashboard");
  revalidatePath("/admin/dashboard");
}

export async function getMyOrders(): Promise<ActionResult> {
  try {
    noStore();
    const user = await requireUser();

    const orders = await prisma.order.findMany({
      where: user.role === "ADMIN" ? undefined : { buyerId: user.id },
      include: orderInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { ok: true, data: orders };
  } catch (error) {
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to load orders."),
    };
  }
}

export async function createOrder(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();

    if (user.role !== "BUYER" && user.role !== "ADMIN") {
      throw new Error("Only buyers can place orders.");
    }

    assertRateLimit(`order:create:${user.id}`, {
      limit: 20,
      windowMs: 60_000,
    });

    const payload = createOrderSchema.parse(input);
    const productIds = [...new Set(payload.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        farmerId: true,
      },
    });
    const productsById = new Map(products.map((product) => [product.id, product]));

    for (const item of payload.items) {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error("One or more products were not found.");
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.title} has only ${product.stock} item(s) in stock.`);
      }
    }

    const totalAmount = payload.items.reduce((sum, item) => {
      const product = productsById.get(item.productId);
      return sum + Number(product?.price ?? 0) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of payload.items) {
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error("Stock changed while placing the order. Please refresh and try again.");
        }

        await tx.inventory.updateMany({
          where: {
            productId: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          buyerId: user.id,
          totalAmount,
          items: {
            create: payload.items.map((item) => {
              const product = productsById.get(item.productId);

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: Number(product?.price ?? 0),
              };
            }),
          },
          payment: {
            create: {
              amount: totalAmount,
            },
          },
          tracking: {
            create: {
              status: "PENDING",
              message: "Order created and awaiting payment.",
            },
          },
        },
        include: orderInclude,
      });

      const farmerIds = [
        ...new Set(
          payload.items
            .map((item) => productsById.get(item.productId)?.farmerId)
            .filter((id): id is string => Boolean(id)),
        ),
      ];

      if (farmerIds.length > 0) {
        await tx.notification.createMany({
          data: farmerIds.map((farmerId) => ({
            userId: farmerId,
            title: "New order received",
            message: "A buyer placed an order containing one of your products.",
          })),
        });
      }

      return createdOrder;
    });

    revalidateOrderViews();
    return { ok: true, data: order };
  } catch (error) {
    console.error("[Orders] Create order failed:", error);
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to create order."),
    };
  }
}

export async function updateOrderTracking(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();

    if (user.role !== "FARMER" && user.role !== "ADMIN") {
      throw new Error("Only farmers and admins can update tracking.");
    }

    const payload = trackingUpdateSchema.parse(input);
    const order = await prisma.order.findUnique({
      where: {
        id: payload.orderId,
      },
      include: {
        items: {
          select: {
            product: {
              select: {
                farmerId: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    const ownsOrderItem = order.items.some((item) => item.product.farmerId === user.id);

    if (user.role !== "ADMIN" && !ownsOrderItem) {
      throw new Error("You can only update tracking for your own orders.");
    }

    const tracking = await prisma.tracking.create({
      data: {
        orderId: payload.orderId,
        status: payload.status,
        message: payload.message,
      },
    });

    await prisma.notification.create({
      data: {
        userId: order.buyerId,
        title: "Order update",
        message: payload.message,
      },
    });

    revalidateOrderViews();
    return { ok: true, data: tracking };
  } catch (error) {
    console.error("[Orders] Tracking update failed:", error);
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to update tracking."),
    };
  }
}

export async function cancelOrder(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const orderId = idSchema.parse(input);
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    if (user.role !== "ADMIN" && order.buyerId !== user.id) {
      throw new Error("You can only cancel your own orders.");
    }

    if (order.payment?.status === "PAID") {
      throw new Error("Paid orders cannot be cancelled from this demo flow.");
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });

        await tx.inventory.updateMany({
          where: {
            productId: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
          tracking: {
            create: {
              status: "CANCELLED",
              message: "Order cancelled and stock restored.",
            },
          },
        },
        include: orderInclude,
      });
    });

    revalidateOrderViews();
    return { ok: true, data: cancelledOrder };
  } catch (error) {
    console.error("[Orders] Cancel order failed:", error);
    return {
      ok: false,
      error: getActionErrorMessage(error, "Unable to cancel order."),
    };
  }
}
