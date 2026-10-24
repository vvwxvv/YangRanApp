// utils/patternPassword.ts
// Next.js exposes NEXT_PUBLIC_* variables to the browser at build time.
export const EXPECTED_PATTERN: number[] =
  process.env.PATTERN_UNLOCK_PASSWORD
    ?.split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n)) ?? [];