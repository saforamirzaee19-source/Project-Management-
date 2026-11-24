"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { AuthContext } from "./authContext.js";
import {
  registerAccount,
  updateAccount as saveAccountUpdates,
} from "../services/auth.js";

function AuthProvider({ children }) {
  const { data: session, status, update } = useSession();

  async function authenticate(email, password) {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      throw new Error("Email or password is incorrect.");
    }
  }

  async function createAccount(details) {
    const account = await registerAccount(details);
    await authenticate(account.email, details.password);
  }

  async function updateAccount(details) {
    await saveAccountUpdates(details);
    await update();
  }

  async function logOut() {
    await signOut({ redirect: false });
  }

  const value = {
    displayName: session?.user?.name ?? null,
    email: session?.user?.email ?? null,
    role: session?.user?.role ?? "user",
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    createAccount,
    signIn: authenticate,
    signOut: logOut,
    updateAccount,
    userId: session?.user?.id ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
