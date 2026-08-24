import Link from "next/link";

import SubmitButton from "../../../components/auth/submit-button";
import { signUpAction } from "../actions";

const errorMessages = {
  required: "Name, email, and password are required.",
  failed: "Unable to create the account. Check the details and try again.",
};

export default async function SignUpPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <main>
      <section className="auth-panel" aria-labelledby="sign-up-title">
        <p className="auth-panel__eyebrow">Application authentication</p>
        <h1 id="sign-up-title">Create an account</h1>
        {errorMessages[error] ? (
          <p className="auth-message auth-message--error" role="alert">
            {errorMessages[error]}
          </p>
        ) : null}
        <form action={signUpAction} className="auth-form">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <SubmitButton pendingLabel="Creating account…">
            Create account
          </SubmitButton>
        </form>
        <p>
          Already have an account? <Link href="/auth/sign-in">Sign in</Link>.
        </p>
      </section>
    </main>
  );
}
