/**
 * Checks that no server-only code reached the browser bundle.
 *
 * The public API routes are deliberately absent from the frontend, so the only
 * way a component can get data is a server component or a server action. A
 * transitive value import of the database layer would defeat that silently: the
 * pages still work, the Prisma client just ships to the browser and throws on
 * first use, and the bundle grows by tens of kilobytes.
 *
 * That exact regression happened once, through a constants module that a client
 * component imported for its exported fallback values. This check makes it fail
 * loudly instead.
 *
 * Requires `npm run build` first.
 */
import fs from "node:fs";
import path from "node:path";

const CHUNKS = path.join(process.cwd(), ".next", "static", "chunks");

/** Markers that only appear when server-only code has been bundled for the browser. */
const FORBIDDEN = [
  { label: "the Prisma client", pattern: /PrismaClientKnownRequestError|has been bundled for the browser/ },
  { label: "a database connection string", pattern: /DATABASE_URL/ },
  { label: "bcrypt", pattern: /bcryptjs|\$2[aby]\$\d{2}\$/ },
  { label: "the session secret", pattern: /NEXTAUTH_SECRET/ },
];

if (!fs.existsSync(CHUNKS)) {
  console.error("No .next/static/chunks directory. Run `npm run build` first.");
  process.exit(2);
}

let failures = 0;
let scanned = 0;

for (const name of fs.readdirSync(CHUNKS)) {
  if (!name.endsWith(".js")) continue;
  const contents = fs.readFileSync(path.join(CHUNKS, name), "utf8");
  scanned += 1;

  for (const { label, pattern } of FORBIDDEN) {
    if (pattern.test(contents)) {
      failures += 1;
      console.log(`FAIL  ${name} contains ${label}`);
    }
  }
}

if (failures > 0) {
  console.log(
    `\n${failures} server-only leak(s) in the client bundle.\n` +
      "A client component is importing a value from a server module. Import types with\n" +
      "`import type`, or move the shared constants out of the server module."
  );
  process.exit(1);
}

console.log(`No server-only code in ${scanned} client chunk(s).`);
