"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Search, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { mockCountries } from "@/lib/data/mock-countries";

export default function CountriesPage() {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = ["all", "Europe", "North America", "Asia", "Oceania", "Middle East"];

  const filtered = mockCountries.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = selectedRegion === "all" || c.region.includes(selectedRegion);
    return matchesSearch && matchesRegion;
  });

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
            Explore government and university scholarship programs across top higher-education hubs worldwide.
          </p>
        </div>

        {/* Search & Region Filter */}
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

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  selectedRegion === reg
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Country Grid */}
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
                    emoji={c.flag}
                    name={c.name}
                    size="xl"
                    className="shadow-sm"
                  />
                  <span className="rounded-full bg-primary-50 text-primary-700 font-bold px-2.5 py-1 text-xs border border-primary-100">
                    {c.scholarshipCount} opportunities
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                <p className="text-xs font-semibold text-gray-500 mb-3">{c.region}</p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {c.description}
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">Avg Living Cost: </span>
                    <span>{c.avgLivingCost}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Top Universities: </span>
                    <span>{c.popularUniversities.slice(0, 2).join(", ")}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/scholarships?country=${c.id}`}
                className="mt-6 flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-primary-700 border border-gray-200 hover:bg-primary-50 transition-colors"
              >
                <span>Browse {c.name} Scholarships</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
