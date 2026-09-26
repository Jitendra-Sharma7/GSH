import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { guides } from "@/lib/data/content";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      publishedTime: guide.updated,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) notFound();

  const others = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container size="md">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/resources" className="hover:text-primary-600">
            Resources
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{guide.title}</span>
        </nav>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-10">
          <header>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary-700">
                {guide.category}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {guide.readMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Updated {guide.updated}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">{guide.title}</h1>
            <p className="mt-3 text-base text-gray-600">{guide.excerpt}</p>
          </header>

          <div className="mt-7 space-y-7">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold text-gray-900">{section.heading}</h2>
                <div className="mt-2 space-y-3">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-gray-700">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-10 rounded-xl border border-primary-100 bg-primary-50/60 p-5">
            <p className="text-sm leading-relaxed text-primary-900">
              This guide is general information, not professional advice. Requirements change
              frequently — always confirm current details with the official scholarship provider
              before applying.
            </p>
          </footer>
        </article>

        {/* Related */}
        {others.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-base font-bold text-gray-900">Related guides</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/resources/${o.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-900 shadow-xs transition-all hover:border-primary-300 hover:shadow-md"
                >
                  {o.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link
          href="/resources"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all guides
        </Link>
      </Container>
    </div>
  );
}
