import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FormFieldError from "../components/FormFieldError.jsx";
import Header from "../components/Header.jsx";
import useAuth from "../contexts/useAuth.js";
import {
  getFieldErrors,
  signInFormSchema,
  signUpFormSchema,
} from "../validation/forms.js";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createAccount, isAuthenticated, signIn } = useAuth();
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedPath = location.state?.from;
  const destination =
    requestedPath?.pathname?.startsWith("/") &&
    !requestedPath.pathname.startsWith("//")
      ? `${requestedPath.pathname}${requestedPath.search || ""}${requestedPath.hash || ""}`
      : "/dashboard";

  if (isAuthenticated) {
    return <Navigate replace to={destination} />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = {
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const schema = isSigningUp ? signUpFormSchema : signInFormSchema;
    const result = schema.safeParse(formValues);

    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error.issues));
      setAuthError("");
      return;
    }

    setFieldErrors({});
    setAuthError("");
    setIsSubmitting(true);
    try {
      if (isSigningUp) {
        await createAccount(result.data);
      } else {
        await signIn(result.data.email, result.data.password);
      }
      navigate(destination, { replace: true });
    } catch (error) {
      setAuthError(
        `${isSigningUp ? "Couldn’t create account" : "Couldn’t sign in"}: ${error.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event) {
    const { name } = event.target;
    setAuthError("");
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  return (
    <main className="flex min-h-screen flex-col bg-white text-[#6B352A]">
      <Header page="signin" />

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border-2 border-[#6B352A] p-8 shadow-[8px_8px_0_#6B352A] sm:p-10">
          <p className="mb-4 w-fit rounded-full bg-[#FFF1A6] px-4 py-2 text-sm font-bold">
            {isSigningUp ? "Get started" : "Welcome back"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            {isSigningUp ? "Create your account" : "Sign in to Forma"}
          </h1>
          <p className="mt-3 leading-7">
            {isSigningUp
              ? "Create an account to start organizing your projects."
              : "Enter your details below to continue."}
          </p>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
            {isSigningUp && (
              <label className="block text-sm font-semibold">
                Name
                <input
                  className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                  type="text"
                  name="displayName"
                  autoComplete="name"
                  onChange={handleChange}
                  placeholder="Your name"
                  aria-describedby={
                    fieldErrors.displayName ? "signup-name-error" : undefined
                  }
                  aria-invalid={Boolean(fieldErrors.displayName)}
                />
                <FormFieldError
                  id="signup-name-error"
                  message={fieldErrors.displayName}
                />
              </label>
            )}
            <label className="block text-sm font-semibold">
              Email address
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="email"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                placeholder="you@example.com"
                aria-describedby={
                  fieldErrors.email ? "signin-email-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.email)}
              />
              <FormFieldError
                id="signin-email-error"
                message={fieldErrors.email}
              />
            </label>

            <label className="block text-sm font-semibold">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                type="password"
                name="password"
                autoComplete={isSigningUp ? "new-password" : "current-password"}
                onChange={handleChange}
                placeholder={isSigningUp ? "Create a password" : "Your password"}
                aria-describedby={
                  fieldErrors.password
                    ? "signin-password-error"
                    : "password-help"
                }
                aria-invalid={Boolean(fieldErrors.password)}
              />
            </label>
            <FormFieldError
              id="signin-password-error"
              message={fieldErrors.password}
            />
            <p id="password-help" className="-mt-3 text-xs">
              At least 8 characters, with an uppercase letter, a number, and a
              symbol.
            </p>

            {authError && (
              <p className="text-sm text-red-700" role="alert">
                {authError}
              </p>
            )}
            <button
              className="w-full rounded-full bg-[#6B352A] px-6 py-3 text-center font-semibold text-[#FFF1A6] disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "Please wait…"
                : isSigningUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            {isSigningUp ? "Already have an account?" : "New to Forma?"}{" "}
            <button
              className="font-semibold underline underline-offset-2"
              onClick={() => {
                setIsSigningUp((current) => !current);
                setFieldErrors({});
                setAuthError("");
              }}
              type="button"
            >
              {isSigningUp ? "Sign in" : "Create an account"}
            </button>
          </p>
          <p className="mt-4 text-xs leading-5">
            Demo accounts are stored in this browser only. Use a secure backend
            authentication service for production.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
