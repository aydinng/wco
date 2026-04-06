import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAuthSecret } from "@/lib/auth-secret";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: getAuthSecret(),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Kullanıcı adı", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const u = credentials?.username;
        const p = credentials?.password;
        if (typeof u !== "string" || typeof p !== "string" || !u || !p) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { username: u } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(p, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          name: user.username,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  trustHost: true,
});
