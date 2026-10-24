/**
 * isHomepage
 * Returns true when the given pathname is the root "/".
 * Pass `usePathname()` from Next.js for reactive SSR-safe checks.
 */
export const isHomepage = (pathname) => pathname === "/";