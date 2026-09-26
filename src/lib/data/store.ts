import { mockCountries, CountryData } from './mock-countries';
import { mockFields, FieldData } from './mock-fields';
import { mockUniversities, UniversityData } from './mock-universities';
import { mockProviders, ProviderData } from './mock-providers';
import { databaseScholarships, ScholarshipData } from './mock-scholarships';

export interface FilterOptions {
  query?: string;
  country?: string;
  field?: string;
  degree?: string;
  funding?: string;
  status?: string;
  page?: number;
  limit?: number;
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
  scholarship: ScholarshipData;
  score: number;
  reasons: string[];
  missing?: string[];
  warnings?: string[];
}

// Data fetching layer to simulate a database or API
export const api = {
  // --- Scholarships ---
  getScholarships: async (filters: FilterOptions): Promise<PaginatedResult<ScholarshipData>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let result = [...databaseScholarships];

    // Apply filters
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.fields.some(f => f.toLowerCase().includes(q))
      );
    }

    if (filters.country) {
      result = result.filter(s => s.countryId === filters.country);
    }

    if (filters.field) {
      if (filters.field !== 'all') {
        result = result.filter(s =>
          s.fields.includes(filters.field!) ||
          s.fields.includes("All") ||
          s.fields.includes("All fields at U of T") ||
          s.fields.includes("All disciplines offered at Stanford")
        );
      }
    }

    if (filters.degree) {
      result = result.filter(s => s.degreeLevels.includes(filters.degree!));
    }

    if (filters.funding) {
      result = result.filter(s => s.fundingType === filters.funding);
    }

    if (filters.status) {
      result = result.filter(s => s.status.toLowerCase() === filters.status!.toLowerCase());
    } else {
      // Default to showing Open and Opening Soon
      result = result.filter(s => s.status === 'Open' || s.status === 'Opening Soon');
    }

    // Process pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedData = result.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
      hasMore: page < totalPages
    };
  },

  getScholarshipById: async (id: string): Promise<ScholarshipData | undefined> => {
    return databaseScholarships.find(s => s.id === id);
  },

  // --- Countries ---
  getCountries: async (): Promise<CountryData[]> => {
    return mockCountries.sort((a, b) => a.name.localeCompare(b.name));
  },

  getCountryById: async (id: string): Promise<CountryData | undefined> => {
    return mockCountries.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  },

  // --- Fields ---
  getFields: async (): Promise<FieldData[]> => {
    return mockFields.sort((a, b) => a.name.localeCompare(b.name));
  },

  getFieldBySlug: async (slug: string): Promise<FieldData | undefined> => {
    return mockFields.find(f => f.slug === slug || f.id === slug);
  },

  // --- Universities ---
  getUniversities: async (limit?: number): Promise<UniversityData[]> => {
    const list = mockUniversities.sort((a, b) => a.ranking - b.ranking);
    return limit ? list.slice(0, limit) : list;
  },

  getUniversityById: async (id: string): Promise<UniversityData | undefined> => {
    return mockUniversities.find(u => u.id === id);
  },

  // --- Providers ---
  getProviders: async (): Promise<ProviderData[]> => {
    return mockProviders;
  },

  // --- Matching Engine Algorithm ---
  findMatches: async (userProfile: MatchProfile): Promise<MatchResult[]> => {
    // A simplified matching algorithm demonstrating the MVP behavior for AI matching
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate complex calculation

    const activeScholarships = databaseScholarships.filter(s => s.status === 'Open' || s.status === 'Opening Soon');

    const results = activeScholarships.map(scholarship => {
      let score = 0;
      const reasons: string[] = [];
      const missing: string[] = [];
      const warnings: string[] = [];

      // 1. Check Degree Level Match (Critical)
      if (userProfile.degreeLevel && scholarship.degreeLevels.includes(userProfile.degreeLevel)) {
        score += 35;
        reasons.push(`Degree level matches (${userProfile.degreeLevel})`);
      } else if (userProfile.degreeLevel) {
        warnings.push(`You are looking for ${userProfile.degreeLevel} but this is for ${scholarship.degreeLevels.join(', ')}`);
      }

      // 2. Check Field Match (Critical)
      if (userProfile.field) {
        if (scholarship.fields.includes("All") ||
            scholarship.fields.includes("All fields at U of T") ||
            scholarship.fields.includes("All disciplines offered at Stanford")) {
          score += 25;
          reasons.push("Open to all fields of study");
        } else if (scholarship.fields.includes(userProfile.field)) {
          score += 30;
          reasons.push(`Field of study matches (${userProfile.field})`);
        } else {
          warnings.push(`Not specifically for ${userProfile.field}`);
        }
      }

      // 3. Country Preference Match
      if (userProfile.targetCountries && userProfile.targetCountries.length > 0) {
        if (userProfile.targetCountries.includes(scholarship.countryId)) {
          score += 15;
          reasons.push(`Destination country matches your preference`);
        }
      }

      // 4. GPA Evaluation
      // The form collects GPA as text, so normalise before comparing numerically.
      const profileGpa =
        typeof userProfile.gpa === "number"
          ? userProfile.gpa
          : Number.parseFloat(String(userProfile.gpa ?? ""));
      const hasProfileGpa = Number.isFinite(profileGpa) && profileGpa > 0;

      if (hasProfileGpa && scholarship.minGpa) {
        if (profileGpa >= scholarship.minGpa) {
          score += 10;
          reasons.push(`Your GPA (${profileGpa}) meets the requirement (${scholarship.minGpa})`);
        } else {
          warnings.push(`Your GPA (${profileGpa}) is below the requirement (${scholarship.minGpa})`);
          // Penalize score if critical requirement missed
          score -= 20;
        }
      } else if (scholarship.minGpa && !userProfile.gpa) {
        missing.push(`Requires minimum GPA of ${scholarship.minGpa}`);
      }

      // 5. Funding Match
      if (userProfile.needFullFunding) {
        if (scholarship.fundingType === "fully-funded") {
          score += 15;
          reasons.push("Provides the full funding you requested");
        } else {
          warnings.push(`Does not provide full funding (it is ${scholarship.fundingType})`);
          score -= 10;
        }
      }

      // Normalize score 0-100
      score = Math.max(0, Math.min(100, score));

      return {
        scholarship,
        score,
        reasons,
        missing,
        warnings
      };
    });

    // Sort by score descending and return top matches
    return results
      .filter(r => r.score > 40) // Only return plausible matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
};
