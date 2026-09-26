import { Globe } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountriesBrowser } from "@/components/public/CountriesBrowser";
import { getPublicCountries } from "@/lib/data/public";

export default async function CountriesPage() {
  const countries = await getPublicCountries();

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <Globe className="h-3.5 w-3.5" />
            <span>Global Destinations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Scholarships by Destination Country
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Explore government and university scholarship programs across top higher-education hubs
            worldwide.
          </p>
        </div>

        <CountriesBrowser countries={countries} />
      </Container>
    </div>
  );
}
