import Link from "next/link";

import SubmitButton from "../../../components/auth/submit-button";
import { signInAction } from "../actions";

const errorMessages = {
  required: "Email and password are required.",
  invalid: "Unable to sign in with those credentials.",
};

export default async function SignInPage({ searchParams }) {
  const { error, reset, verification } = await searchParams;

  return (
    <main>
      <section className="auth-panel" aria-labelledby="sign-in-title">
        <p className="auth-panel__eyebrow">Application authentication</p>
        <h1 id="sign-in-title">Sign in</h1>
        {errorMessages[error] ? (
          <p className="auth-message auth-message--error" role="alert">
            {errorMessages[error]}
          </p>
        ) : null}
        {reset === "complete" ? (
          <p className="auth-message" role="status">
            Password updated. Sign in with your new password.
          </p>
        ) : null}
        {verification === "required" ? (
          <p className="auth-message" role="status">
            Check your email to verify the account before signing in.
          </p>
        ) : null}
        <form action={signInAction} className="auth-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
        </form>
        <p>
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </p>
        <p>
          Need an account? <Link href="/auth/sign-up">Create one</Link>.
        </p>
      </section>
    </main>
  );
}
