import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { getPublicPostBySlug, getPublicPosts } from "@/lib/data/public";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/** Two-letter monogram for the byline, derived from the author's name. */
function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "GS";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export async function generateStaticParams() {
  const posts = await getPublicPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);

  if (!post) notFound();

  // Other articles, nearest in category first, so a reader who finishes this
  // one has somewhere obvious to go next instead of a dead end.
  const related = (await getPublicPosts())
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.category && a.category === post.category ? 0 : 1;
      const bMatch = b.category && b.category === post.category ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <Container size="md">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="inline-flex items-center gap-1 hover:text-primary-600">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Blog
          </Link>
        </nav>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-10">
          <header>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                  {post.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {post.readMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 pb-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                {initials(post.author ?? "Editorial team")}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {post.author ?? "Editorial team"}
                </p>
                <p className="text-xs text-gray-500">Published {formatDate(post.published)}</p>
              </div>
            </div>

            {post.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          {/* Body copy is `text-base` with a generous line height and a capped
              measure. It was `text-sm`, which is a caption size for a screen and
              reads poorly across two or three paragraphs. */}
          <div className="mt-8 space-y-6">
            {post.sections.map((section, index) => (
              <section key={`${section.heading}-${index}`}>
                {section.heading && (
                  <h2 className="text-xl font-bold leading-snug text-gray-900">
                    {section.heading}
                  </h2>
                )}
                <div className="mt-3 space-y-4">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-base leading-8 text-gray-700">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-10 rounded-xl border border-primary-100 bg-primary-50/60 p-5">
            <p className="text-sm leading-relaxed text-primary-900">
              This article is general guidance. Always confirm current requirements, deadlines, and
              eligibility with the official scholarship provider before applying.
            </p>
          </footer>
        </article>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Keep reading
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                >
                  {item.category && (
                    <span className="mb-2 text-xs font-semibold text-primary-700">
                      {item.category}
                    </span>
                  )}
                  <span className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-primary-700">
                    {item.title}
                  </span>
                  <span className="mt-auto pt-3 text-xs text-gray-500">
                    {item.readMinutes} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Blog
          </Link>
          <Link
            href="/resources"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Browse Guides
          </Link>
        </div>
      </Container>
    </div>
  );
}
