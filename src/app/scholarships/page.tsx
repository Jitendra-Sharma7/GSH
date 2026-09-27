import { Suspense } from "react";
import { getPublicCountries, getPublicFields, getPublicScholarships } from "@/lib/data/public";
import { SCHOLARSHIP_PAGE_SIZE } from "@/lib/page-size";
import { ScholarshipsBrowser } from "./ScholarshipsBrowser";

/**
 * Server entry point. The filter options are read here and handed to the
 * browser component as props, so the page never asks the browser to fetch them.
 *
 * The first page of results is read here too, from the same `?query=`,
 * `?country=`, `?field=`, `?degree=` and `?funding=` parameters the browser
 * component will use. Fetching them in an effect instead left the served HTML
 * with nothing but loading skeletons, which meant a crawler without JavaScript
 * saw an empty results page.
 */
export default async function ScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };

  const filters = {
    query: one("query"),
    country: one("country"),
    field: one("field"),
    degree: one("degree"),
    funding: one("funding"),
  };

  const [countries, fields, initialResult] = await Promise.all([
    getPublicCountries(),
    getPublicFields(),
    getPublicScholarships({ ...filters, page: 1, limit: SCHOLARSHIP_PAGE_SIZE }),
  ]);

  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading scholarships...</div>}>
      <ScholarshipsBrowser
        countries={countries}
        fields={fields}
        initialResult={initialResult}
      />
    </Suspense>
  );
}
