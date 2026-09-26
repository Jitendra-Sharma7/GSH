import { notFound } from "next/navigation";
import { databaseScholarships } from "@/lib/data/mock-scholarships";
import ScholarshipDetailsClient from "./ScholarshipDetailsClient";

interface ScholarshipPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Server component that validates the id before rendering.
 *
 * The detail view itself needs client state (save, compare, tracker), which
 * would make a missing scholarship return HTTP 200 with a "not found" message
 * rendered in the browser. Search engines treat that as a soft 404. Checking
 * here lets `notFound()` emit a real 404 status while keeping the interactive
 * parts client-side.
 */
export default async function ScholarshipDetailsPage({ params }: ScholarshipPageProps) {
  const { id } = await params;
  const exists = databaseScholarships.some((s) => s.id === id);

  if (!exists) notFound();

  return <ScholarshipDetailsClient />;
}
