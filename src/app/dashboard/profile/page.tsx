import { getPublicCountries, getPublicFields } from "@/lib/data/public";
import { ProfileForm } from "./ProfileForm";

/**
 * Server entry point. Options are read from published records here and handed to
 * the form, so the browser never fetches them.
 */
export default async function ProfilePage() {
  const [countries, fields] = await Promise.all([getPublicCountries(), getPublicFields()]);

  return <ProfileForm countries={countries} fields={fields} />;
}
