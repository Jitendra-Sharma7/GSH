import type { PublicScholarship, PublicCountry, PublicField, PublicUniversity, PublicProvider, PublicStats } from "./public";
import {
  getPublicScholarships,
  getPublicScholarshipById,
  getPublicCountries,
  getPublicFields,
  getPublicStats,
  getPublicUniversities,
  getPublicProviders,
} from "./public";

/**
 * Public data access shared by server and client components.
 *
 * The interface is unchanged from the original in-memory store, so the pages
 * that call `api.*` needed no restructuring - only the data source moved from
 * hard-coded arrays to the database.
 *
 * Server renders call the `lib/data/public` functions directly. The browser
 * still goes through the read-only /api/public routes, because that is the only
 * way to ship data to a client component. The split matters: a server render
 * that fetched its own API route would add a network round trip per list, and
 * worse, a revalidation of a page that self-fetches makes the render trigger a
 * request that re-enters the server, which stalls the dev server and multiplies
 * work in production.
 */

const isServer = typeof window === "undefined";

export interface FilterOptions {
  query?: string;
  country?: string;
  field?: string;
  degree?: string;
  funding?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: "deadline" | "newest" | "title" | "featured";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/** Profile shape consumed by the matching engine. */
export interface MatchProfile {
  degreeLevel?: string;
  field?: string;
  citizenship?: string;
  targetCountries?: string[];
  gpa?: number | string | null;
  languageScore?: string;
  needFullFunding?: boolean;
  startYear?: string;
  experience?: string;
  priority?: string;
}

export interface MatchResult {
  scholarship: PublicScholarship;
  score: number;
  reasons: string[];
  missing?: string[];
  warnings?: string[];
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Small in-memory cache so several components can read the same list once. */
const cache = new Map<string, { at: number; value: unknown }>();
const CACHE_TTL_MS = 60_000;

async function cached<T>(key: string, url: string): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value as T;
  const value = await getJSON<T>(url);
  cache.set(key, { at: Date.now(), value });
  return value;
}

function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === false) continue;
    sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  // --- Scholarships ---
  getScholarships: async (filters: FilterOptions): Promise<PaginatedResult<PublicScholarship>> => {
    if (isServer) {
      return getPublicScholarships({ ...filters, limit: filters.limit ?? 12 });
    }
    const qs = toQuery({ ...filters, limit: filters.limit ?? 12 });
    // The result depends on the filter set, so each combination caches on its own.
    return cached(`sch:${qs}`, `/api/public/scholarships${qs}`);
  },

  getScholarshipById: async (id: string): Promise<PublicScholarship | undefined> => {
    if (isServer) {
      // The direct lookup returns `null` for a miss; this API reports `undefined`.
      return (await getPublicScholarshipById(id)) ?? undefined;
    }
    try {
      return await getJSON<PublicScholarship>(`/api/public/scholarship${toQuery({ id })}`);
    } catch {
      return undefined;
    }
  },

  // --- Countries ---
  getCountries: async (): Promise<PublicCountry[]> =>
    isServer ? getPublicCountries() : cached("countries", "/api/public/countries"),

  getCountryById: async (id: string): Promise<PublicCountry | undefined> => {
    const countries = await api.getCountries();
    return countries.find(
      (c) => c.id === id || c.code.toLowerCase() === id.toLowerCase() || c.slug === id
    );
  },

  // --- Fields ---
  getFields: async (): Promise<PublicField[]> =>
    isServer ? getPublicFields() : cached("fields", "/api/public/fields"),

  getFieldBySlug: async (slug: string): Promise<PublicField | undefined> => {
    const fields = await api.getFields();
    return fields.find((f) => f.slug === slug || f.id === slug);
  },

  // --- Universities ---
  getUniversities: async (limit?: number): Promise<PublicUniversity[]> =>
    isServer
      ? getPublicUniversities(limit)
      : cached(`universities:${limit ?? "all"}`, `/api/public/universities${toQuery({ limit })}`),

  getUniversityById: async (id: string): Promise<PublicUniversity | undefined> => {
    const list = await api.getUniversities();
    return list.find((u) => u.id === id || u.slug === id);
  },

  // --- Providers ---
  getProviders: async (): Promise<PublicProvider[]> =>
    isServer ? getPublicProviders() : cached("providers", "/api/public/providers"),

  /**
   * Headline counts for the marketing strip. Counted from published records,
   * never hard-coded: a fixed "1,200+" outgrew the database long before the
   * database was real.
   */
  getStats: async (): Promise<PublicStats> =>
    isServer ? getPublicStats() : cached("stats", "/api/public/stats"),

  /**
   * Eligibility matching.
   *
   * Scores each published scholarship against the profile. Kept deliberately
   * explainable: every point comes with a reason, a gap, or a warning, so the
   * UI can show why something did or did not match rather than an opaque score.
   */
  findMatches: async (userProfile: MatchProfile): Promise<MatchResult[]> => {
    // Pull a broad set, then score locally. Bounded so the page stays quick.
    const { data } = await api.getScholarships({ limit: 60, sort: "deadline" });

    const results = data.map((scholarship) => {
      let score = 0;
      const reasons: string[] = [];
      const missing: string[] = [];
      const warnings: string[] = [];

      // 1. Degree level (critical)
      if (userProfile.degreeLevel) {
        if (scholarship.degreeLevels.includes(userProfile.degreeLevel)) {
          score += 35;
          reasons.push(`Degree level matches (${userProfile.degreeLevel})`);
        } else {
          warnings.push(
            `You are looking for ${userProfile.degreeLevel} but this is for ${scholarship.degreeLevels.join(", ") || "other levels"}`
          );
        }
      }

      // 2. Field of study (critical)
      if (userProfile.field) {
        const openToAll = scholarship.fields.some(
          (f) => f === "All" || f.toLowerCase().startsWith("all ")
        );
        if (openToAll) {
          score += 25;
          reasons.push("Open to all fields of study");
        } else if (scholarship.fields.includes(userProfile.field)) {
          score += 30;
          reasons.push(`Field of study matches (${userProfile.field})`);
        } else {
          warnings.push(`Not specifically for ${userProfile.field}`);
        }
      }

      // 3. Destination preference
      if (
        userProfile.targetCountries &&
        userProfile.targetCountries.length > 0 &&
        scholarship.countryId &&
        userProfile.targetCountries.includes(scholarship.countryId)
      ) {
        score += 15;
        reasons.push("Destination country matches your preference");
      }

      // 4. GPA. The form collects GPA as text, so normalise before comparing.
      const profileGpa =
        typeof userProfile.gpa === "number"
          ? userProfile.gpa
          : Number.parseFloat(String(userProfile.gpa ?? ""));
      const hasProfileGpa = Number.isFinite(profileGpa) && profileGpa > 0;

      if (hasProfileGpa && scholarship.minGpa) {
        if (profileGpa >= scholarship.minGpa) {
          score += 10;
          reasons.push(
            `Your GPA (${profileGpa}) meets the requirement (${scholarship.minGpa})`
          );
        } else {
          warnings.push(
            `Your GPA (${profileGpa}) is below the requirement (${scholarship.minGpa})`
          );
          score -= 20;
        }
      } else if (scholarship.minGpa && !userProfile.gpa) {
        missing.push(`Requires minimum GPA of ${scholarship.minGpa}`);
      }

      // 5. Funding
      if (userProfile.needFullFunding) {
        if (scholarship.isFullyFunded || scholarship.fundingType === "fully-funded") {
          score += 15;
          reasons.push("Provides the full funding you requested");
        } else {
          warnings.push(`Does not provide full funding (it is ${scholarship.fundingType})`);
          score -= 10;
        }
      }

      return {
        scholarship,
        score: Math.max(0, Math.min(100, score)),
        reasons,
        missing,
        warnings,
      };
    });

    return results
      .filter((r) => r.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },
};
