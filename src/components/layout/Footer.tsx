"use client";

import React from "react";
import Link from "next/link";
import { Container, Grid } from "@/components/layout/Layout";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container>
        <div className="py-12 lg:py-16">
          <Grid cols={4} gap="lg" className="mb-12">
            <div className="col-span-1 sm:col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-lg">
                  GSH
                </div>
                <span className="text-xl font-bold text-white">Global Scholarship Hub</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm text-gray-400">
                Helping students worldwide discover, compare, and apply for scholarships, grants, fellowships, and financial-aid opportunities.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Explore</h4>
              <ul className="space-y-3">
                {[
                  { label: "Scholarships", href: "/scholarships" },
                  { label: "Universities", href: "/universities" },
                  { label: "Countries", href: "/countries" },
                  { label: "Fields of Study", href: "/fields" },
                  { label: "Fully Funded", href: "/fully-funded" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Resources</h4>
              <ul className="space-y-3">
                {[
                  { label: "Scholarship Guides", href: "/resources" },
                  { label: "Blog", href: "/blog" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Scholarship Finder", href: "/finder" },
                  { label: "Deadline Calendar", href: "/deadlines" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">For Organizations</h4>
              <ul className="space-y-3">
                {[
                  { label: "Submit a Scholarship", href: "/submit-scholarship" },
                  { label: "Partner With Us", href: "/advertise#ways-to-work-with-us" },
                  { label: "Advertising Policy", href: "/advertise#advertising-policy" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Grid>

          <div className="border-t border-gray-800 pt-8">
            <Grid cols={3} gap="lg" className="mb-8">
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
                <ul className="space-y-3">
                  {[
                    { label: "About", href: "/about" },
                    { label: "Contact", href: "/contact" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms of Service", href: "/terms" },
                    { label: "Cookie Policy", href: "/cookies" },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("gs:open-consent"))
                  }
                  className="mt-3 text-sm text-gray-400 underline-offset-2 transition-colors hover:text-white hover:underline"
                >
                  Manage cookie consent
                </button>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:hello@scholaratlas.org" className="text-sm text-gray-400 hover:text-white">
                      hello@scholaratlas.org
                    </a>
                  </li>
                  <li>
                    <span className="text-sm text-gray-400">Global (Online)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Newsletter</h4>
                <p className="mb-3 text-sm text-gray-400">Get scholarship alerts and guides.</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </Grid>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row">
              <p className="text-sm text-gray-500">
                © 2026 Global Scholarship Hub. All rights reserved.
              </p>
              <span className="text-sm text-gray-500">Built for students, by education enthusiasts.</span>
              <p className="text-xs text-gray-600">
                Disclaimer: Global Scholarship Hub is an information platform. We do not guarantee eligibility or acceptance. Always verify requirements with official providers.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}