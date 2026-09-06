import Link from "next/link";

import { AuthMessage } from "../../../components/auth/auth-frame";
import ResetPasswordForm from "../../../components/auth/reset-password-form";

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;
  const usableToken = typeof token === "string" && token.length > 0;

  return (
    <section className="auth-panel" aria-labelledby="reset-password-title">
      <div className="auth-panel__intro">
        <p className="auth-panel__eyebrow">Account access</p>
        <h1 id="reset-password-title">Choose a new password</h1>
        <p className="auth-panel__lead">
          Set a new password, then return to your CockpitPath learning path.
        </p>
      </div>

      {!usableToken ? (
        <AuthMessage title="Request a new link" variant="error">
          This password-reset link is missing or invalid.
        </AuthMessage>
      ) : null}
      {usableToken ? <ResetPasswordForm token={token} /> : null}
      <p className="auth-panel__alternate">
        <Link href="/auth/forgot-password">Request a new reset link</Link>
      </p>
    </section>
  );
}
