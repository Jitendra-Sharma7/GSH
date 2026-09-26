import { GraduationCap } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { UniversitiesBrowser } from "@/components/public/UniversitiesBrowser";
import { getPublicUniversities } from "@/lib/data/public";

export default async function UniversitiesPage() {
  const universities = await getPublicUniversities();

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academic Institutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Global University Directory
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Explore world-renowned research universities and their dedicated international student
            scholarship schemes.
          </p>
        </div>

        <UniversitiesBrowser universities={universities} />
      </Container>
    </div>
  );
}
