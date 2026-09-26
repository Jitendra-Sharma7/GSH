import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Password helpers and Prisma-backed user lookup.
 *
 * NOTE: this module is not currently wired into the app. The sign-in and
 * registration pages use a client-side mock (see `lib/store/useStore`), so no
 * request path calls these functions yet.
 *
 * There is deliberately no `createSession` helper here. An earlier version
 * returned a random token without persisting it, which produced a session
 * string that looked valid but authenticated nothing. When real sessions are
 * implemented, store the token server-side with an expiry and verify it on each
 * request rather than returning an unverifiable value.
 */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ id: string; name: string | null; email: string; role: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;
  const valid = await verifyPassword(password, user.password);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ id: string; name: string | null; email: string; role: string } | null> {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return null;
  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
