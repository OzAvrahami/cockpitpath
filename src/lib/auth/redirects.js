export const DEFAULT_AUTH_DESTINATION = "/app";

const ALLOWED_RETURN_ROOTS = ["/app", "/account", "/learn"];

function isAllowedPathname(pathname) {
  return ALLOWED_RETURN_ROOTS.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}

export function getSafeReturnPath(value, fallback = DEFAULT_AUTH_DESTINATION) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  try {
    const baseUrl = new URL("https://cockpitpath.invalid");
    const parsed = new URL(value, baseUrl);

    if (parsed.origin !== baseUrl.origin || !isAllowedPathname(parsed.pathname)) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function getSignInPath(returnTo = DEFAULT_AUTH_DESTINATION) {
  const safeReturnPath = getSafeReturnPath(returnTo);
  const query = new URLSearchParams({ returnTo: safeReturnPath });
  return `/auth/sign-in?${query}`;
}
