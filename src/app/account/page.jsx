import { redirect } from "next/navigation";

import SubmitButton from "../../components/auth/submit-button";
import { signOutAction } from "../auth/actions";
import { auth } from "../../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }) {
  const { error } = await searchParams;
  const { data: sessionData } = await auth.getSession();

  if (!sessionData?.user) {
    redirect("/auth/sign-in");
  }

  const displayName = sessionData.user.name || sessionData.user.email;

  return (
    <main>
      <section className="auth-panel" aria-labelledby="account-title">
        <p className="auth-panel__eyebrow">Protected server route</p>
        <h1 id="account-title">Authenticated account</h1>
        {error === "sign-out" ? (
          <p className="auth-message auth-message--error" role="alert">
            Unable to sign out. Please try again.
          </p>
        ) : null}
        <p>Signed in as {displayName}.</p>
        <form action={signOutAction}>
          <SubmitButton pendingLabel="Signing out…">Sign out</SubmitButton>
        </form>
      </section>
    </main>
  );
}
