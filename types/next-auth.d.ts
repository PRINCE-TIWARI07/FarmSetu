import type { DefaultSession } from "next-auth";

type UserRole = "BUYER" | "FARMER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: UserRole | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole | null;
  }
}
