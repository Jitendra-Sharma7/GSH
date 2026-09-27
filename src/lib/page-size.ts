/**
 * Shared page sizes.
 *
 * A plain module, deliberately not a client component: importing a value from a
 * `"use client"` file into a server component yields a client reference rather
 * than the real value, which silently breaks the server-side read.
 */

/** Scholarships per page in the browse view. */
export const SCHOLARSHIP_PAGE_SIZE = 9;

/** Countries per page in the countries directory. */
export const COUNTRY_PAGE_SIZE = 12;
