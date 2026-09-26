import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Layout";
import { getPublicPosts } from "@/lib/data/public";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guidance on finding scholarships, reading listings critically, understanding funding types, and organising a search you can sustain.",
};

const UNCATEGORISED = "More";

/** Anchor-safe id for a category heading. */
function anchor(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function BlogIndexPage() {
  const posts = await getPublicPosts();

  // Grouped from the published rows, so a post an editor files or re-files moves
  // section on its own. Posts with no category still need somewhere to appear.
  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const key = post.category ?? UNCATEGORISED;
    const bucket = groups.get(key);
    if (bucket) bucket.push(post);
    else groups.set(key, [post]);
  }
  const categories = [...groups.keys()];

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container>
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
            Resource Centre
          </div>
          <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">Blog</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Practical guidance on scholarship search, application strategy, and interpreting
            funding. Reviewed regularly and written to be factual rather than promotional.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No posts have been published yet.
          </p>
        ) : (
          <>
            {/* Category filter (anchors, not dead links) */}
            <nav aria-label="Post categories" className="mb-8 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`#${anchor(cat)}`}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {cat}
                </a>
              ))}
            </nav>

            <div className="space-y-10">
              {categories.map((cat) => (
                <section key={cat} id={anchor(cat)} className="scroll-mt-24">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">{cat}</h2>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {groups.get(cat)!.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="mb-3 flex items-center gap-2 text-[11px] text-gray-500">
                          {post.category && (
                            <span className="rounded-full bg-primary-50 px-2 py-0.5 font-semibold text-primary-700">
                              {post.category}
                            </span>
                          )}
                          <span>{post.readMinutes} min read</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600">
                          {post.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                          {post.excerpt}
                        </p>
                        <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                          {post.author ?? "Editorial team"} &middot; {formatDate(post.published)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
          <h2 className="text-xl font-bold text-gray-900">Looking for step-by-step guides?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
            The resource centre covers application writing, language tests, interviews, documents,
            and visa requirements in more depth.
          </p>
          <Link
            href="/resources"
            className="mt-5 inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Browse Guides
          </Link>
        </div>
      </Container>
    </div>
  );
}
