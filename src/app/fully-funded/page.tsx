import type { Metadata } from "next";

import { getPublicScholarships } from "@/lib/data/public";
import { getSettingNumber } from "@/lib/settings";
import FullyFundedClient from "./FullyFundedClient";

export const metadata: Metadata = {
  title: "Fully Funded Scholarships",
  description:
    "Scholarships that cover tuition, living costs and more. Browse fully funded study opportunities worldwide.",
};

export const dynamic = "force-dynamic";

/**
 * /fully-funded
 *
 * Derived from the same rows as /scholarships: an admin marking a record
 * "fully funded" is all that is required for it to appear here. There is no
 * second dataset to keep in sync.
 */
export default async function FullyFundedPage() {
  const closingSoonDays = await getSettingNumber("scholarships.closingSoonDays", 14);

  const { data } = await getPublicScholarships(
    { fullyFunded: true, limit: 60, sort: "deadline" },
    closingSoonDays
  );

  return <FullyFundedClient scholarships={data} />;
}
