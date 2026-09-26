"use client";

import React from "react";
import Link from "next/link";
import { Layers, X, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountryFlagWithName } from "@/components/ui/CountryFlag";
import { useStore } from "@/lib/store/useStore";
import { api } from "@/lib/data/store";
import { ScholarshipData } from "@/lib/data/mock-scholarships";
import { mockCountries } from "@/lib/data/mock-countries";
import { mockProviders } from "@/lib/data/mock-providers";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const { compareIds, toggleCompare, clearCompare } = useStore();
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);

  useEffect(() => {
    async function load() {
      const loaded = await Promise.all(
        compareIds.map((id) => api.getScholarshipById(id))
      );
      setScholarships(loaded.filter((s) => s !== undefined) as ScholarshipData[]);
    }
    if (compareIds.length > 0) {
      load();
    }
  }, [compareIds]);

  if (compareIds.length === 0) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-16">
        <Container>
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900">No Scholarships Selected</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Add scholarships from search results or details pages to compare them side-by-side.
            </p>
            <Link
              href="/scholarships"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Browse Scholarships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const comparisonRows = [
    { key: "provider", label: "Provider / Organization", render: (s: ScholarshipData) => mockProviders.find(p => p.id === s.providerId)?.name || "N/A" },
    { key: "country", label: "Destination Country", render: (s: ScholarshipData) => {
      const c = mockCountries.find(c => c.id === s.countryId);
      if (!c) return "Global";
      return <CountryFlagWithName code={c.code} emoji={c.flag} name={c.name} size="sm" />;
    }},
    { key: "degrees", label: "Degree Levels", render: (s: ScholarshipData) => s.degreeLevels.join(", ") },
    { key: "fields", label: "Fields of Study", render: (s: ScholarshipData) => s.fields.slice(0, 2).join(", ") + (s.fields.length > 2 ? "..." : "") },
    { key: "fundingType", label: "Funding Type", render: (s: ScholarshipData) => s.fundingType.replace("-", " ").toUpperCase() },
    { key: "tuition", label: "Tuition Coverage", render: (s: ScholarshipData) => s.tuitionCoverage ? "✅ 100% Covered" : "❌ Not Covered" },
    { key: "stipend", label: "Monthly Stipend", render: (s: ScholarshipData) => s.livingStipend > 0 ? `${s.currency} ${s.livingStipend}/mo` : "❌ None" },
    { key: "accommodation", label: "Accommodation", render: (s: ScholarshipData) => s.accommodationCoverage ? "✅ Included" : "❌ Not Included" },
    { key: "travel", label: "Airfare / Travel", render: (s: ScholarshipData) => s.travelAllowance ? "✅ Round-trip flight" : "❌ Self-funded" },
    { key: "insurance", label: "Health Insurance", render: (s: ScholarshipData) => s.healthInsurance ? "✅ Covered" : "❌ Not Covered" },
    { key: "duration", label: "Duration", render: (s: ScholarshipData) => s.duration },
    { key: "awards", label: "Number of Awards", render: (s: ScholarshipData) => s.numAwards?.toString() || "N/A" },
    { key: "deadline", label: "Application Deadline", render: (s: ScholarshipData) => formatDate(s.deadline) },
    { key: "appFee", label: "Application Fee", render: (s: ScholarshipData) => s.applicationFee === 0 ? "Free ($0)" : `$${s.applicationFee}` },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-950">Compare Scholarships</h1>
            <p className="mt-1 text-sm text-gray-600">Side-by-side comparison of {scholarships.length} selected opportunities.</p>
          </div>
          <button
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>

        {/* Desktop: Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="sticky left-0 z-10 bg-gray-50/70 p-4 text-left font-bold text-gray-500 uppercase tracking-wider">
                  Criteria
                </th>
                {scholarships.map((s) => (
                  <th key={s.id} className="relative p-4 text-left min-w-[240px]">
                    <button
                      onClick={() => toggleCompare(s.id)}
                      className="absolute top-2 right-2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <Link href={`/scholarships/${s.id}`} className="font-bold text-sm text-gray-900 hover:text-primary-600 line-clamp-2">
                      {s.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {mockProviders.find(p => p.id === s.providerId)?.name}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={row.key} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                  <td className="sticky left-0 z-10 bg-inherit p-4 font-semibold text-gray-700">
                    {row.label}
                  </td>
                  {scholarships.map((s) => (
                    <td key={s.id} className="p-4 text-gray-600">
                      {row.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-gray-700">Actions</td>
                {scholarships.map((s) => (
                  <td key={s.id} className="p-4">
                    <Link
                      href={`/scholarships/${s.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                    >
                      View Full Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: Card Stack */}
        <div className="lg:hidden space-y-4">
          {scholarships.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900">{s.title}</h3>
                <button
                  onClick={() => toggleCompare(s.id)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {comparisonRows.map((row) => (
                  <div key={row.key} className="flex justify-between border-b border-gray-100 pb-1.5">
                    <span className="text-gray-500 font-medium">{row.label}:</span>
                    <span className="text-gray-900 text-right">{row.render(s)}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/scholarships/${s.id}`}
                className="mt-4 block rounded-lg bg-primary-600 py-2 text-center text-xs font-semibold text-white hover:bg-primary-700"
              >
                View Full Details
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
