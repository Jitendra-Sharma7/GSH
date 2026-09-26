import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Layout";
import { posts } from "@/lib/data/content";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container size="md">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-primary-600">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{post.title}</span>
        </nav>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-10">
          <header>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary-700">
                {post.category}
              </span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-950 sm:text-3xl">{post.title}</h1>
            <p className="mt-3 text-base text-gray-600">{post.excerpt}</p>
            <p className="mt-4 border-b border-gray-100 pb-5 text-xs text-gray-500">
              {post.author} &middot; Published {post.published}
            </p>
          </header>

          <div className="mt-6 space-y-7">
            {post.sections.map((section) => (
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
              This article is general guidance. Always confirm current requirements, deadlines, and
              eligibility with the official scholarship provider before applying.
            </p>
          </footer>
        </article>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to Blog
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Browse Guides
          </Link>
        </div>
      </Container>
    </div>
  );
}
