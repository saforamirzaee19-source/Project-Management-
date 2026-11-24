import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { readDatabase } from "./app/api/_lib/db.js";

const ITERATIONS = 310000;

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256")
    .toString("hex");
}

function passwordsMatch(left, right) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const database = await readDatabase();
        const account = database.accounts?.find(
          (candidate) =>
            candidate.email === credentials.email.trim().toLowerCase(),
        );
        if (
          !account ||
          !passwordsMatch(
            account.passwordHash,
            hashPassword(credentials.password, account.passwordSalt),
          )
        ) {
          return null;
        }

        return {
          id: account.userId,
          name: account.displayName,
          email: account.email,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      if (!auth?.user) {
        const signInUrl = new URL("/signin", request.nextUrl);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return Response.redirect(signInUrl);
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
