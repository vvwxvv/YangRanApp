"use client";

// Shared Bauhaus "»" / "«" chevron icons — the SAME arrow used by the home
// sections and the archive, so every "go" affordance matches.
export function ChevronsRight({ size = 24, stroke = 2.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" style={style}>
      <polyline points="6 5 10 12 6 19" />
      <polyline points="11 5 15 12 11 19" />
      <polyline points="16 5 20 12 16 19" />
    </svg>
  );
}

export function ChevronsLeft({ size = 24, stroke = 2.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" style={style}>
      <polyline points="18 5 14 12 18 19" />
      <polyline points="13 5 9 12 13 19" />
      <polyline points="8 5 4 12 8 19" />
    </svg>
  );
}
