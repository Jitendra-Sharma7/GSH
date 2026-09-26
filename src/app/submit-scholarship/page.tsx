"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { mockCountries } from "@/lib/data/mock-countries";
import { mockFields } from "@/lib/data/mock-fields";
import toast from "react-hot-toast";

export default function SubmitScholarshipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    organization: "",
    officialWebsite: "",
    applicationUrl: "",
    contactEmail: "",
    country: "de",
    degreeLevel: "Master's",
    field: "Computer Science",
    fundingType: "fully-funded",
    deadline: "",
    description: "",
    eligibility: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast.success("Scholarship submitted to verification queue!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container size="md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <Send className="h-3.5 w-3.5" />
            <span>Community & Institutional Submissions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Submit a Scholarship Opportunity
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
            Are you a university representative, foundation, or scholarship coordinator? Submit your funding opportunity for inclusion in the global directory.
          </p>
        </div>

        {/* Verification Queue Notice Banner */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Human Verification Policy:</span> To protect students from scams and outdated records, all submissions enter our moderation queue for manual source verification before publication. We do not automatically publish unverified listings.
          </div>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">Submission Received!</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to global student opportunity. Our editorial team will verify the official links and criteria within 2-3 business days.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Submit Another
              </button>
              <Link
                href="/scholarships"
                className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Browse Scholarships
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Basic Opportunity Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Vice-Chancellor's Excellence Scholarship 2027"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Providing Organization / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="e.g. University of Edinburgh / DAAD"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Destination Country *
                  </label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    {mockCountries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4">
              2. Official Links & Contact
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Official Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.officialWebsite}
                    onChange={(e) => setForm({ ...form, officialWebsite: e.target.value })}
                    placeholder="https://provider.edu/scholarships"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Official Application URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={form.applicationUrl}
                    onChange={(e) => setForm({ ...form, applicationUrl: e.target.value })}
                    placeholder="https://portal.provider.edu/apply"
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Official Contact / Support Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="scholarships@organization.edu"
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4">
              3. Funding & Eligibility Criteria
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Degree Level *
                  </label>
                  <select
                    value={form.degreeLevel}
                    onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Postdoctoral">Postdoctoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Funding Coverage *
                  </label>
                  <select
                    value={form.fundingType}
                    onChange={(e) => setForm({ ...form, fundingType: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  >
                    <option value="fully-funded">Fully Funded (Tuition + Stipend)</option>
                    <option value="fully-tuition">Full Tuition Only</option>
                    <option value="partial-tuition">Partial Tuition Waiver</option>
                    <option value="stipend">Stipend / Research Grant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Full Description & Scope of Coverage *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail the funding amount, stipend allowance, housing support, research grants, and program duration..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Eligibility Criteria & Academic Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.eligibility}
                  onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                  placeholder="Specify eligible nationalities, minimum GPA, language scores (IELTS/TOEFL), and work experience..."
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {loading ? "Submitting to Queue..." : "Submit for Verification"}
            </button>
          </form>
        )}
      </Container>
    </div>
  );
}
