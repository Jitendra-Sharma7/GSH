"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { CountryFlagWithName } from "@/components/ui/CountryFlag";
import { mockCountries } from "@/lib/data/mock-countries";
import { mockFields } from "@/lib/data/mock-fields";

interface FilterState {
  query: string;
  country: string;
  field: string;
  degree: string;
  funding: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export function SearchFilters({
  filters,
  onChange,
  onReset
}: SearchFiltersProps) {
  const degrees = [
    { value: "", label: "All Degree Levels" },
    { value: "Undergraduate", label: "Undergraduate / Bachelor's" },
    { value: "Master's", label: "Master's / Postgraduate" },
    { value: "PhD", label: "PhD / Doctoral" },
    { value: "Postdoctoral", label: "Postdoctoral" },
    { value: "Research", label: "Research Fellowships" },
  ];

  const fundingTypes = [
    { value: "", label: "All Funding Types" },
    { value: "fully-funded", label: "Fully Funded" },
    { value: "fully-tuition", label: "Full Tuition Coverage" },
    { value: "partial-tuition", label: "Partial Tuition Waiver" },
    { value: "stipend", label: "Monthly Stipend / Allowance" },
  ];

  const handleSelect = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = Boolean(
    filters.query || filters.country || filters.field || filters.degree || filters.funding
  );

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-600"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Degree Level */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Degree Level
        </label>
        <select
          value={filters.degree}
          onChange={(e) => handleSelect("degree", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {degrees.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Country */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Destination Country
        </label>
        <select
          value={filters.country}
          onChange={(e) => handleSelect("country", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Countries</option>
          {mockCountries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Field of Study */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Field of Study
        </label>
        <select
          value={filters.field}
          onChange={(e) => handleSelect("field", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">All Fields</option>
          {mockFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Funding Coverage
        </label>
        <select
          value={filters.funding}
          onChange={(e) => handleSelect("funding", e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {fundingTypes.map((ft) => (
            <option key={ft.value} value={ft.value}>
              {ft.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick shortcuts */}
      <div className="border-t border-gray-100 pt-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Popular filters
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleSelect("funding", "fully-funded")}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
              filters.funding === "fully-funded"
                ? "border-primary-500 bg-primary-50 font-medium text-primary-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Fully Funded
          </button>
          <button
            onClick={() => handleSelect("degree", "Master's")}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
              filters.degree === "Master's"
                ? "border-primary-500 bg-primary-50 font-medium text-primary-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Master&apos;s
          </button>
          <button
            onClick={() => handleSelect("country", "de")}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
              filters.country === "de"
                ? "border-primary-500 bg-primary-50 font-medium text-primary-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <CountryFlagWithName
              code={mockCountries.find((c) => c.id === "de")?.code}
              emoji={mockCountries.find((c) => c.id === "de")?.flag}
              name="Germany"
              size="xs"
            />
          </button>
          <button
            onClick={() => handleSelect("field", "Computer Science")}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
              filters.field === "Computer Science"
                ? "border-primary-500 bg-primary-50 font-medium text-primary-700"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Computer Science
          </button>
        </div>
      </div>
    </div>
  );
}
