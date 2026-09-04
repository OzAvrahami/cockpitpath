import { auth } from "./lib/auth/server";
import { getSafeReturnPath, getSignInPath } from "./lib/auth/redirects";

export function getProtectedReturnPath(request) {
  return getSafeReturnPath(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
}

export default function proxy(request) {
  const loginUrl = getSignInPath(getProtectedReturnPath(request));
  return auth.middleware({ loginUrl })(request);
}

export const config = {
  matcher: ["/account/:path*", "/app/:path*", "/learn/:path*"],
};
