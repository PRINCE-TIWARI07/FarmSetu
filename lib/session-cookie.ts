export type DemoUserRole = "BUYER" | "FARMER" | "ADMIN";

export const SESSION_COOKIE = "farmsetu_session";

const roles = new Set<DemoUserRole>(["BUYER", "FARMER", "ADMIN"]);

export function encodeSessionCookie(user: { id: string; role: DemoUserRole }) {
  return encodeURIComponent(
    JSON.stringify({
      id: user.id,
      role: user.role,
    }),
  );
}

export function parseSessionCookie(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as {
      id?: unknown;
      role?: unknown;
    };

    if (typeof parsed.id !== "string" || !roles.has(parsed.role as DemoUserRole)) {
      return null;
    }

    return {
      id: parsed.id,
      role: parsed.role as DemoUserRole,
    };
  } catch {
    return null;
  }
}

export function isDemoUserRole(role: unknown): role is DemoUserRole {
  return roles.has(role as DemoUserRole);
}
