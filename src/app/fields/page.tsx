import { Container } from "@/components/layout/Layout";
import { FieldsBrowser } from "@/components/public/FieldsBrowser";
import { getPublicFields } from "@/lib/data/public";

export default async function FieldsPage() {
  const fields = await getPublicFields();

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <span>Academic Disciplines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Scholarships by Field of Study
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Browse specialized funding opportunities for Computer Science, Engineering, Medicine,
            Business, Humanities, and Sciences.
          </p>
        </div>

        <FieldsBrowser fields={fields} />
      </Container>
    </div>
  );
}
