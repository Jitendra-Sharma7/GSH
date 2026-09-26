import type { Metadata } from "next";
import "./globals.css";
import { Inter, Merriweather } from "next/font/google";
import { Providers } from "./providers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
  display: "swap",
});

/**
 * Absolute origin for canonical URLs and OpenGraph/Twitter image resolution.
 * Without it Next.js falls back to http://localhost:3000, which makes social
 * cards resolve to the wrong host in production.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://globalscholarshiphub.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Global Scholarship Hub | Global Scholarship Discovery Platform",
    template: "%s | Global Scholarship Hub",
  },
  description:
    "Discover, filter, compare, save, and apply for scholarships, grants, fellowships, and financial-aid opportunities from around the world. Find the funding for your future.",
  keywords: [
    "scholarships",
    "grants",
    "fellowships",
    "financial aid",
    "tuition waivers",
    "study abroad",
    "international students",
    "fully funded scholarships",
    "master's scholarships",
    "PhD scholarships",
    "undergraduate scholarships",
  ],
  authors: [{ name: "Global Scholarship Hub" }],
  creator: "Global Scholarship Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Global Scholarship Hub",
    title: "Global Scholarship Hub | Global Scholarship Discovery Platform",
    description:
      "Discover, filter, compare, save, and apply for scholarships from around the world.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ScholarAtlas - Find Scholarships. Fund Your Future.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarAtlas | Global Scholarship Discovery Platform",
    description:
      "Discover, filter, compare, save, and apply for scholarships from around the world.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${merriweather.variable}`}
    >
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}