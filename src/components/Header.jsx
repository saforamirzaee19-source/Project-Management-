"use client";

import Link from "next/link";
import useAuth from "../contexts/useAuth.js";

function Header({ page = "home" }) {
  const { displayName: accountName, email, isAuthenticated, signOut } = useAuth();
  const isWorkspacePage = [
    "account",
    "dashboard",
    "projects",
    "project",
    "tasks",
  ].includes(page);
  const displayName = accountName || email?.split("@")[0] || "there";
  const headerClass =
    isWorkspacePage
      ? "sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-[#6B352A]/15 bg-white px-6 py-5"
      : "mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6";

  return (
    <header className={headerClass}>
      <Link href="/" className="text-2xl font-bold tracking-tight" aria-label="Forma home">
        forma<span className="ml-1">.</span>
      </Link>

      {isWorkspacePage ? (
        <>
          <h1 className="order-3 w-full text-xl font-bold sm:order-none sm:w-auto">
            {page === "projects"
              ? "Projects"
              : page === "project"
                ? "Project details"
                : page === "tasks"
                  ? "My tasks"
                    : page === "account"
                      ? "Account"
                      : "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:inline">
                Welcome, {displayName}
            </span>
            <Link
                className="rounded-full border border-[#6B352A]/30 px-4 py-2 text-sm font-semibold transition hover:bg-[#FFF1A6]"
                href="/account"
            >
                Account
            </Link>
            <span className="flex size-10 items-center justify-center rounded-full bg-[#FFF1A6] font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <button
              className="rounded-full border border-[#6B352A]/30 px-4 py-2 text-sm font-semibold transition hover:bg-[#FFF1A6]"
              onClick={signOut}
              type="button"
            >
              Log out
            </button>
          </div>
        </>
      ) : page === "signin" ? (
        <Link
          href="/"
          className="text-sm font-semibold underline underline-offset-4"
        >
          Back to home
        </Link>
      ) : (
        <nav className="flex items-center gap-3">
          <Link
            href="/#features"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-block"
          >
            What it does
          </Link>
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-[#6B352A] px-5 py-2 text-sm font-semibold text-[#FFF1A6] transition hover:opacity-90"
            >
              Open dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="rounded-full bg-[#6B352A] px-5 py-2 text-sm font-semibold text-[#FFF1A6] transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export default Header;
