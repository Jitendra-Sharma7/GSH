"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Send } from "lucide-react";
import toast from "react-hot-toast";

import { SUBMISSION_TYPE_LABELS } from "@/lib/validations/submission";
import { submitScholarship } from "@/app/actions/submission-actions";

/**
 * Submission form.
 *
 * Submits through a server action rather than the public JSON route, and
 * reports what the server actually decided. There is no simulated delay and no
 * optimistic success state: telling someone their submission reached the review
 * queue when it did not is worse than an error message.
 */

interface CountryOption {
  id: string;
  name: string;
  code: string;
}

interface FormState {
  type: string;
  title: string;
  submitterName: string;
  submitterEmail: string;
  officialUrl: string;
  countryName: string;
  description: string;
  deadline: string;
  fundingAmount: string;
  currency: string;
  degreeLevels: string;
}

const INITIAL: FormState = {
  type: "SCHOLARSHIP",
  title: "",
  submitterName: "",
  submitterEmail: "",
  officialUrl: "",
  countryName: "",
  description: "",
  deadline: "",
  fundingAmount: "",
  currency: "",
  degreeLevels: "",
};

const FIELD =
  "w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none";
const LABEL = "block text-xs font-semibold uppercase text-gray-700 mb-1";

export function SubmitScholarshipForm({ countries }: { countries: CountryOption[] }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const data = await submitScholarship({
        type: form.type,
        title: form.title,
        submitterName: form.submitterName,
        submitterEmail: form.submitterEmail,
        officialUrl: form.officialUrl,
        countryName: form.countryName,
        description: form.description,
        deadline: form.deadline,
        fundingAmount: form.fundingAmount,
        currency: form.currency,
        degreeLevels: form.degreeLevels,
      });

      if (!data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        toast.error(data.error);
        return;
      }

      setResult({ id: data.id, message: data.message });
      toast.success("Submission received.");
    } catch {
      // A failed call must not read as a queued submission.
      toast.error("We could not reach the server. Your submission was not sent.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-950">Submission received</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
          {result.message} It is queued for manual review, where a member of the team checks it
          against the official source you provided. We do not publish a fixed turnaround time.
        </p>
        {result.id ? (
          <p className="mt-3 text-xs text-gray-500">
            Your reference:{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px]">{result.id}</code>
          </p>
        ) : null}
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(INITIAL);
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Submit another
          </button>
          <Link
            href="/scholarships"
            className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
          >
            Browse scholarships
          </Link>
        </div>
      </div>
    );
  }

  const error = (name: string) =>
    fieldErrors[name] ? (
      <p className="mt-1 text-[11px] font-medium text-red-600">{fieldErrors[name]}</p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10"
    >
      <h2 className="border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
        1. What are you submitting?
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={LABEL}>
            Submission type *
          </label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className={FIELD}
          >
            {Object.entries(SUBMISSION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className={LABEL}>
            {form.type === "COUNTRY" ? "Country name" : "Name of the opportunity"} *
          </label>
          <input
            id="title"
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Vice-Chancellor's Excellence Scholarship 2027"
            className={FIELD}
            aria-describedby={fieldErrors.title ? "title-error" : undefined}
          />
          {error("title")}
        </div>

        {form.type === "SCHOLARSHIP" ? (
          <div>
            <label htmlFor="countryName" className={LABEL}>
              Destination country
            </label>
            <select
              id="countryName"
              value={form.countryName}
              onChange={(e) => update("countryName", e.target.value)}
              className={FIELD}
            >
              <option value="">Not listed / not sure</option>
              {countries.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-500">
              {countries.length} countries listed. Pick &ldquo;not listed&rdquo; if yours is missing.
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className={LABEL}>
          Details *
        </label>
        <textarea
          id="description"
          rows={5}
          required
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="What is funded, who is eligible, how to apply, and anything a student should know before applying."
          className={FIELD}
        />
        {error("description")}
        <p className="mt-1 text-[11px] text-gray-500">
          Link to the provider&apos;s own page in the field below. We verify against that source, so a
          third-party summary is not enough.
        </p>
      </div>

      <h2 className="border-b border-gray-100 pb-3 pt-4 text-lg font-bold text-gray-900">
        2. Official source and funding
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="officialUrl" className={LABEL}>
            Official provider page *
          </label>
          <input
            id="officialUrl"
            type="url"
            required
            value={form.officialUrl}
            onChange={(e) => update("officialUrl", e.target.value)}
            placeholder="https://provider.edu/scholarships"
            className={FIELD}
          />
          {error("officialUrl")}
        </div>

        <div>
          <label htmlFor="deadline" className={LABEL}>
            Application deadline
          </label>
          <input
            id="deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            className={FIELD}
          />
          {error("deadline")}
          <p className="mt-1 text-[11px] text-gray-500">Leave blank if it is rolling or not yet set.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="fundingAmount" className={LABEL}>
            Funding amount
          </label>
          <input
            id="fundingAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.fundingAmount}
            onChange={(e) => update("fundingAmount", e.target.value)}
            placeholder="25000"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="currency" className={LABEL}>
            Currency
          </label>
          <input
            id="currency"
            type="text"
            maxLength={10}
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            placeholder="GBP"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="degreeLevels" className={LABEL}>
            Degree levels
          </label>
          <input
            id="degreeLevels"
            type="text"
            value={form.degreeLevels}
            onChange={(e) => update("degreeLevels", e.target.value)}
            placeholder="Master's, PhD"
            className={FIELD}
          />
          <p className="mt-1 text-[11px] text-gray-500">Comma separated.</p>
        </div>
      </div>

      <h2 className="border-b border-gray-100 pb-3 pt-4 text-lg font-bold text-gray-900">
        3. Who you are
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="submitterName" className={LABEL}>
            Your name *
          </label>
          <input
            id="submitterName"
            type="text"
            autoComplete="name"
            required
            value={form.submitterName}
            onChange={(e) => update("submitterName", e.target.value)}
            className={FIELD}
          />
          {error("submitterName")}
        </div>
        <div>
          <label htmlFor="submitterEmail" className={LABEL}>
            Your email *
          </label>
          <input
            id="submitterEmail"
            type="email"
            autoComplete="email"
            required
            value={form.submitterEmail}
            onChange={(e) => update("submitterEmail", e.target.value)}
            placeholder="you@organization.edu"
            className={FIELD}
          />
          {error("submitterEmail")}
          <p className="mt-1 text-[11px] text-gray-500">
            Used only to follow up on this submission. Not shown publicly.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 disabled:opacity-50"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {loading ? "Sending..." : "Send for verification"}
      </button>

      <p className="text-center text-[11px] text-gray-500">
        By sending this you confirm the details come from the provider, not from a third party. We may
        contact you to verify before publishing.
      </p>
    </form>
  );
}
