function SignIn() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-[#6B352A]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="text-2xl font-bold tracking-tight">
          forma.
        </a>
        <a
          href="/"
          className="text-sm font-semibold underline underline-offset-4"
        >
          Back to home
        </a>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border-2 border-[#6B352A] p-8 shadow-[8px_8px_0_#6B352A] sm:p-10">
          <p className="mb-4 w-fit rounded-full bg-[#FFF1A6] px-4 py-2 text-sm font-bold">
            Welcome back
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Sign in to Forma
          </h1>
          <p className="mt-3 leading-7">
            Enter your details below to continue.
          </p>

          <form className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">
              Email address
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="password"
                placeholder="Your password"
              />
            </label>

            <button
              className="w-full rounded-full bg-[#6B352A] px-6 py-3 font-semibold text-[#FFF1A6] opacity-60"
              type="button"
              disabled
            >
              Sign in
            </button>
          </form>

          <p className="mt-4 text-sm">
            Sign-in is a preview and is not connected yet.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
