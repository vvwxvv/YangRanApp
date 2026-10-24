"use client";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion } from "framer-motion";
import { Image, Calendar, Tag, User, Layers, Folder, FileText } from "lucide-react";
import useFont from '@/hooks/useFont';

const createButtonStyles = (isDark, fontFamily) => ({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    minWidth: "96px",
    height: "28px",
    fontSize: "13px",
    fontFamily,
    fontWeight: 500,
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
    color: isDark ? "#ffffff" : "#000000",
    outline: "none",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  selected: {
    fontWeight: 600,
  },
  hover: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
});

// Standalone/default usage (string values). Kept for backward compatibility
// with any callers that don't pass `sources` at all.
const DEFAULT_SOURCES = [
  { value: "artwork", label: "Artwork", icon: Image },
  { value: "event", label: "Event", icon: Calendar },
  { value: "about", label: "About", icon: User },
  { value: "custom", label: "Custom", icon: Tag },
];

// Icon fallback map, keyed by a string identifier. Used when a source
// entry doesn't carry its own `icon` component — covers both the legacy
// string `value`s (e.g. "artwork") and the registry `key`s (e.g. "series").
// "none" intentionally has no icon.
const ICON_BY_KEY = {
  artwork: Image,
  event: Calendar,
  about: User,
  custom: Tag,
  series: Layers,
  project: Folder,
  writing: FileText,
};

// Resolve an icon for a source entry:
// 1. an explicit `icon` component on the entry wins
// 2. otherwise look up by `key` (registry-style entries)
// 3. otherwise look up by `value` if it's a string (legacy entries)
// 4. otherwise no icon
const resolveIcon = (source) => {
  if (source.icon) return source.icon;
  if (source.key && ICON_BY_KEY[source.key]) return ICON_BY_KEY[source.key];
  if (typeof source.value === "string" && ICON_BY_KEY[source.value]) {
    return ICON_BY_KEY[source.value];
  }
  return null;
};

const TagSourceToggle = ({
  tagSource,
  onToggle,
  sources = DEFAULT_SOURCES,
  disabled = false,
  allowDeselect = false,
  showIcons = true,
  disableAnimation = false,
  isArtistweb = false,
  testId,
}) => {
  const { fontFamily } = useFont();
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark"
      );
    };
    updateTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
    return () =>
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", updateTheme);
  }, []);

  // Only filter out an "about" entry when callers pass the legacy
  // string-keyed sources (value === "about" or key === "about").
  // Registry-driven sources (numeric `value`, no "about" entry at all
  // since the About model has no title/language fields) pass through
  // unfiltered.
  const filteredSources = useMemo(() => {
    if (isArtistweb) return sources;
    return sources.filter((s) => s.value !== "about" && s.key !== "about");
  }, [sources, isArtistweb]);

  const handleToggle = useCallback(
    (value) => {
      if (disabled) return;
      if (allowDeselect && tagSource === value) {
        onToggle(null);
      } else {
        onToggle(value);
      }
    },
    [disabled, allowDeselect, tagSource, onToggle]
  );

  const buttonStyles = useMemo(
    () => createButtonStyles(isDark, fontFamily),
    [isDark, fontFamily]
  );

  const MotionButton = disableAnimation ? "button" : motion.button;

  return (
    <div
      ref={containerRef}
      data-testid={testId}
      style={{
        padding: "8px 0",
        background: "transparent",
      }}
      role="radiogroup"
    >
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {filteredSources.map((source) => {
          const { value, label } = source;
          const Icon = resolveIcon(source);
          const selected = tagSource === value;
          return (
            <MotionButton
              key={String(value)}
              type="button"
              onClick={() => handleToggle(value)}
              disabled={disabled}
              aria-pressed={selected}
              role="radio"
              aria-checked={selected}
              style={{
                ...buttonStyles.base,
                ...(selected ? buttonStyles.selected : {}),
                ...(isHovered[value] ? buttonStyles.hover : {}),
                ...(disabled ? buttonStyles.disabled : {}),
              }}
              onMouseEnter={() =>
                setIsHovered((p) => ({ ...p, [value]: true }))
              }
              onMouseLeave={() =>
                setIsHovered((p) => ({ ...p, [value]: false }))
              }
              {...(!disableAnimation && {
                whileHover: { scale: 1.03 },
                whileTap: { scale: 0.97 },
              })}
            >
              {showIcons && Icon && (
                <Icon size={14} style={{ marginRight: 6 }} />
              )}
              {label}
            </MotionButton>
          );
        })}
      </div>
    </div>
  );
};

export default TagSourceToggle;