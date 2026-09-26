import { getSettingString } from "@/lib/settings";

/**
 * Site identity values shown in the public layout.
 *
 * Kept separate from `lib/settings` so a component can ask for exactly the
 * branding it needs without knowing the storage keys, and so a missing setting
 * degrades to a sensible default rather than rendering an empty string.
 */

export interface SiteBranding {
  contactEmail: string;
  tagline: string;
}

const FALLBACK: SiteBranding = {
  contactEmail: "hello@globalscholarshiphub.com",
  tagline:
    "Helping students worldwide discover, compare, and apply for scholarships, grants, fellowships, and financial-aid opportunities.",
};

export async function getSiteBranding(): Promise<SiteBranding> {
  const [contactEmail, tagline] = await Promise.all([
    getSettingString("site.contactEmail", FALLBACK.contactEmail),
    getSettingString("site.tagline", FALLBACK.tagline),
  ]);

  return {
    // A stored value that is not an address is a mistake; showing it would put a
    // broken `mailto:` on every page.
    contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? contactEmail : FALLBACK.contactEmail,
    tagline: tagline.trim() || FALLBACK.tagline,
  };
}

export { FALLBACK as SITE_BRANDING_FALLBACK };
