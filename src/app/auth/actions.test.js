import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: {
    signUp: { email: vi.fn() },
    signIn: { email: vi.fn() },
    signOut: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
  },
  redirectMock: vi.fn((path) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("../../lib/auth/server", () => ({ auth: authMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import {
  requestPasswordResetAction,
  resetPasswordAction,
  signInAction,
  signOutAction,
  signUpAction,
} from "./actions";

function formData(values) {
  const data = new FormData();

  for (const [name, value] of Object.entries(values)) {
    data.set(name, value);
  }

  return data;
}

describe("authentication server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs up through Neon Auth and uses only the fixed account redirect", async () => {
    authMock.signUp.email.mockResolvedValue({
      data: { token: "present-but-never-rendered" },
      error: null,
    });

    await expect(
      signUpAction(
        formData({
          name: "Test Learner",
          email: "learner@example.com",
          password: "not-a-real-password",
          returnTo: "https://attacker.example",
        }),
      ),
    ).rejects.toThrow("redirect:/account");

    expect(authMock.signUp.email).toHaveBeenCalledWith({
      name: "Test Learner",
      email: "learner@example.com",
      password: "not-a-real-password",
    });
    expect(redirectMock).toHaveBeenCalledWith("/account");
  });

  it("signs in through Neon Auth without accepting an arbitrary return URL", async () => {
    authMock.signIn.email.mockResolvedValue({ data: {}, error: null });

    await expect(
      signInAction(
        formData({
          email: "learner@example.com",
          password: "not-a-real-password",
          returnTo: "//attacker.example",
        }),
      ),
    ).rejects.toThrow("redirect:/account");

    expect(authMock.signIn.email).toHaveBeenCalledWith({
      email: "learner@example.com",
      password: "not-a-real-password",
    });
    expect(redirectMock).toHaveBeenCalledWith("/account");
  });

  it("returns a safe sign-in error without exposing the provider response", async () => {
    authMock.signIn.email.mockResolvedValue({
      data: null,
      error: { message: "sensitive provider detail" },
    });

    await expect(
      signInAction(
        formData({
          email: "learner@example.com",
          password: "not-a-real-password",
        }),
      ),
    ).rejects.toThrow("redirect:/auth/sign-in?error=invalid");
  });

  it("signs out through the SDK before returning to the public sign-in route", async () => {
    authMock.signOut.mockResolvedValue({ data: { success: true }, error: null });

    await expect(signOutAction()).rejects.toThrow("redirect:/auth/sign-in");

    expect(authMock.signOut).toHaveBeenCalledOnce();
    expect(redirectMock).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("does not claim sign-out succeeded when the provider rejects it", async () => {
    authMock.signOut.mockResolvedValue({
      data: null,
      error: { message: "sensitive provider detail" },
    });

    await expect(signOutAction()).rejects.toThrow(
      "redirect:/account?error=sign-out",
    );
  });

  it("requests password reset with the fixed local callback", async () => {
    authMock.requestPasswordReset.mockResolvedValue({
      data: { status: true },
      error: null,
    });

    await expect(
      requestPasswordResetAction(
        formData({ email: "learner@example.com" }),
      ),
    ).rejects.toThrow("redirect:/auth/forgot-password?sent=1");

    expect(authMock.requestPasswordReset).toHaveBeenCalledWith({
      email: "learner@example.com",
      redirectTo: "/auth/reset-password",
    });
  });

  it("submits matching reset credentials to the documented SDK method", async () => {
    authMock.resetPassword.mockResolvedValue({
      data: { status: true },
      error: null,
    });

    await expect(
      resetPasswordAction(
        {},
        formData({
          token: "one-time-reset-token",
          password: "new-development-password",
          passwordConfirmation: "new-development-password",
        }),
      ),
    ).rejects.toThrow("redirect:/auth/sign-in?reset=complete");

    expect(authMock.resetPassword).toHaveBeenCalledWith({
      token: "one-time-reset-token",
      newPassword: "new-development-password",
    });
  });

  it("keeps reset validation errors in action state without redirecting the token", async () => {
    const token = "one-time-reset-token";
    const result = await resetPasswordAction(
      {},
      formData({
        token,
        password: "new-development-password",
        passwordConfirmation: "different-development-password",
      }),
    );

    expect(result).toEqual({ error: "mismatch" });
    expect(JSON.stringify(result)).not.toContain(token);
    expect(authMock.resetPassword).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("keeps provider reset failures in action state without redirecting the token", async () => {
    const token = "one-time-reset-token";
    authMock.resetPassword.mockResolvedValue({
      data: null,
      error: { message: "sensitive provider detail" },
    });

    const result = await resetPasswordAction(
      {},
      formData({
        token,
        password: "new-development-password",
        passwordConfirmation: "new-development-password",
      }),
    );

    expect(result).toEqual({ error: "failed" });
    expect(JSON.stringify(result)).not.toContain(token);
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
