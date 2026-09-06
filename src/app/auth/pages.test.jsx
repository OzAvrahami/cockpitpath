import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("./actions", () => ({
  requestPasswordResetAction: vi.fn(),
  resetPasswordAction: vi.fn(),
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
}));

import ForgotPasswordPage from "./forgot-password/page";
import ResetPasswordPage from "./reset-password/page";
import SignInPage from "./sign-in/page";
import SignUpPage from "./sign-up/page";

describe("authentication pages", () => {
  it("renders sign-in with accessible fields and a preserved safe destination", async () => {
    const markup = renderToStaticMarkup(
      await SignInPage({
        searchParams: Promise.resolve({ returnTo: "/learn/journey" }),
      }),
    );

    expect(markup).toContain('<h1 id="sign-in-title">Sign in</h1>');
    expect(markup).toContain('type="hidden" name="returnTo" value="/learn/journey"');
    expect(markup).toContain('type="email" autoComplete="email"');
    expect(markup).toContain('autoComplete="current-password"');
    expect(markup).toContain("Return to your learning session");
    expect(markup).toContain("/auth/sign-up?returnTo=%2Flearn%2Fjourney");
  });

  it("renders a designed verification and error state", async () => {
    const markup = renderToStaticMarkup(
      await SignInPage({
        searchParams: Promise.resolve({
          error: "invalid",
          verification: "required",
        }),
      }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Unable to sign in with those credentials.");
    expect(markup).toContain('role="status"');
    expect(markup).toContain("Check your email");
  });

  it("renders sign-up with password-manager fields and safe destination context", async () => {
    const markup = renderToStaticMarkup(
      await SignUpPage({
        searchParams: Promise.resolve({ returnTo: "/account" }),
      }),
    );

    expect(markup).toContain("Create your account");
    expect(markup).toContain('autoComplete="name"');
    expect(markup).toContain('autoComplete="email"');
    expect(markup).toContain('autoComplete="new-password"');
    expect(markup).toContain('value="/account"');
    expect(markup).toContain("/auth/sign-in?returnTo=%2Faccount");
  });

  it("renders the account-creation failure state accessibly", async () => {
    const markup = renderToStaticMarkup(
      await SignUpPage({
        searchParams: Promise.resolve({ error: "failed" }),
      }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Unable to create the account");
    expect(markup).toContain('aria-describedby="sign-up-error sign-up-destination"');
  });

  it("renders the existing request-sent and invalid-reset states", async () => {
    const requestMarkup = renderToStaticMarkup(
      await ForgotPasswordPage({ searchParams: Promise.resolve({ sent: "1" }) }),
    );
    const resetMarkup = renderToStaticMarkup(
      await ResetPasswordPage({ searchParams: Promise.resolve({}) }),
    );

    expect(requestMarkup).toContain("Check your email");
    expect(requestMarkup).toContain('autoComplete="email"');
    expect(resetMarkup).toContain('role="alert"');
    expect(resetMarkup).toContain("missing or invalid");
  });

  it("renders the existing valid reset form with accessible password fields", async () => {
    const markup = renderToStaticMarkup(
      await ResetPasswordPage({
        searchParams: Promise.resolve({ token: "one-time-token" }),
      }),
    );

    expect(markup).toContain('name="password"');
    expect(markup).toContain('name="passwordConfirmation"');
    expect(markup.match(/autoComplete="new-password"/g)).toHaveLength(2);
    expect(markup).toContain("Update password");
    expect(markup).not.toContain("one-time-token</");
  });
});
