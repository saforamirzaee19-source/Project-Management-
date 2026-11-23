"use client";

import { useState } from "react";
import { AuthContext } from "./authContext.js";
import {
  authenticateAccount,
  registerAccount,
  updateAccount as saveAccountUpdates,
} from "../services/auth.js";

const SESSION_STORAGE_KEY = "forma.authSession";

function readSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedSession) {
    return null;
  }

  try {
    const session = JSON.parse(savedSession);
    if (
      session &&
      session.version === 1 &&
      typeof session.email === "string" &&
      typeof session.userId === "string" &&
      typeof session.displayName === "string"
    ) {
      return session;
    }
  } catch {
    // Discard malformed persisted sessions before rendering protected routes.
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  return null;
}

function persistSession(account) {
  const nextSession = { ...account, version: 1 };
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(nextSession),
  );
  return nextSession;
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  async function signIn(email, password) {
    const account = await authenticateAccount(email, password);
    const nextSession = persistSession(account);
    setSession(nextSession);
  }

  async function createAccount(details) {
    const account = await registerAccount(details);
    const nextSession = persistSession(account);
    setSession(nextSession);
  }

  async function updateAccount(details) {
    const account = await saveAccountUpdates(session.userId, details);
    const nextSession = persistSession(account);
    setSession(nextSession);
  }

  function signOut() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }

  const value = {
    displayName: session?.displayName ?? null,
    email: session?.email ?? null,
    isAuthenticated: Boolean(session),
    createAccount,
    signIn,
    signOut,
    updateAccount,
    userId: session?.userId ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
