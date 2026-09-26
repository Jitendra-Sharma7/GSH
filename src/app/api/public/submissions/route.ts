import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { submissionFieldErrors, submissionSchema } from "@/lib/validations/submission";

/**
 * Public intake for community submissions.
 *
 * Anything sent here is an unverified claim, so it is stored as `PENDING` and
 * only ever surfaces in the admin inbox. Nothing submitted through this endpoint
 * can reach the public site without a human reviewing it.
 */

const MAX_PER_HOUR = 5;

export async function POST(request: Request) {
  const limit = await rateLimit("submission", MAX_PER_HOUR);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some details need fixing.", fieldErrors: submissionFieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // One open submission per email at a time: a repeat submission is almost
  // always a double submit rather than a second, distinct claim.
  const open = await prisma.submission.findFirst({
    where: {
      submitterEmail: data.submitterEmail,
      status: { in: ["PENDING", "UNDER_REVIEW"] },
      deletedAt: null,
    },
    select: { id: true },
  });
  if (open) {
    return NextResponse.json(
      { error: "You already have a submission awaiting review. We will be in touch." },
      { status: 409 }
    );
  }

  const created = await prisma.submission.create({
    data: {
      type: data.type,
      status: "PENDING",
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      payload: {
        title: data.title,
        description: data.description,
        officialUrl: data.officialUrl,
        countryName: data.countryName,
        deadline: data.deadline ? data.deadline.toISOString() : null,
        fundingAmount: data.fundingAmount,
        currency: data.currency,
        degreeLevels: data.degreeLevels,
      },
    },
    select: { id: true },
  });

  return NextResponse.json(
    { ok: true, id: created.id, message: "Thank you. Your submission is awaiting review." },
    { status: 201 }
  );
}
