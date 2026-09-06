import Link from "next/link";

import {
  AuthDestination,
  AuthMessage,
} from "../../../components/auth/auth-frame";
import SubmitButton from "../../../components/auth/submit-button";
import { getSafeReturnPath } from "../../../lib/auth/redirects";
import { signInAction } from "../actions";

const errorMessages = {
  required: "Email and password are required.",
  invalid: "Unable to sign in with those credentials.",
};

export default async function SignInPage({ searchParams }) {
  const { error, reset, returnTo, verification } = await searchParams;
  const safeReturnPath = getSafeReturnPath(returnTo);
  const signUpQuery = new URLSearchParams({ returnTo: safeReturnPath });
  const errorMessage = errorMessages[error];

  return (
    <section className="auth-panel" aria-labelledby="sign-in-title">
      <div className="auth-panel__intro">
        <p className="auth-panel__eyebrow">Welcome back</p>
        <h1 id="sign-in-title">Sign in</h1>
        <p className="auth-panel__lead">
          Continue your learning path through the Boeing 737 MAX 8.
        </p>
      </div>

      <AuthDestination id="sign-in-destination" returnTo={safeReturnPath} />

      {errorMessage ? (
        <AuthMessage id="sign-in-error" variant="error">
          {errorMessage}
        </AuthMessage>
      ) : null}
      {reset === "complete" ? (
        <AuthMessage title="Password updated">
          Sign in with your new password.
        </AuthMessage>
      ) : null}
      {verification === "required" ? (
        <AuthMessage title="Check your email">
          Verify your account using the message we sent, then sign in to
          continue.
        </AuthMessage>
      ) : null}

      <form
        action={signInAction}
        aria-describedby={
          errorMessage
            ? "sign-in-error sign-in-destination"
            : "sign-in-destination"
        }
        className="auth-form"
      >
        <input name="returnTo" type="hidden" value={safeReturnPath} />
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
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Link className="auth-form__support-link" href="/auth/forgot-password">
          Forgot your password?
        </Link>
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </form>

      <p className="auth-panel__alternate">
        New to CockpitPath?{" "}
        <Link href={`/auth/sign-up?${signUpQuery}`}>Create an account</Link>
      </p>
      <p className="auth-panel__assurance">
        CockpitPath does not store a separate copy of your password.
      </p>
    </section>
  );
}
