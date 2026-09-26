"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { mockUniversities } from "@/lib/data/mock-universities";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockUniversities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase()) ||
      u.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()))
  );

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
            Explore world-renowned research universities and their dedicated international student scholarship schemes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities by name, country, or subject..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-xs shadow-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-3xl">{u.logo}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[11px] font-bold">
                      QS Rank #{u.ranking}
                    </span>
                    <span className="rounded-md bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 text-[11px] font-bold">
                      {u.scholarshipCount} Grants
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug">{u.name}</h3>
                <p className="text-xs text-gray-500 mt-1 mb-3">
                  {u.city}, {u.country}
                </p>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {u.description}
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">Popular Programs: </span>
                    <span>{u.programs.slice(0, 3).join(", ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Intl Students: </span>
                    <span>{u.internationalStudentPercent}% of student body</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <Link
                  href={`/scholarships?query=${encodeURIComponent(u.name)}`}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary-600 py-2.5 text-xs font-bold text-white hover:bg-primary-700 transition-colors"
                >
                  <span>View Scholarships</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={u.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  title="Official Website"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
