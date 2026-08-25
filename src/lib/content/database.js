import "server-only";

import pg from "pg";

let pool;

function getConnectionString() {
  const value = process.env.CONTENT_DATABASE_URL?.trim();
  if (!value) {
    throw new Error("CONTENT_DATABASE_URL is required for published content reads.");
  }
  return value;
}

export function getContentPool() {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: getConnectionString(),
      application_name: "cockpitpath-published-content",
      max: 5,
    });
  }
  return pool;
}

export async function queryPublished(text, values = []) {
  return getContentPool().query(text, values);
}
