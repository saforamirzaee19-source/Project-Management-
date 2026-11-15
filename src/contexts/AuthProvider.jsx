import { useState } from "react";
import { AuthContext } from "./authContext.js";

const SESSION_STORAGE_KEY = "forma.authSession";
const USER_ID_STORAGE_KEY = "forma.userId";

function readSession() {
  const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedSession) {
    return null;
  }

  try {
    const session = JSON.parse(savedSession);
    if (
      session &&
      typeof session.email === "string" &&
      typeof session.userId === "string"
    ) {
      return session;
    }
  } catch {
    // Discard malformed persisted sessions before rendering protected routes.
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  return null;
}

function getUserId() {
  const savedUserId = window.localStorage.getItem(USER_ID_STORAGE_KEY);
  if (savedUserId) {
    return savedUserId;
  }

  const userId = `user-${window.crypto.randomUUID()}`;
  window.localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  return userId;
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  function signIn(email) {
    const nextSession = {
      email: email.trim().toLowerCase(),
      userId: getUserId(),
    };
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(nextSession),
    );
    setSession(nextSession);
  }

  function signOut() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }

  const value = {
    email: session?.email ?? null,
    isAuthenticated: Boolean(session),
    signIn,
    signOut,
    userId: session?.userId ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
