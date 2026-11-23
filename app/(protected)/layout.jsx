"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../src/contexts/useAuth.js";

export default function ProtectedLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
