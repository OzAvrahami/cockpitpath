import Link from "next/link";

import {
  AuthDestination,
  AuthMessage,
} from "../../../components/auth/auth-frame";
import SubmitButton from "../../../components/auth/submit-button";
import {
  getSafeReturnPath,
  getSignInPath,
} from "../../../lib/auth/redirects";
import { signUpAction } from "../actions";

const errorMessages = {
  required: "Name, email, and password are required.",
  failed: "Unable to create the account. Check the details and try again.",
};

export default async function SignUpPage({ searchParams }) {
  const { error, returnTo } = await searchParams;
  const safeReturnPath = getSafeReturnPath(returnTo);
  const errorMessage = errorMessages[error];

  return (
    <section className="auth-panel" aria-labelledby="sign-up-title">
      <div className="auth-panel__intro">
        <p className="auth-panel__eyebrow">Start your learning path</p>
        <h1 id="sign-up-title">Create your account</h1>
        <p className="auth-panel__lead">
          Learn procedures, cockpit controls, and aircraft systems in one
          connected experience.
        </p>
      </div>

      <AuthDestination id="sign-up-destination" returnTo={safeReturnPath} />

      {errorMessage ? (
        <AuthMessage id="sign-up-error" variant="error">
          {errorMessage}
        </AuthMessage>
      ) : null}

      <form
        action={signUpAction}
        aria-describedby={
          errorMessage
            ? "sign-up-error sign-up-destination"
            : "sign-up-destination"
        }
        className="auth-form"
      >
        <input name="returnTo" type="hidden" value={safeReturnPath} />
        <div className="auth-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
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
            autoComplete="new-password"
            required
          />
        </div>
        <SubmitButton pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <p className="auth-panel__alternate">
        Already have an account?{" "}
        <Link href={getSignInPath(safeReturnPath)}>Sign in</Link>
      </p>
      <p className="auth-panel__assurance">
        If email verification is required, we will show you what to do next.
      </p>
    </section>
  );
}
