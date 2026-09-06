"use client";

import { useActionState } from "react";

import { resetPasswordAction } from "../../app/auth/actions";
import { AuthMessage } from "./auth-frame";
import SubmitButton from "./submit-button";

const initialState = { error: null };

const errorMessages = {
  "invalid-link": "This password-reset link is missing or invalid.",
  required: "Enter and confirm a new password.",
  mismatch: "The password confirmation does not match.",
  failed: "Unable to reset the password. Request a new reset link and try again.",
};

export default function ResetPasswordForm({ token }) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);
  const message = errorMessages[state.error];

  return (
    <>
      {message ? (
        <AuthMessage id="new-password-error" variant="error">
          {message}
        </AuthMessage>
      ) : null}
      <form
        action={formAction}
        aria-describedby={message ? "new-password-error" : undefined}
        className="auth-form"
      >
        <input name="token" type="hidden" value={token} />
        <div className="auth-field">
          <label htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="auth-field">
          <label htmlFor="password-confirmation">Confirm new password</label>
          <input
            id="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <SubmitButton pendingLabel="Updating password…">
          Update password
        </SubmitButton>
      </form>
    </>
  );
}
