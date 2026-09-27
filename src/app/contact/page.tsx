import { getSiteBranding } from "@/lib/site-branding-server";
import { ContactForm } from "./ContactForm";

/**
 * The contact address is read from settings here, so changing
 * `site.contactEmail` updates this page as well as the footer, instead of the
 * two drifting apart with a hard-coded address in each.
 */
export default async function ContactPage() {
  const { contactEmail } = await getSiteBranding();
  return <ContactForm contactEmail={contactEmail} />;
}
