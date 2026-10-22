// Single Vercel function that serves every /api route of the tracker.
import { ensureSchema } from "../src/app/api/utils/schema.js";
import * as r0 from "../src/app/api/deadlines/route.js";
import * as r1 from "../src/app/api/documents/route.js";
import * as r2 from "../src/app/api/flashcard-sets/route.js";
import * as r3 from "../src/app/api/flashcards/route.js";
import * as r4 from "../src/app/api/scheduled-tasks/route.js";
import * as r5 from "../src/app/api/settings/route.js";
import * as r6 from "../src/app/api/study-sessions/route.js";
import * as r7 from "../src/app/api/study-stats/route.js";
import * as r8 from "../src/app/api/subjects/route.js";
import * as r9 from "../src/app/api/tasks/route.js";
import * as r10 from "../src/app/api/deadlines/[id]/route.js";
import * as r11 from "../src/app/api/documents/[id]/route.js";
import * as r12 from "../src/app/api/flashcard-sets/[id]/route.js";
import * as r13 from "../src/app/api/flashcards/[id]/route.js";
import * as r14 from "../src/app/api/scheduled-tasks/[id]/route.js";
import * as r15 from "../src/app/api/study-sessions/[id]/route.js";
import * as r16 from "../src/app/api/tasks/[id]/route.js";

const routes = [
  { parts: ["deadlines"], mod: r0 },
  { parts: ["documents"], mod: r1 },
  { parts: ["flashcard-sets"], mod: r2 },
  { parts: ["flashcards"], mod: r3 },
  { parts: ["scheduled-tasks"], mod: r4 },
  { parts: ["settings"], mod: r5 },
  { parts: ["study-sessions"], mod: r6 },
  { parts: ["study-stats"], mod: r7 },
  { parts: ["subjects"], mod: r8 },
  { parts: ["tasks"], mod: r9 },
  { parts: ["deadlines", "[id]"], mod: r10 },
  { parts: ["documents", "[id]"], mod: r11 },
  { parts: ["flashcard-sets", "[id]"], mod: r12 },
  { parts: ["flashcards", "[id]"], mod: r13 },
  { parts: ["scheduled-tasks", "[id]"], mod: r14 },
  { parts: ["study-sessions", "[id]"], mod: r15 },
  { parts: ["tasks", "[id]"], mod: r16 },
];

function match(segments) {
  for (const r of routes) {
    if (r.parts.length !== segments.length) continue;
    const params = {};
    let ok = true;
    r.parts.forEach((p, i) => {
      if (p.startsWith("[") && p.endsWith("]")) params[p.slice(1, -1)] = decodeURIComponent(segments[i]);
      else if (p !== segments[i]) ok = false;
    });
    if (ok) return { mod: r.mod, params };
  }
  return null;
}

async function handle(request) {
  try {
    return await route(request);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

async function route(request) {
  const url = new URL(request.url);
  const path = (url.searchParams.get("__path") || url.pathname.replace(/^\/api\/?/, "")).replace(/\/+$/, "");
  url.searchParams.delete("__path");
  const segments = path ? path.split("/") : [];

  if (path === "auth/session") return Response.json(null);
  if (path === "upload") return Response.json({ error: "File uploads are not available on this version. Add a link instead." }, { status: 501 });

  const found = match(segments);
  if (!found) return Response.json({ error: "Not found" }, { status: 404 });
  const fn = found.mod[request.method];
  if (!fn) return Response.json({ error: "Method not allowed" }, { status: 405 });

  await ensureSchema();
  const init = { method: request.method, headers: request.headers };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }
  return fn(new Request(url.toString(), init), { params: found.params });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
