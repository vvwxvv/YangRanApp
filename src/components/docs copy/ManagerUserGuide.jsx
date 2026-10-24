"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Boxes,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  FileEdit,
  Globe,
  Grid3x3,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  Lightbulb,
  Link2,
  ListOrdered,
  PencilRuler,
  RefreshCw,
  Search,
  Table2,
  Tag,
  User,
  Video,
  X,
} from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useFont from '@/hooks/useFont';
import GUIDE from "@/data/manager_user_guide_doc.json";

/**
 * ManagerUserGuide — the in-app documentation panel.
 *
 * A small tab pinned to the right edge (top: 100px) opens a professional
 * two-column document: a narrow outline on the left (click a chapter to switch
 * the page) and the chapter content on the right. On mobile it becomes a
 * full-screen sheet that first shows the outline, then the chapter with a
 * back button.
 *
 * All copy lives in `src/data/manager_user_guide_doc.json` (bilingual).
 */

const SECTION_ICONS = {
  book: BookOpen,
  layers: Layers,
  edit: FileEdit,
  image: ImageIcon,
  sort: ListOrdered,
  grid: Grid3x3,
  link: Link2,
  tag: Tag,
  table: Table2,
  check: CheckCircle2,
  help: HelpCircle,
  boxes: Boxes,
  ruler: PencilRuler,
  search: Search,
  globe: Globe,
  calendar: Calendar,
  user: User,
  video: Video,
  refresh: RefreshCw,
};

const TONE = {
  tip: { icon: Lightbulb, label: { en: "Tip", cn: "提示" } },
  info: { icon: Info, label: { en: "Note", cn: "说明" } },
  warning: { icon: AlertTriangle, label: { en: "Careful", cn: "注意" } },
};

/** `{ en, cn } | string` → plain string for the active language. */
const pick = (value, isCn) => {
  if (value == null) return "";
  if (typeof value !== "object") return String(value);
  return String((isCn ? value.cn ?? value.CN : value.en ?? value.EN) ?? "");
};

