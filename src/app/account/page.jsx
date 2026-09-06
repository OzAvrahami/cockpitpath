import Link from "next/link";
import { redirect } from "next/navigation";

import AppShell from "../../components/app/app-shell";
import SubmitButton from "../../components/auth/submit-button";
import { signOutAction } from "../auth/actions";
import { getSignInPath } from "../../lib/auth/redirects";
import { auth } from "../../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }) {
  const { error } = await searchParams;
  const { data: sessionData } = await auth.getSession();

  if (!sessionData?.user) {
    redirect(getSignInPath("/account"));
  }

  const name = sessionData.user.name;
  const email = sessionData.user.email;
  const displayName = name || email || "CockpitPath learner";

  return (
    <AppShell currentPage="account">
      <div className="account-page">
        <section className="account-page__intro" aria-labelledby="account-title">
          <p className="app-eyebrow">CockpitPath account</p>
          <h1 id="account-title">Your account</h1>
          <p>
            Review the identity connected to this learning session and move
            between CockpitPath destinations.
          </p>
        </section>

        {error === "sign-out" ? (
          <div className="account-page__message" role="alert">
            <strong>Sign-out did not complete.</strong>
            <p>Please try again.</p>
          </div>
        ) : null}

        <section className="account-details" aria-labelledby="account-details-title">
          <div>
            <p className="app-eyebrow">Current identity</p>
            <h2 id="account-details-title">Signed in as {displayName}</h2>
          </div>
          <dl>
            {name ? (
              <div>
                <dt>Name</dt>
                <dd>{name}</dd>
              </div>
            ) : null}
            {email ? (
              <div>
                <dt>Email</dt>
                <dd>{email}</dd>
              </div>
            ) : null}
            <div>
              <dt>Access</dt>
              <dd>Signed in</dd>
            </div>
          </dl>
        </section>

        <section className="account-actions" aria-labelledby="account-actions-title">
          <div>
            <p className="app-eyebrow">Navigation</p>
            <h2 id="account-actions-title">Continue from here</h2>
          </div>
          <div className="account-actions__controls">
            <Link className="public-button public-button--primary" href="/app">
              Open app <span aria-hidden="true">→</span>
            </Link>
            <Link className="public-button public-button--quiet" href="/">
              Public site
            </Link>
            <form action={signOutAction}>
              <SubmitButton pendingLabel="Signing out…">Sign out</SubmitButton>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
