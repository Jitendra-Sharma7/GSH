"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Database, Eye, AlertTriangle, TrendingUp, Users, Search, Plus } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { api } from "@/lib/data/store";
import { ScholarshipData } from "@/lib/data/mock-scholarships";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [filter, setFilter] = useState<"all" | "needs-verification" | "expired">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getScholarships({ limit: 50 });
        setScholarships(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const needsVerification = scholarships.filter(
    (s) => s.verificationStatus === "Verification Needed" || s.verificationStatus === "Potentially Expired"
  );

  const filteredList =
    filter === "needs-verification"
      ? needsVerification
      : filter === "expired"
      ? scholarships.filter((s) => s.status === "Closed" || s.status === "Expired")
      : scholarships;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Access Only</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-950">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage scholarships, verify submissions, and monitor platform analytics.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Public Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: "Total Scholarships", value: scholarships.length, color: "bg-blue-50 text-blue-700" },
            { icon: AlertTriangle, label: "Needs Verification", value: needsVerification.length, color: "bg-amber-50 text-amber-700" },
            { icon: Eye, label: "Active & Open", value: scholarships.filter((s) => s.status === "Open").length, color: "bg-emerald-50 text-emerald-700" },
            { icon: Users, label: "User Submissions", value: 12, color: "bg-purple-50 text-purple-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-5 ${stat.color} border-current/20`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              { id: "all", label: "All Scholarships" },
              { id: "needs-verification", label: `Verification Queue (${needsVerification.length})` },
              { id: "expired", label: "Expired / Closed" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
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

          <Link
            href="/submit-scholarship"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Scholarship
          </Link>
        </div>

        {/* Scholarship Management Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/70">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Scholarship</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Deadline</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Verification</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Last Checked</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading scholarships...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No scholarships match the selected filter
                    </td>
                  </tr>
                ) : (
                  filteredList.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/scholarships/${s.id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1"
                        >
                          {s.title}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.providerId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            s.status === "Open"
                              ? "bg-emerald-100 text-emerald-700"
                              : s.status === "Closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(s.deadline)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            s.verificationStatus === "Verified Recently"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.verificationStatus === "Verified Recently" ? "✓ Verified" : "⚠ Needs Check"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.lastVerifiedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/scholarships/${s.id}`}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </Link>
                          <button className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                            Edit
                          </button>
                          <button className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100">
                            ✓ Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              Recent Activity (Demo)
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• 42 scholarship views in the last 24 hours</p>
              <p>• 18 users saved scholarships to their dashboard</p>
              <p>• 7 new user registrations today</p>
              <p>• 3 scholarship submissions awaiting verification</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-600" />
              Top Search Queries (Demo)
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>&bull; &ldquo;Fully funded master&apos;s scholarships&rdquo; &mdash; 128 searches</p>
              <p>&bull; &ldquo;Computer science PhD Germany&rdquo; &mdash; 94 searches</p>
              <p>&bull; &ldquo;Chevening scholarship&rdquo; &mdash; 76 searches</p>
              <p>&bull; &ldquo;DAAD scholarship 2027&rdquo; &mdash; 63 searches</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
