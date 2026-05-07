"use server";

import { prisma } from "@/lib/prisma";
import { clearDemoSession, setDemoSession } from "@/lib/session";
import type { UserRole } from "@/stores/auth-store";

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export type CreateUserResponse =
  | {
      ok: true;
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        image: string | null;
      };
    }
  | {
      ok: false;
      error: string;
    };

type AuthUserResponse = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image: string | null;
};

export async function createOrUpdateUser(
  input: CreateUserInput
): Promise<CreateUserResponse> {
  try {
    console.log("[Auth] Creating/updating user:", { email: input.email, role: input.role });

    // Validate input
    if (!input.name?.trim()) {
      return { ok: false, error: "Name is required" };
    }

    if (!input.email?.trim()) {
      return { ok: false, error: "Email is required" };
    }

    if (!input.role || !["BUYER", "FARMER", "ADMIN"].includes(input.role)) {
      return { ok: false, error: "Invalid role selected" };
    }

    // Create or update user in database
    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: {
        name: input.name,
        role: input.role,
      },
      create: {
        name: input.name,
        email: input.email,
        role: input.role,
      },
    });

    console.log("[Auth] User created/updated successfully:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const responseUser: AuthUserResponse = {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      role: user.role ?? "BUYER",
      image: user.image,
    };

    await setDemoSession(responseUser);

    return {
      ok: true,
      user: responseUser,
    };
  } catch (error) {
    console.error("[Auth] Error in createOrUpdateUser:", error);
    const message = error instanceof Error ? error.message : "Failed to create user";
    return { ok: false, error: message };
  }
}

export async function getUser(email: string) {
  try {
    console.log("[Auth] Fetching user:", { email });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("[Auth] User not found:", { email });
      return null;
    }

    return {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      role: user.role ?? "BUYER",
      image: user.image,
    };
  } catch (error) {
    console.error("[Auth] Error in getUser:", error);
    return null;
  }
}

export async function logoutUser() {
  console.log("[Auth] User logged out");
  await clearDemoSession();
  return { ok: true };
}
