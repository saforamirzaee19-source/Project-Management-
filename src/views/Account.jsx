"use client";

import { useState } from "react";
import Link from "next/link";
import FormFieldError from "../components/FormFieldError.jsx";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import useAuth from "../contexts/useAuth.js";
import {
  accountUpdateFormSchema,
  getFieldErrors,
} from "../validation/forms.js";

function Account() {
  const { displayName, email, updateAccount } = useAuth();
  const [form, setForm] = useState({
    displayName,
    email,
    currentPassword: "",
    newPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = accountUpdateFormSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error.issues));
      setFormError("");
      return;
    }

    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");
    setSaving(true);
    try {
      await updateAccount(result.data);
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
      }));
      setSuccessMessage("Your account has been updated.");
    } catch (error) {
      setFormError(`Couldn’t update your account: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />
      <div className="min-w-0 md:ml-60">
        <Header page="account" />
        <main className="p-6 md:p-8">
          <Link
            className="font-semibold underline underline-offset-4"
            href="/dashboard"
          >
            ← Dashboard
          </Link>
          <section className="mt-6 max-w-2xl rounded-2xl border border-[#6B352A]/15 bg-white p-5 md:p-8">
            <h2 className="text-2xl font-bold">Account settings</h2>
            <p className="mt-2 text-sm leading-6">
              Update your name or email, or choose a new password. Confirm
              changes with your current password.
            </p>

            <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold">
                Name
                <input
                  autoComplete="name"
                  className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                  name="displayName"
                  onChange={handleChange}
                  value={form.displayName}
                  aria-describedby={
                    fieldErrors.displayName ? "account-name-error" : undefined
                  }
                  aria-invalid={Boolean(fieldErrors.displayName)}
                />
                <FormFieldError
                  id="account-name-error"
                  message={fieldErrors.displayName}
                />
              </label>

              <label className="block text-sm font-semibold">
                Email address
                <input
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={form.email}
                  aria-describedby={
                    fieldErrors.email ? "account-email-error" : undefined
                  }
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                <FormFieldError
                  id="account-email-error"
                  message={fieldErrors.email}
                />
              </label>

              <label className="block text-sm font-semibold">
                Current password
                <input
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                  name="currentPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.currentPassword}
                  aria-describedby={
                    fieldErrors.currentPassword
                      ? "account-current-password-error"
                      : undefined
                  }
                  aria-invalid={Boolean(fieldErrors.currentPassword)}
                />
                <FormFieldError
                  id="account-current-password-error"
                  message={fieldErrors.currentPassword}
                />
              </label>

              <label className="block text-sm font-semibold">
                New password
                <input
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                  name="newPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.newPassword}
                  aria-describedby={
                    fieldErrors.newPassword
                      ? "account-new-password-error"
                      : "account-password-help"
                  }
                  aria-invalid={Boolean(fieldErrors.newPassword)}
                />
                <FormFieldError
                  id="account-new-password-error"
                  message={fieldErrors.newPassword}
                />
              </label>
              <p id="account-password-help" className="-mt-3 text-xs">
                Leave blank to keep your password. New passwords need at least
                8 characters, including an uppercase letter, a number, and a
                symbol.
              </p>

              {formError && (
                <p className="text-sm text-red-700" role="alert">
                  {formError}
                </p>
              )}
              {successMessage && (
                <p className="text-sm text-green-800" role="status">
                  {successMessage}
                </p>
              )}
              <button
                className="rounded-full bg-[#6B352A] px-6 py-3 font-semibold text-[#FFF1A6] disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving…" : "Save account"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Account;
