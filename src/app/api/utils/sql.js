import { neon } from "@neondatabase/serverless";

// Neon connection. Vercel's Neon integration names the variable storage_DATABASE_URL.
const url = process.env.DATABASE_URL || process.env.storage_DATABASE_URL;

function missing() {
  throw new Error("DATABASE_URL has not been set");
}

const base = url ? neon(url) : null;

function sql(first, ...rest) {
  if (!base) return missing();
  return base(first, ...rest);
}

sql.transaction = (queries) => (base ? base.transaction(queries) : missing());

export default sql;
