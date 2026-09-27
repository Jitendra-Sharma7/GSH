import { Suspense } from "react";
import { getPublicCountries, getPublicFields } from "@/lib/data/public";
import { ScholarshipsBrowser } from "./ScholarshipsBrowser";

/**
 * Server entry point. The filter options are read here and handed to the
 * browser component as props, so the page never asks the browser to fetch them.
 */
export default async function ScholarshipsPage() {
  const [countries, fields] = await Promise.all([getPublicCountries(), getPublicFields()]);

  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading scholarships...</div>}>
      <ScholarshipsBrowser countries={countries} fields={fields} />
    </Suspense>
  );
}
