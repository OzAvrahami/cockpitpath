"use server";

import { redirect } from "next/navigation";

import { auth } from "../../lib/auth/server";

const ACCOUNT_PATH = "/account";
const SIGN_IN_PATH = "/auth/sign-in";

function textField(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function passwordField(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function authPage(path, parameter, value = "1") {
  const query = new URLSearchParams({ [parameter]: value });
  return `${path}?${query}`;
}

async function callAuth(operation) {
  try {
    return await operation();
  } catch {
    return { data: null, error: { code: "AUTH_UNAVAILABLE" } };
  }
}

export async function signUpAction(formData) {
  const name = textField(formData, "name");
  const email = textField(formData, "email");
  const password = passwordField(formData, "password");

  if (!name || !email || !password) {
    redirect(authPage("/auth/sign-up", "error", "required"));
  }

  const result = await callAuth(() =>
    auth.signUp.email({ name, email, password }),
  );

  if (result.error) {
    redirect(authPage("/auth/sign-up", "error", "failed"));
  }

  if (!result.data?.token) {
    redirect(authPage(SIGN_IN_PATH, "verification", "required"));
  }

  redirect(ACCOUNT_PATH);
}

export async function signInAction(formData) {
  const email = textField(formData, "email");
  const password = passwordField(formData, "password");

  if (!email || !password) {
    redirect(authPage(SIGN_IN_PATH, "error", "required"));
  }

  const result = await callAuth(() => auth.signIn.email({ email, password }));

  if (result.error) {
    redirect(authPage(SIGN_IN_PATH, "error", "invalid"));
  }

  redirect(ACCOUNT_PATH);
}

export async function signOutAction() {
  const result = await callAuth(() => auth.signOut());

  if (result.error) {
    redirect(authPage(ACCOUNT_PATH, "error", "sign-out"));
  }

  redirect(SIGN_IN_PATH);
}

export async function requestPasswordResetAction(formData) {
  const email = textField(formData, "email");

  if (!email) {
    redirect(authPage("/auth/forgot-password", "error", "required"));
  }

  const result = await callAuth(() =>
    auth.requestPasswordReset({
      email,
      redirectTo: "/auth/reset-password",
    }),
  );

  if (result.error) {
    redirect(authPage("/auth/forgot-password", "error", "failed"));
  }

  redirect(authPage("/auth/forgot-password", "sent"));
}

export async function resetPasswordAction(_previousState, formData) {
  const token = textField(formData, "token");
  const newPassword = passwordField(formData, "password");
  const confirmation = passwordField(formData, "passwordConfirmation");

  if (!token) {
    return { error: "invalid-link" };
  }

  if (!newPassword || newPassword !== confirmation) {
    return { error: newPassword ? "mismatch" : "required" };
  }

  const result = await callAuth(() =>
    auth.resetPassword({ token, newPassword }),
  );

  if (result.error) {
    return { error: "failed" };
  }

  redirect(authPage(SIGN_IN_PATH, "reset", "complete"));
}
