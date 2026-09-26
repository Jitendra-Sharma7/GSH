"use server";

import { redirect } from "next/navigation";

import {
  authenticateUser,
  createSession,
  createUser,
  destroyAllSessions,
  destroySession,
} from "@/lib/auth";
import { recordActivity, recordLoginFailure } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const MAX_LOGIN_ATTEMPTS = 8;

/** Only allow same-site relative paths, so `?next=` cannot become an open redirect. */
function safeNextPath(next: string | undefined): string {
  if (!next) return "/admin/dashboard";
  if (!next.startsWith("/")) return "/admin/dashboard";
  // "//evil.com" and "/\evil.com" are protocol-relative URLs.
  if (next.startsWith("//") || next.startsWith("/\\")) return "/admin/dashboard";
  return next;
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "") || undefined);

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = "Email is required.";
  if (!password) fieldErrors.password = "Password is required.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const limit = await rateLimit(`login:${email}`, MAX_LOGIN_ATTEMPTS);
  if (!limit.allowed) {
    await recordLoginFailure(email, "rate limited");
    return {
      error: `Too many attempts. Try again in ${limit.retryAfter} seconds.`,
    };
  }

  const result = await authenticateUser(email, password);
  if (!result.ok || !result.user) {
    await recordLoginFailure(email, "invalid credentials");
    return { error: result.error ?? "Incorrect email or password." };
  }

  await createSession(result.user.id);
  await recordActivity({
    action: "auth.login",
    entityType: "Auth",
    entityId: result.user.id,
    summary: `${result.user.email} signed in`,
    actor: { id: result.user.id, email: result.user.email },
  });

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!password) fieldErrors.password = "Password is required.";
  else if (password.length < 8) fieldErrors.password = "Password must be at least 8 characters.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const limit = await rateLimit(`register:${email}`, 5);
  if (!limit.allowed) {
    return { error: `Too many attempts. Try again in ${limit.retryAfter} seconds.` };
  }

  const created = await createUser({ name, email, password });
  if (!created.ok) return { error: created.error ?? "Could not create the account." };

  redirect("/auth/login?registered=1");
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { getCurrentUser } = await import("@/lib/auth");
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in to change your password." };

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!current) fieldErrors.currentPassword = "Enter your current password.";
  if (next.length < 8) fieldErrors.newPassword = "Password must be at least 8 characters.";
  if (next !== confirm) fieldErrors.confirmPassword = "Passwords do not match.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { verifyPassword, hashPassword } = await import("@/lib/auth");
  const record = await prisma.user.findUnique({ where: { id: user.id } });
  if (!record?.password || !(await verifyPassword(current, record.password))) {
    return { error: "Your current password is incorrect." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(next) },
  });

  // Changing a password invalidates every other session for that account.
  await destroyAllSessions(user.id);
  await createSession(user.id);

  await recordActivity({
    action: "auth.password_change",
    entityType: "Auth",
    entityId: user.id,
    summary: `${user.email} changed their password`,
    actor: { id: user.id, email: user.email },
  });

  return {};
}
