import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Layout";
import { faqs } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about how Global Scholarship Hub works, what our verification and match scores mean, how we handle your data, and how to submit or advertise with us.",
};

export default function FAQPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container size="md">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            Everything about how the platform works, how we verify information, and what we do
            with your data. If your question is not answered here, please{" "}
            <Link href="/contact" className="font-semibold text-primary-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>

        {/* Trust note */}
        <div className="mb-8 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 text-sm text-primary-900">
          <p className="leading-relaxed">
            We are an independent information platform. We do not award funding and we do not
            accept applications. Every application is submitted on the awarding organisation&apos;s
            own website, and only they can determine your eligibility.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="mb-4 text-lg font-bold text-gray-900">{category}</h2>
              <div className="space-y-3">
                {faqs
                  .filter((f) => f.category === category)
                  .map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-2xl border border-gray-200 bg-white shadow-xs"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-gray-900 marker:content-none">
                        {faq.question}
                        <span
                          aria-hidden="true"
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="border-t border-gray-100 px-5 py-4">
                        <p className="text-sm leading-relaxed text-gray-700">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
          <h2 className="text-xl font-bold text-gray-900">Still have a question?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
            Our team responds within 24&ndash;48 hours. We are happy to help you understand how a
            listing works, or point you to the official source for a programme.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Contact Us
            </Link>
            <Link
              href="/finder"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Use the Scholarship Finder
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
