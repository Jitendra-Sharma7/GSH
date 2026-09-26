import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { getPublicScholarshipById } from "@/lib/data/public";
import { getSettingNumber } from "@/lib/settings";
import { resolveRedirect } from "@/lib/slug";
import ScholarshipDetailsClient from "./ScholarshipDetailsClient";

interface ScholarshipPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Scholarship detail.
 *
 * The record is resolved on the server and handed to the client component as
 * initial data. That means:
 *   - the page is indexed with real content instead of a loading spinner,
 *   - an unknown, draft or trashed id produces a true HTTP 404 rather than a
 *     soft 404 that search engines treat as a valid page.
 *
 * Only published, non-deleted rows resolve, so unpublished content cannot be
 * reached by guessing a URL.
 */
export async function generateMetadata({ params }: ScholarshipPageProps): Promise<Metadata> {
  const { id } = await params;
  const closingSoonDays = await getSettingNumber("scholarships.closingSoonDays", 14);
  const scholarship = await getPublicScholarshipById(id, closingSoonDays);

  if (!scholarship) return { title: "Scholarship not found", robots: { index: false } };

  const description =
    scholarship.shortDescription ??
    scholarship.description?.slice(0, 155) ??
    `Details, funding and application deadline for ${scholarship.title}.`;

  return {
    title: scholarship.seoTitle ?? scholarship.title,
    description,
    alternates: { canonical: `/scholarships/${scholarship.id}` },
    openGraph: {
      title: scholarship.seoTitle ?? scholarship.title,
      description,
      type: "article",
      url: `/scholarships/${scholarship.id}`,
      images: scholarship.coverImage ? [scholarship.coverImage] : undefined,
    },
  };
}

export default async function ScholarshipDetailsPage({ params }: ScholarshipPageProps) {
  const { id } = await params;
  const closingSoonDays = await getSettingNumber("scholarships.closingSoonDays", 14);

  const scholarship = await getPublicScholarshipById(id, closingSoonDays);

  if (!scholarship) {
    // The id may be a URL we have retired: an admin changing a published
    // scholarship's slug records a permanent redirect so inbound links survive.
    // Resolving it here keeps those links working instead of returning a 404.
    const target = await resolveRedirect(`/scholarships/${id}`);
    if (target) permanentRedirect(target);
    notFound();
  }

  return <ScholarshipDetailsClient initialScholarship={scholarship} />;
}
