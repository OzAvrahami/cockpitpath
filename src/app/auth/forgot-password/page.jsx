import Link from "next/link";

import { AuthMessage } from "../../../components/auth/auth-frame";
import SubmitButton from "../../../components/auth/submit-button";
import { requestPasswordResetAction } from "../actions";

const errorMessages = {
  required: "Enter an email address.",
  failed: "Unable to request a reset right now. Please try again.",
};

export default async function ForgotPasswordPage({ searchParams }) {
  const { error, sent } = await searchParams;
  const errorMessage = errorMessages[error];

  return (
    <section className="auth-panel" aria-labelledby="forgot-password-title">
      <div className="auth-panel__intro">
        <p className="auth-panel__eyebrow">Account access</p>
        <h1 id="forgot-password-title">Reset your password</h1>
        <p className="auth-panel__lead">
          Enter your email address and we will send reset instructions when the
          account is eligible.
        </p>
      </div>

      {errorMessage ? (
        <AuthMessage id="password-reset-error" variant="error">
          {errorMessage}
        </AuthMessage>
      ) : null}
      {sent === "1" ? (
        <AuthMessage title="Check your email">
          If the account is eligible, password-reset instructions have been
          sent.
        </AuthMessage>
      ) : null}

      <form
        action={requestPasswordResetAction}
        aria-describedby={errorMessage ? "password-reset-error" : undefined}
        className="auth-form"
      >
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
          />
        </div>
        <SubmitButton pendingLabel="Requesting reset…">
          Send reset link
        </SubmitButton>
      </form>

      <p className="auth-panel__alternate">
        Remembered your password?{" "}
        <Link href="/auth/sign-in">Back to sign in</Link>
      </p>
    </section>
  );
}
