import { redirect } from "next/navigation";

import AppShell from "../../components/app/app-shell";
import { getSignInPath } from "../../lib/auth/redirects";
import { auth } from "../../lib/auth/server";

export const dynamic = "force-dynamic";

export default async function ApplicationLayout({ children }) {
  let sessionData;

  try {
    ({ data: sessionData } = await auth.getSession());
  } catch {
    sessionData = null;
  }

  if (!sessionData?.user) {
    redirect(getSignInPath("/app"));
  }

  return <AppShell>{children}</AppShell>;
}
