function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="/" className="text-2xl font-bold tracking-tight" aria-label="Forma home">
        forma<span className="ml-1">.</span>
      </a>
      <nav className="flex items-center gap-3">
        <a
          href="/#features"
          className="hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-block"
        >
          What it does
        </a>
        <a
          href="/signin"
          className="rounded-full bg-[#6B352A] px-5 py-2 text-sm font-semibold text-[#FFF1A6] transition hover:opacity-90"
        >
          Sign in
        </a>
      </nav>
    </header>
  );
}

export default Header;