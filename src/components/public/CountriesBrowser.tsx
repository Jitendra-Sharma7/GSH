"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";
import type { PublicCountry } from "@/lib/data/public";

function uniqueRegions(countries: PublicCountry[]): string[] {
  return Array.from(
    new Set(
      countries
        .map((c) => c.region?.trim())
        .filter((r): r is string => Boolean(r)),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

export function CountriesBrowser({ countries }: { countries: PublicCountry[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");

  const regions = useMemo(() => uniqueRegions(countries), [countries]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return countries.filter((c) => {
      const matchesSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (c.capital ?? "").toLowerCase().includes(term);
      const matchesRegion = region === "all" || c.region === region;
      return matchesSearch && matchesRegion;
    });
  }, [countries, search, region]);

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search countries..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs focus:border-primary-500 focus:outline-none"
          />
        </div>

        {regions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {["all", ...regions].map((reg) => (
              <button
                key={reg}
                onClick={() => setRegion(reg)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  region === reg
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {reg === "all" ? "All Regions" : reg}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
          No published countries match your search yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <CountryFlag
                    code={c.code}
                    name={c.name}
                    size="xl"
                    className="shadow-sm"
                  />
                  <span className="rounded-full bg-primary-50 text-primary-700 font-bold px-2.5 py-1 text-xs border border-primary-100">
                    {c.scholarshipCount} opportunities
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                {c.region && (
                  <p className="text-xs font-semibold text-gray-500 mb-3">{c.region}</p>
                )}

                {c.description ? (
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {c.description}
                  </p>
                ) : null}

                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  {c.avgLivingCost && (
                    <div>
                      <span className="font-semibold text-gray-900">Avg Living Cost: </span>
                      <span>{c.avgLivingCost}</span>
                    </div>
                  )}
                  {c.popularUniversities.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-900">Top Universities: </span>
                      <span>{c.popularUniversities.slice(0, 2).join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/scholarships?country=${encodeURIComponent(c.id)}`}
                className="mt-6 flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-primary-700 border border-gray-200 hover:bg-primary-50 transition-colors"
              >
                <span>Browse {c.name} Scholarships</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
