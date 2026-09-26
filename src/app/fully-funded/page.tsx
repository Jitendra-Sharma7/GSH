"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { api } from "@/lib/data/store";
import { ScholarshipData } from "@/lib/data/mock-scholarships";

export default function FullyFundedPage() {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getScholarships({ funding: "fully-funded", limit: 24 });
        setScholarships(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <Container>
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white mb-10 shadow-lg">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              100% Coverage (Tuition + Stipend + Travel + Housing)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Fully Funded Scholarships Worldwide
            </h1>
            <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Study abroad without financial burden. Discover verified government and institutional programs covering 100% of your tuition fees, monthly living expenses, return airfare, and health insurance.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> DAAD, Fulbright, Chevening & Commonwealth
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Official Application Links
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Updated for 2026/2027
              </span>
            </div>
          </div>
        </div>

        {/* List of Fully Funded Opportunities */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {scholarships.length} Fully Funded Programs Available
          </h2>
          <Link
            href="/finder"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            Check your eligibility with AI Matcher →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
