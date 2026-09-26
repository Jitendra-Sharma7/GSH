"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { api } from "@/lib/data/store";
import type { PublicScholarship } from "@/lib/data/public";
import { mockCountries } from "@/lib/data/mock-countries";
import { mockFields } from "@/lib/data/mock-fields";

export default function HomePage() {
  const router = useRouter();
  const [featuredScholarships, setFeaturedScholarships] = useState<PublicScholarship[]>([]);
  const [fullyFundedList, setFullyFundedList] = useState<PublicScholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [studyField, setStudyField] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const featured = await api.getScholarships({ limit: 6 });
        const fullyFunded = await api.getScholarships({ funding: "fully-funded", limit: 3 });
        setFeaturedScholarships(featured.data);
        setFullyFundedList(fullyFunded.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (studyField) params.set("field", studyField);
    if (degreeLevel) params.set("degree", degreeLevel);
    if (destinationCountry) params.set("country", destinationCountry);
    router.push(`/scholarships?${params.toString()}`);
  };

  const popularSearches = [
    { label: "Fully Funded Scholarships", href: "/scholarships?funding=fully-funded" },
    { label: "Master's in Germany", href: "/scholarships?country=de&degree=Master's" },
    { label: "Undergraduate in USA", href: "/scholarships?country=us&degree=Undergraduate" },
    { label: "Computer Science", href: "/scholarships?field=Computer Science" },
    { label: "No Application Fee", href: "/scholarships" },
    { label: "Chevening & Commonwealth", href: "/scholarships?query=Chevening" },
    { label: "DAAD Scholarships", href: "/scholarships?query=DAAD" },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-white py-16 sm:py-24">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform blur-3xl opacity-30 pointer-events-none">
          <div className="h-[400px] w-[900px] bg-gradient-to-r from-primary-400 to-indigo-400 rounded-full" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-800">
                Verified Global Scholarship Discovery Network • 2026-2027 Intakes
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-6xl sm:leading-tight">
              Find Scholarships. <br className="hidden sm:inline" />
              <span className="text-primary-600">Fund Your Future.</span> Study Anywhere.
            </h1>

            <p className="mt-5 text-lg text-gray-600 sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Discover verified scholarships, grants, fellowships, and financial aid from top universities, governments, and foundations worldwide.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/finder"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-700 hover:shadow-lg"
              >
                Find My Scholarships (AI Matcher)
              </Link>

              <Link
                href="/scholarships"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50"
              >
                Browse All 1,200+ Opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Large Hero Search Bar */}
          <div className="mx-auto mt-12 max-w-4xl">
            <form
              onSubmit={handleHeroSearch}
              className="rounded-2xl border border-gray-200 bg-white p-3 shadow-xl sm:p-4"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Field of Study */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1 ml-1">
                    What do you want to study?
                  </label>
                  <select
                    value={studyField}
                    onChange={(e) => setStudyField(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                  >
                    <option value="">Any Field of Study</option>
                    {mockFields.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Degree Level */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1 ml-1">
                    Study Level
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                  >
                    <option value="">All Degree Levels</option>
                    <option value="Undergraduate">Undergraduate / Bachelor&apos;s</option>
                    <option value="Master's">Master&apos;s / Postgraduate</option>
                    <option value="PhD">PhD / Doctorate</option>
                    <option value="Postdoctoral">Postdoctoral</option>
                  </select>
                </div>

                {/* Destination Country */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1 ml-1">
                    Destination
                  </label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none"
                  >
                    <option value="">Any Destination Country</option>
                    {mockCountries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Only official & verified scholarship opportunities listed</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
                >
                  <Search className="h-4 w-4" />
                  Search Scholarships
                </button>
              </div>
            </form>

            {/* Popular Search Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Popular:</span>
              {popularSearches.map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-gray-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-gray-100 bg-gray-50/60 py-8">
        <Container>
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div>
              <p className="text-3xl font-extrabold text-primary-600">1,200+</p>
              <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Active Scholarships</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">85+</p>
              <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations Worldwide</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">$45M+</p>
              <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Annual Funding</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">100%</p>
              <p className="mt-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Official Verified Sources</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. FEATURED SCHOLARSHIPS */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                Featured Programs
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Top Global Opportunities
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Prestigious government & institutional scholarships accepting applications right now.
              </p>
            </div>
            <Link
              href="/scholarships"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              View all scholarships →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredScholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. SCHOLARSHIP FINDER PROMO (AI MATCHER) */}
      <section className="py-16 bg-gradient-to-r from-primary-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-800/80 px-3 py-1 text-xs font-semibold text-primary-200">
                Personalized Eligibility Questionnaire
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl leading-tight">
                Not sure where to start? <br />
                Answer 10 quick questions to see your matches.
              </h2>
              <p className="text-primary-100 text-base leading-relaxed max-w-xl">
                Tell us your citizenship, target degree, field of interest, and GPA. Our matching engine will instantly identify scholarships you qualify for — with clear reasons for every match.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/finder"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 shadow-md transition-transform hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Start Scholarship Finder
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-primary-200">Takes less than 2 minutes • 100% Free</span>
              </div>
            </div>

            {/* Visual interactive preview box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-200">Interactive Match Preview</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300 font-medium">94% Match</span>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-bold text-white">DAAD EPOS Postgraduate Scholarship</div>
                  <div className="space-y-1.5 text-xs text-primary-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Degree level matches: Master&apos;s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Nationality eligible: Developing Nations list</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Full funding provided: Tuition + €934/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. FULLY FUNDED SCHOLARSHIPS */}
      <section className="py-16 bg-white">
        <Container>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Full Coverage
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Fully Funded Scholarships
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Opportunities where tuition and living costs are met by the awarding body.
                Check the coverage breakdown on each listing for what is included.
              </p>
            </div>
            <Link
              href="/fully-funded"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:mt-0"
            >
              See all fully funded &rarr;
            </Link>
          </div>

          {fullyFundedList.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fullyFundedList.map((s) => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
              <p className="text-sm text-gray-600">
                No fully funded opportunities are listed right now.{" "}
                <Link href="/scholarships" className="font-semibold text-primary-600 hover:underline">
                  Browse all scholarships
                </Link>
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* 6. EXPLORE BY COUNTRY */}
      <section className="py-16 bg-gray-50/50">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                Study Destinations
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Explore Scholarships by Country
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Discover tuition-free and fully funded destinations across Europe, North America, Asia & Oceania.
              </p>
            </div>
            <Link
              href="/countries"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              All 20+ countries →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockCountries.slice(0, 12).map((c) => (
              <Link
                key={c.id}
                href={`/scholarships?country=${c.id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-xs transition-all hover:-translate-y-1 hover:border-primary-300 hover:shadow-md"
              >
                <div className="mb-2">
                  <CountryFlag
                    code={c.code}
                    emoji={c.flag}
                    name={c.name}
                    size="lg"
                    className="shadow-sm"
                  />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 text-sm truncate">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{c.scholarshipCount} scholarships</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. EXPLORE BY FIELD */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
                Disciplines
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Scholarships by Field of Study
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find dedicated grants for STEM, Business, Medicine, Social Sciences, Arts and more.
              </p>
            </div>
            <Link
              href="/fields"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              All fields →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockFields.slice(0, 8).map((f) => (
              <Link
                key={f.id}
                href={`/scholarships?field=${encodeURIComponent(f.name)}`}
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-400 hover:bg-primary-50/30 shadow-xs"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 group-hover:text-primary-700 truncate">
                    {f.name}
                  </h3>
                  <p className="text-xs text-gray-500">{f.scholarshipCount} programs</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              How Global Scholarship Hub Works
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              A transparent, trusted process from initial discovery to submitting on the official portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Tell Us About Yourself</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Specify your citizenship, academic achievements, target study level, and funding preferences to generate your personalized profile.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Discover & Compare</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Search verified listings with our matching engine. Compare funding amounts, coverage, deadlines, and eligibility side-by-side.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Track & Apply Directly</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Save deadlines to your personalized application tracker and apply directly through the official university or government portal.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. TRUST & VERIFICATION COMMITMENT */}
      <section className="py-16 bg-white border-t border-gray-100">
        <Container>
          <div className="rounded-3xl bg-primary-50/70 border border-primary-100 p-8 sm:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 mb-4">
                <ShieldCheck className="h-4 w-4" />
                Our Trust & Verification Promise
              </div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Zero fake listings. Zero unverified claims.
              </h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Unlike scrapers that index outdated or fabricated financial aid entries, every listing on ScholarAtlas is attributed directly to its source with official URLs and verified last-checked timestamps. We clearly distinguish algorithmic match recommendations from formal provider eligibility determinations.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Government & University Direct Links
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Real Application Dates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free Open Access for Students
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. NEWSLETTER / DEADLINE ALERTS */}
      <section className="py-16 bg-gray-900 text-white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Never Miss a Scholarship Deadline
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Receive weekly curated alerts tailored to your citizenship, desired study level, and target destination.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing! You will receive verified scholarship updates.");
              }}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-500">
              No spam. Unsubscribe anytime with 1-click.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
