import Link from "next/link";

import ResetPasswordForm from "../../../components/auth/reset-password-form";

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;
  const usableToken = typeof token === "string" && token.length > 0;

  return (
    <main>
      <section className="auth-panel" aria-labelledby="reset-password-title">
        <p className="auth-panel__eyebrow">Application authentication</p>
        <h1 id="reset-password-title">Choose a new password</h1>
        {!usableToken ? (
          <p className="auth-message auth-message--error" role="alert">
            This password-reset link is missing or invalid.
          </p>
        ) : null}
        {usableToken ? <ResetPasswordForm token={token} /> : null}
        <p>
          <Link href="/auth/forgot-password">Request a new reset link</Link>
        </p>
      </section>
    </main>
  );
}