export default function ManagerUserGuide() {
  const { isCn } = useContext(LanguageContext);
  const { isMobile, isTablet } = useContext(DeviceContext);
  const { fontFamily, labelFontFamily } = useFont();

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(GUIDE.sections?.[0]?.id || "");
  const [showOutline, setShowOutline] = useState(true);
  const [query, setQuery] = useState("");

  const sections = useMemo(
    () => (Array.isArray(GUIDE.sections) ? GUIDE.sections : []),
    []
  );
  const parts = useMemo(() => (Array.isArray(GUIDE.parts) ? GUIDE.parts : []), []);
  const active = useMemo(
    () => sections.find((s) => s.id === activeId) || sections[0] || null,
    [sections, activeId]
  );

  // Search across chapter titles, summaries and every block, in both languages.
  const needle = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!needle) return sections;
    return sections.filter((section) => {
      const haystack = [
        pick(section.title, true),
        pick(section.title, false),
        pick(section.summary, true),
        pick(section.summary, false),
        ...(section.blocks || []).flatMap((block) => [
          pick(block.text, true),
          pick(block.text, false),
          ...(block.items || []).flatMap((i) => [pick(i, true), pick(i, false)]),
          ...(block.rows || []).flatMap((row) =>
            Array.isArray(row)
              ? row.flatMap((c) => [pick(c, true), pick(c, false)])
              : [pick(row.k, true), pick(row.k, false), pick(row.v, true), pick(row.v, false)]
          ),
          ...(block.head || []).flatMap((c) => [pick(c, true), pick(c, false)]),
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [sections, needle]);

  // Outline grouped by part (skipped while searching).
  const outline = useMemo(() => {
    if (needle) return [{ id: "__matches", title: null, sections: matches }];
    if (!parts.length) return [{ id: "__all", title: null, sections }];
    return parts
      .map((part) => ({
        ...part,
        sections: sections.filter((s) => s.group === part.id),
      }))
      .filter((p) => p.sections.length);
  }, [parts, sections, matches, needle]);

  // Full-screen only on phones. Tablets get the same centred dialog as the
  // desktop — at 601–1024px it used to stretch edge-to-edge and read like a
  // page instead of a pop-up.
  const compact = Boolean(isMobile);

  const close = useCallback(() => setOpen(false), []);
  const openGuide = useCallback(() => {
    setOpen(true);
    setShowOutline(compact);
  }, [compact]);
  // Esc closes the panel.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const selectSection = useCallback(
    (id) => {
      setActiveId(id);
      if (compact) setShowOutline(false);
    },
    [compact]
  );

  if (!sections.length) return null;

  const textColor = "#000";
  const muted = "rgba(0,0,0,.55)";
  const hairline = "1px solid rgba(0,0,0,.12)";
  const border = "1px solid #000";

  // ── Block renderers ─────────────────────────────────────────────────────
  const renderBlock = (block, index) => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case "paragraph":
        return (
          <p
            key={key}
            style={{
              margin: "0 0 14px",
              fontSize: "14px",
              lineHeight: 1.75,
              color: "rgba(0,0,0,.82)",
              fontFamily,
            }}
          >
            {pick(block.text, isCn)}
          </p>
        );

      case "list":
        return (
          <ul
            key={key}
            style={{
              margin: "0 0 16px",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "9px",
            }}
          >
            {(block.items || []).map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(0,0,0,.82)",
                  fontFamily,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flex: "0 0 auto",
                    width: "5px",
                    height: "5px",
                    marginTop: "10px",
                    borderRadius: "50%",
                    background: "#000",
                  }}
                />
                <span>{pick(item, isCn)}</span>
              </li>
            ))}
          </ul>
        );

      case "steps":
        return (
          <ol
            key={key}
            style={{
              margin: "0 0 16px",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              counterReset: "mgr-step",
            }}
          >
            {(block.items || []).map((item, i) => (
              <li
                key={i}
                style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
              >
                <span
                  style={{
                    flex: "0 0 auto",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    border,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "rgba(0,0,0,.82)",
                    fontFamily,
                    paddingTop: "1px",
                  }}
                >
                  {pick(item, isCn)}
                </span>
              </li>
            ))}
          </ol>
        );

      case "kv":
        return (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", margin: "0 0 16px" }}
          >
            {(block.rows || []).map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "10px 0",
                  borderTop: i === 0 ? "none" : hairline,
                }}
              >
                <span
                  style={{
                    flex: "0 0 168px",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: labelFontFamily,
                    color: textColor,
                  }}
                >
                  {pick(row.k, isCn)}
                </span>
                <span
                  style={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "rgba(0,0,0,.78)",
                    fontFamily,
                  }}
                >
                  {pick(row.v, isCn)}
                </span>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div key={key} style={{ overflowX: "auto", margin: "0 0 16px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily,
                fontSize: "13.5px",
              }}
            >
              <thead>
                <tr>
                  {(block.head || []).map((cell, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: "left",
                        padding: "9px 12px",
                        borderBottom: "1px solid rgba(0,0,0,.35)",
                        fontSize: "12px",
                        letterSpacing: ".04em",
                        textTransform: "uppercase",
                        color: muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pick(cell, isCn)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(block.rows || []).map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        style={{
                          padding: "10px 12px",
                          borderBottom: hairline,
                          color: "rgba(0,0,0,.82)",
                          lineHeight: 1.6,
                          verticalAlign: "top",
                        }}
                      >
                        {pick(cell, isCn)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "note": {
        const tone = TONE[block.tone] || TONE.info;
        const Icon = tone.icon;
        return (
          <div
            key={key}
            style={{
              display: "flex",
              gap: "10px",
              padding: "12px 14px",
              border: hairline,
              borderLeft: "2px solid #000",
              borderRadius: "8px",
              margin: "0 0 16px",
              background: "#fff",
            }}
          >
            <Icon size={15} style={{ flex: "0 0 auto", marginTop: "2px" }} />
            <span
              style={{
                fontSize: "13.5px",
                lineHeight: 1.7,
                color: "rgba(0,0,0,.8)",
                fontFamily,
              }}
            >
              <strong style={{ fontWeight: 600 }}>
                {pick(tone.label, isCn)}:{" "}
              </strong>
              {pick(block.text, isCn)}
            </span>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .mgr-guide-tab { transition: transform .18s ease, background .18s ease; }
        .mgr-guide-tab:hover { transform: translateX(-3px); }
        .mgr-guide-row { transition: background .12s ease; }
        .mgr-guide-row:hover { background: rgba(0,0,0,.03); }
      `}</style>

      {/* Floating tab — right edge, 100px from the top, vertical label */}
      <button
        type="button"
        className="mgr-guide-tab"
        onClick={openGuide}
        title={pick(GUIDE.title, isCn)}
        aria-label={pick(GUIDE.title, isCn)}
        style={{
          position: "fixed",
          top: "100px",
          right: 0,
          zIndex: 1200,
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          padding: "12px 9px 14px",
          border: "1px solid #000",
          borderRight: "none",
          borderRadius: "10px 0 0 10px",
          background: "#fff",
          color: "#000",
          cursor: "pointer",
          fontFamily,
          fontSize: "12.5px",
          fontWeight: 500,
          boxShadow: "none",
          lineHeight: 1,
        }}
      >
        <BookOpen size={15} />
        <span
          style={{
            // Vertical label (like a bookmark tab): CJK stays upright,
            // Latin glyphs rotate — set on the text only so the icon and
            // layout stay horizontal.
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            letterSpacing: ".1em",
          }}
        >
          {pick(GUIDE.badge, isCn)}
        </span>
      </button>

      {open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            background: "rgba(0,0,0,.32)",
            display: "flex",
            alignItems: compact ? "stretch" : "center",
            justifyContent: "center",
            padding: compact ? 0 : "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: compact && showOutline ? "column" : "row",
              width: compact ? "100%" : "min(1080px, 92vw)",
              height: compact ? "100%" : "min(760px, 84vh)",
              background: "#fff",
              border: compact ? "none" : border,
              borderRadius: compact ? 0 : "16px",
              boxShadow: compact ? "none" : "0 24px 80px rgba(0,0,0,.18)",
              overflow: "hidden",
              fontFamily,
            }}
          >
            {/* ── Outline column ─────────────────────────────────────────── */}
            {(!compact || showOutline) && (
              <aside
                style={{
                  flex: compact ? "1 1 auto" : "0 0 268px",
                  width: compact ? "100%" : "268px",
                  borderRight: compact ? "none" : hairline,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    padding: "20px 20px 14px",
                    borderBottom: hairline,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          letterSpacing: ".01em",
                          marginBottom: "6px",
                        }}
                      >
                        {pick(GUIDE.title, isCn)}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          lineHeight: 1.6,
                          color: muted,
                        }}
                      >
                        {pick(GUIDE.subtitle, isCn)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      aria-label={isCn ? "关闭" : "Close"}
                      style={{
                        flex: "0 0 auto",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        border: hairline,
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                <nav
                  style={{
                    flex: "1 1 auto",
                    overflowY: "auto",
                    padding: "10px 8px 16px",
                    minHeight: 0,
                  }}
                >
                  {/* Search */}
                  <div style={{ padding: "0 6px 10px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: hairline,
                        borderRadius: "8px",
                        padding: "7px 10px",
                      }}
                    >
                      <Search size={13} style={{ opacity: 0.55, flex: "0 0 auto" }} />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={pick(GUIDE.searchPlaceholder, isCn)}
                        aria-label={pick(GUIDE.searchPlaceholder, isCn)}
                        style={{
                          flex: "1 1 auto",
                          minWidth: 0,
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          color: "#000",
                          fontFamily,
                          fontSize: "12.5px",
                        }}
                      />
                      {query ? (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label={isCn ? "清除" : "Clear"}
                          style={{
                            flex: "0 0 auto",
                            display: "inline-flex",
                            alignItems: "center",
                            border: "none",
                            background: "transparent",
                            color: "#000",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          <X size={12} />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {outline.map((group) => (
                    <div key={group.id} style={{ marginBottom: "6px" }}>
                      {group.title ? (
                        <div
                          style={{
                            padding: "12px 12px 6px",
                            fontSize: "10.5px",
                            letterSpacing: ".12em",
                            textTransform: "uppercase",
                            color: muted,
                            fontWeight: 600,
                          }}
                        >
                          {pick(group.title, isCn)}
                        </div>
                      ) : null}

                      {group.sections.map((section) => {
                        const Icon = SECTION_ICONS[section.icon] || BookOpen;
                        const isActive = section.id === active?.id;
                        return (
                          <button
                            key={section.id}
                            type="button"
                            className="mgr-guide-row"
                            onClick={() => selectSection(section.id)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "9px 12px",
                              marginBottom: "2px",
                              border: "none",
                              borderLeft: isActive
                                ? "2px solid #000"
                                : "2px solid transparent",
                              borderRadius: "0 8px 8px 0",
                              background: "#fff",
                              color: "#000",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily,
                              fontSize: "13px",
                              fontWeight: isActive ? 600 : 450,
                            }}
                          >
                            <Icon
                              size={14}
                              style={{ flex: "0 0 auto", opacity: isActive ? 1 : 0.6 }}
                            />
                            <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                              {pick(section.title, isCn)}
                            </span>
                            <ChevronLeft
                              size={13}
                              style={{
                                flex: "0 0 auto",
                                transform: "rotate(180deg)",
                                opacity: isActive ? 0.9 : 0.25,
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {!matches.length ? (
                    <div
                      style={{
                        padding: "18px 12px",
                        fontSize: "12.5px",
                        color: muted,
                        fontFamily,
                      }}
                    >
                      {pick(GUIDE.noResults, isCn)}
                    </div>
                  ) : null}
                </nav>

                <div
                  style={{
                    padding: "12px 20px 16px",
                    borderTop: hairline,
                    fontSize: "11.5px",
                    color: muted,
                  }}
                >
                  {isCn ? "更新于" : "Updated"} {GUIDE.updated}
                </div>
              </aside>
            )}

            {/* ── Content column ────────────────────────────────────────── */}
            {(!compact || !showOutline) && (
              <section
                style={{
                  flex: "1 1 auto",
                  minWidth: 0,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <header
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "18px 28px 14px",
                    borderBottom: hairline,
                  }}
                >
                  {compact && (
                    <button
                      type="button"
                      onClick={() => setShowOutline(true)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 10px",
                        border: hairline,
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#000",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontFamily,
                      }}
                    >
                      <ChevronLeft size={13} />
                      {pick(GUIDE.backLabel, isCn)}
                    </button>
                  )}
                  <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "19px",
                        fontWeight: 700,
                        letterSpacing: ".01em",
                      }}
                    >
                      {pick(active?.title, isCn)}
                    </h2>
                    {active?.summary && (
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12.5px",
                          lineHeight: 1.6,
                          color: muted,
                        }}
                      >
                        {pick(active.summary, isCn)}
                      </p>
                    )}
                  </div>
                  {!compact && (
                    <button
                      type="button"
                      onClick={close}
                      aria-label={isCn ? "关闭" : "Close"}
                      style={{
                        flex: "0 0 auto",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "30px",
                        height: "30px",
                        border: hairline,
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#000",
                        cursor: "pointer",
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </header>

                <div
                  style={{
                    flex: "1 1 auto",
                    overflowY: "auto",
                    padding: compact ? "18px 20px 40px" : "22px 28px 44px",
                    minHeight: 0,
                  }}
                >
                  {(active?.blocks || []).map(renderBlock)}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
