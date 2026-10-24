"use client";

/**
 * MarkChips — a tiny, registry-driven read-only view of a record's marks.
 *
 * Editors can see at a glance which pages a record is hidden from and which
 * flags it carries, without opening the order pages. Labels come from the mark
 * registry (`utils/markRegistry`), so a new mark shows up here automatically.
 *
 * ⌀ Hidden on Artist Page Artist Name Hover Image +2
 *
 * `showToken` appends the raw token (e.g. `artist_hover_image`) so a manager
 * can tell two similar-looking marks apart at a glance.
 *
 * Never renders a raw object, tolerates unknown tokens and empty marks.
 */

import React, { useContext } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { markLabel, marksSummary } from "@/utils/mediaMarks";

const BASE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  padding: "2px 7px",
  borderRadius: 999,
  fontSize: 10.5,
  lineHeight: 1.6,
  whiteSpace: "nowrap",
  border: "1px solid",
};

const STYLES = {
  value: { ...BASE, borderColor: "rgba(0,0,0,.25)", background: "#fff", color: "#000" },
  hide: { ...BASE, borderColor: "rgba(192,57,43,.35)", background: "rgba(192,57,43,.07)", color: "#c0392b" },
  flag: { ...BASE, borderColor: "rgba(10,125,50,.35)", background: "rgba(10,125,50,.07)", color: "#0a7d32" },
  more: { ...BASE, borderColor: "rgba(0,0,0,.2)", background: "#f4f4f4", color: "rgba(0,0,0,.6)" },
};

const TOKEN = {
  marginLeft: 4,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 10,
  opacity: 0.55,
};

export default function MarkChips({ mark, max = 4, showToken = false }) {
  const { isCn } = useContext(LanguageContext);
  const { value, hides, flags } = marksSummary(mark);

  const chips = [
    ...(value ? [{ kind: "value", token: null, text: value }] : []),
    ...hides.map((t) => ({ kind: "hide", token: t, text: markLabel(t, isCn) })),
    ...flags.map((t) => ({ kind: "flag", token: t, text: markLabel(t, isCn) })),
  ];

  if (!chips.length) return null;

  const shown = chips.slice(0, max);
  const rest = chips.length - shown.length;

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
      {shown.map((chip, i) => (
        <span
          key={`${chip.kind}-${i}`}
          style={STYLES[chip.kind]}
          title={chip.token ? `${chip.text} · ${chip.token}` : chip.text}
        >
          {chip.kind === "hide" ? "⌀ " : chip.kind === "flag" ? "★ " : ""}
          {chip.text}
          {showToken && chip.token ? <span style={TOKEN}>{chip.token}</span> : null}
        </span>
      ))}
      {rest > 0 && (
        <span
          style={STYLES.more}
          title={chips.slice(max).map((c) => (c.token ? `${c.text} · ${c.token}` : c.text)).join("  |  ")}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
