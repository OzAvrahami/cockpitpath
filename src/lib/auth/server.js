import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

import { getAuthConfig } from "./config";

const { baseUrl, cookieSecret } = getAuthConfig();

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
  },
});
