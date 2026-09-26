import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileText, HelpCircle, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { guides, guideCategories, faqs } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Scholarship Guides & Resources",
  description:
    "Step-by-step guides on finding scholarships, writing statements of purpose, recommendation letters, interviews, language tests, and student visa requirements.",
};

export default function ResourcesPage() {
  const faqCount = faqs.length;
  const guideCount = guides.length;

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container>
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Student Knowledge Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">
            Scholarship Application Resources
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Practical guides on finding funding, writing applications, and interpreting what a
            scholarship actually covers. Written to be factual rather than promotional.
          </p>
        </div>

        {/* Real counts, linked to real destinations */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="#guides"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Application Guides</h2>
            <p className="mt-1 text-xs text-gray-500">
              {guideCount} in-depth guides across {guideCategories.length} topics
            </p>
          </Link>

          <Link
            href="/faq"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-1 text-xs text-gray-500">
              {faqCount} answered questions on eligibility, verification, and privacy
            </p>
          </Link>

          <Link
            href="/blog"
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Blog</h2>
            <p className="mt-1 text-xs text-gray-500">Shorter reads on search strategy and funding</p>
          </Link>
        </div>

        {/* Guides */}
        <section id="guides" className="scroll-mt-24">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Guides &amp; Articles</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/resources/${guide.slug}`}
                className="group flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-primary-600">{guide.category}</span>
                  <h3 className="mt-1 text-sm font-bold text-gray-900 group-hover:text-primary-700">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-600">
                    {guide.excerpt}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {guide.readMinutes} min read
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Updated {guide.updated}
                    </span>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-primary-600" />
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
