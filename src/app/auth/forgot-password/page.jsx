import Link from "next/link";

import SubmitButton from "../../../components/auth/submit-button";
import { requestPasswordResetAction } from "../actions";

const errorMessages = {
  required: "Enter an email address.",
  failed: "Unable to request a reset right now. Please try again.",
};

export default async function ForgotPasswordPage({ searchParams }) {
  const { error, sent } = await searchParams;

  return (
    <main>
      <section className="auth-panel" aria-labelledby="forgot-password-title">
        <p className="auth-panel__eyebrow">Application authentication</p>
        <h1 id="forgot-password-title">Reset your password</h1>
        <p>
          Enter your email address. If an account can receive a reset message,
          Neon Auth will send one.
        </p>
        {errorMessages[error] ? (
          <p className="auth-message auth-message--error" role="alert">
            {errorMessages[error]}
          </p>
        ) : null}
        {sent === "1" ? (
          <p className="auth-message" role="status">
            If the account is eligible, a password-reset message has been sent.
          </p>
        ) : null}
        <form action={requestPasswordResetAction} className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <SubmitButton pendingLabel="Requesting reset…">
            Send reset link
          </SubmitButton>
        </form>
        <p>
          <Link href="/auth/sign-in">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
