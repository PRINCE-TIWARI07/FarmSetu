import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const userRoles = ["BUYER", "FARMER", "ADMIN"] as const;

function isUserRole(role: unknown): role is (typeof userRoles)[number] {
  return userRoles.includes(role as (typeof userRoles)[number]);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name ?? profile?.name ?? null,
          image: user.image ?? null,
        },
        create: {
          email: user.email,
          name: user.name ?? profile?.name ?? null,
          image: user.image ?? null,
        },
      });

      return true;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });

      if (!dbUser) {
        return token;
      }

      token.id = dbUser.id;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id;
        }

        session.user.role = isUserRole(token.role) ? token.role : null;
      }

      return session;
    },
  },
});
