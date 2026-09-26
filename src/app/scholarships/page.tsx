"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Inbox, RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { SearchFilters } from "@/components/scholarships/SearchFilters";
import { api, PaginatedResult } from "@/lib/data/store";
import type { PublicScholarship } from "@/lib/data/public";

function ScholarshipsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter state
  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    country: searchParams.get("country") || "",
    field: searchParams.get("field") || "",
    degree: searchParams.get("degree") || "",
    funding: searchParams.get("funding") || "",
  });

  const [sortOption, setSortOption] = useState("relevance");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<PublicScholarship>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Re-sync filters when the URL changes (e.g. a country tile links in with
  // ?country=de). Adjusting state during render is React's documented pattern
  // for deriving state from a prop; the previous effect caused an extra
  // cascading render on every navigation.
  const urlKey = searchParams.toString();
  const [lastUrlKey, setLastUrlKey] = useState(urlKey);
  if (lastUrlKey !== urlKey) {
    setLastUrlKey(urlKey);
    setFilters({
      query: searchParams.get("query") || "",
      country: searchParams.get("country") || "",
      field: searchParams.get("field") || "",
      degree: searchParams.get("degree") || "",
      funding: searchParams.get("funding") || "",
    });
    setPage(1);
  }

  // Fetch scholarships when filters or page change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.getScholarships({
          ...filters,
          page,
          limit: 9,
        });

        // Apply client sort if needed
        const sorted = [...res.data];
        if (sortOption === "deadline") {
          sorted.sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          });
        } else if (sortOption === "alphabetical") {
          sorted.sort((a, b) => a.title.localeCompare(b.title));
        }

        setResult({
          ...res,
          data: sorted,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filters, page, sortOption]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.country) params.set("country", newFilters.country);
    if (newFilters.field) params.set("field", newFilters.field);
    if (newFilters.degree) params.set("degree", newFilters.degree);
    if (newFilters.funding) params.set("funding", newFilters.funding);
    router.push(`/scholarships?${params.toString()}`);
  };

  const handleResetFilters = () => {
    const empty = { query: "", country: "", field: "", degree: "", funding: "" };
    handleFilterChange(empty);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange(filters);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <Container>
        {/* Page Title & Search Bar */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">
            Explore Global Scholarships
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Search verified opportunities from accredited universities, governments, and foundations.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Search by keywords, e.g. 'Master in Computer Science Germany' or 'Chevening'..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-xs transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Top Control Bar: Total results & Sort */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">{result.total}</span>
            <span className="text-sm text-gray-600">scholarships found</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex lg:hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>

            {/* Sort options */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 px-2.5 text-xs font-medium text-gray-800 focus:border-primary-500 focus:outline-none"
              >
                <option value="relevance">Relevance / Match</option>
                <option value="deadline">Upcoming Deadline</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Filters + Right Results */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar Filters for Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <SearchFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer / Collapsible */}
          {isMobileFilterOpen && (
            <div className="block lg:hidden mb-4">
              <SearchFilters
                filters={filters}
                onChange={(f) => {
                  handleFilterChange(f);
                  setIsMobileFilterOpen(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
          )}

          {/* Right Results Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-72 rounded-2xl bg-white border border-gray-200 animate-pulse p-5" />
                ))}
              </div>
            ) : result.data.length === 0 ? (
              /* Empty State */
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-900">No scholarships found</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                  We couldn&apos;t find any opportunities matching your active filters. Try broadening your criteria or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all filters
                </button>
              </div>
            ) : (
              /* Results List */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {result.data.map((sch) => (
                    <ScholarshipCard key={sch.id} scholarship={sch} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {result.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold text-gray-600 px-2">
                      Page {page} of {result.totalPages}
                    </span>
                    <button
                      disabled={page === result.totalPages}
                      onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ScholarshipsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading scholarships...</div>}>
      <ScholarshipsContent />
    </Suspense>
  );
}
