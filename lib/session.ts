import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  encodeSessionCookie,
  isDemoUserRole,
  parseSessionCookie,
  SESSION_COOKIE,
  type DemoUserRole,
} from "@/lib/session-cookie";

export type DemoSessionUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
  image: string | null;
};

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function setDemoSession(user: DemoSessionUser) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, encodeSessionCookie(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
    },
  });

  if (!user?.role || !isDemoUserRole(user.role)) {
    return null;
  }

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
      role: user.role,
    image: user.image,
  };
}

export { SESSION_COOKIE, parseSessionCookie };
