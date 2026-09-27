import { getSettingString } from "@/lib/settings";
import {
  SITE_BRANDING_FALLBACK,
  isValidContactEmail,
  type SiteBranding,
} from "@/lib/site-branding";

/**
 * Server-side site identity reader.
 *
 * Kept apart from `lib/site-branding` because that module is imported by client
 * components for its types and fallback values; putting the database read
 * beside them would pull the settings layer - and Prisma - into the browser
 * bundle.
 */
export async function getSiteBranding(): Promise<SiteBranding> {
  const [contactEmail, tagline] = await Promise.all([
    getSettingString("site.contactEmail", SITE_BRANDING_FALLBACK.contactEmail),
    getSettingString("site.tagline", SITE_BRANDING_FALLBACK.tagline),
  ]);

  return {
    contactEmail: isValidContactEmail(contactEmail) ? contactEmail : SITE_BRANDING_FALLBACK.contactEmail,
    tagline: tagline.trim() || SITE_BRANDING_FALLBACK.tagline,
  };
}

export { SITE_BRANDING_FALLBACK };
export type { SiteBranding };
