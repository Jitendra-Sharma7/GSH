import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

/**
 * Sitemap for the public, crawlable site.
 *
 * Every entry is read from the same published rows the public pages read, so a
 * draft, an archived record, a deleted record or an editorial post dated in the
 * future can never be advertised here. The routes robots.txt disallows are
 * absent by construction: they are session-scoped or staff-scoped, and there is
 * nothing a crawler should be pointed at.
 */

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.APP_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

/** Same visibility rule as the public read model. */
const VISIBLE = { publishStatus: "PUBLISHED" as const, deletedAt: null };

interface Entry {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const STATIC_ROUTES: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/scholarships", priority: 0.9, changeFrequency: "daily" },
  { path: "/deadlines", priority: 0.9, changeFrequency: "daily" },
  { path: "/fully-funded", priority: 0.8, changeFrequency: "daily" },
  { path: "/finder", priority: 0.8, changeFrequency: "monthly" },
  { path: "/countries", priority: 0.8, changeFrequency: "weekly" },
  { path: "/fields", priority: 0.7, changeFrequency: "weekly" },
  { path: "/universities", priority: 0.7, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.7, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "/advertise", priority: 0.3, changeFrequency: "yearly" },
  { path: "/submit-scholarship", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [scholarships, posts, resources] = await Promise.all([
    prisma.scholarship.findMany({
      where: VISIBLE,
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { ...VISIBLE, publishedAt: { not: null, lte: now } },
      select: { slug: true, updatedAt: true },
    }),
    // The legacy Guide table is merged into the public resources list, so its
    // published rows are advertised too. A guide whose slug a resource already
    // occupies resolves to the same URL either way.
    Promise.all([
      prisma.resource.findMany({ where: VISIBLE, select: { slug: true, updatedAt: true } }),
      prisma.guide.findMany({
        where: { published: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]).then(([fromResources, fromGuides]) => [...fromResources, ...fromGuides]),
  ]);

  const entries: MetadataRoute.Sitemap = [
    ...STATIC_ROUTES.map((route) => ({
      url: `${BASE}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...scholarships.map((s) => ({
      url: `${BASE}/scholarships/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...resources.map((r) => ({
      url: `${BASE}/resources/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return entries;
}
