import { getPublicScholarships } from "@/lib/data/public";
import { DeadlineList } from "./DeadlineList";

/**
 * Server entry point. The calendar is read here and handed to the browser
 * component already sorted by closing date.
 */
export default async function DeadlinesPage() {
  const { data } = await getPublicScholarships({ limit: 50 });
  const sorted = data
    .filter((s) => s.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return <DeadlineList scholarships={sorted} />;
}
