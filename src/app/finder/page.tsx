import { getPublicCountries, getPublicFields } from "@/lib/data/public";
import { FinderQuestionnaire } from "./FinderQuestionnaire";

/**
 * Server entry point. The questionnaire's options come from published records,
 * read here and passed down, so an option an editor unpublishes disappears from
 * the form instead of silently never matching.
 */
export default async function ScholarshipFinderPage() {
  const [countries, fields] = await Promise.all([getPublicCountries(), getPublicFields()]);

  return <FinderQuestionnaire countries={countries} fields={fields} />;
}
