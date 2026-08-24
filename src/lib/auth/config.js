const MINIMUM_COOKIE_SECRET_LENGTH = 32;

function requireEnvironmentValue(environment, name) {
  const value = environment[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getAuthConfig(environment = process.env) {
  const baseUrl = requireEnvironmentValue(environment, "NEON_AUTH_BASE_URL");
  const cookieSecret = requireEnvironmentValue(
    environment,
    "NEON_AUTH_COOKIE_SECRET",
  );

  let parsedBaseUrl;

  try {
    parsedBaseUrl = new URL(baseUrl);
  } catch {
    throw new Error("NEON_AUTH_BASE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedBaseUrl.protocol)) {
    throw new Error("NEON_AUTH_BASE_URL must use HTTP or HTTPS.");
  }

  if (cookieSecret.length < MINIMUM_COOKIE_SECRET_LENGTH) {
    throw new Error(
      `NEON_AUTH_COOKIE_SECRET must be at least ${MINIMUM_COOKIE_SECRET_LENGTH} characters.`,
    );
  }

  return { baseUrl, cookieSecret };
}
