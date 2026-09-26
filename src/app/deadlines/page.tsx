"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, Filter, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { api } from "@/lib/data/store";
import { ScholarshipData } from "@/lib/data/mock-scholarships";
import { mockCountries } from "@/lib/data/mock-countries";
import { formatDate, getDeadlineUrgency } from "@/lib/utils";

export default function DeadlinesPage() {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [filter, setFilter] = useState<"all" | "urgent" | "month" | "upcoming">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getScholarships({ limit: 50 });
        // Sort by deadline
        const sorted = res.data
          .filter((s) => s.deadline)
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        setScholarships(sorted);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredScholarships = scholarships.filter((s) => {
    const days = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (filter === "urgent") return days > 0 && days <= 15;
    if (filter === "month") return days > 0 && days <= 30;
    if (filter === "upcoming") return days > 30;
    return true;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Scholarship Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-950">
            Scholarship Deadline Calendar
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Never miss an intake. Monitor upcoming application closing dates across world destinations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Upcoming Deadlines" },
            { id: "urgent", label: "Closing in ≤ 15 Days 🔥" },
            { id: "month", label: "Closing This Month" },
            { id: "upcoming", label: "Closing in 30+ Days" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                filter === tab.id
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-white border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredScholarships.map((s) => {
              const country = mockCountries.find((c) => c.id === s.countryId);
              const days = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isUrgent = days > 0 && days <= 15;
              const isClosed = days <= 0;

              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex flex-col items-center justify-center rounded-xl p-3 min-w-[70px] text-center ${
                      isClosed ? 'bg-gray-100 text-gray-500' :
                      isUrgent ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-primary-50 text-primary-700'
                    }`}>
                      <span className="text-xs font-bold uppercase">
                        {new Date(s.deadline).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-extrabold">
                        {new Date(s.deadline).getDate()}
                      </span>
                    </div>

                    <div>
                      <Link
                        href={`/scholarships/${s.id}`}
                        className="font-bold text-sm text-gray-900 hover:text-primary-600 line-clamp-1"
                      >
                        {s.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                          <CountryFlag code={country?.code} emoji={country?.flag} name={country?.name} size="xs" />
                          {country?.name}
                        </span>
                        <span>• {s.fundingType.replace('-', ' ').toUpperCase()} • {s.degreeLevels.join(', ')}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isClosed ? 'bg-gray-100 text-gray-600' :
                      isUrgent ? 'bg-red-100 text-red-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isClosed ? 'Closed' : `${days} days remaining`}
                    </span>

                    <Link
                      href={`/scholarships/${s.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-primary-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
                    >
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
