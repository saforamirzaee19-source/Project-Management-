import { useNavigate } from "react-router-dom";
import Header from "./Header.jsx";

function SignIn() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-[#6B352A]">
      <Header page="signin" />

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

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold">
              Email address
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*"
                title="Use at least 8 characters, including one uppercase letter, one number, and one symbol."
                aria-describedby="password-help"
                required
              />
            </label>
            <p id="password-help" className="-mt-3 text-xs">
              At least 8 characters, with an uppercase letter, a number, and a
              symbol.
            </p>

            <button
              className="w-full rounded-full bg-[#6B352A] px-6 py-3 text-center font-semibold text-[#FFF1A6]"
              type="submit"
            >
              Sign in
            </button>
          </form>

          <p className="mt-4 text-sm">
            This demo opens the dashboard after the form is valid.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
