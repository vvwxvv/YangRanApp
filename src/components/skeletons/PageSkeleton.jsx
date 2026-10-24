"use client";

import React, { useEffect } from "react";
import LoadingLayer from "@/components/animations/LoadingLayer";

// ── Shared shimmer keyframes (injected once) ──
const KEYFRAMES = `
@keyframes sk-shimmer {
  0% { backgroundPosition: -400px 0; }
  100% { backgroundPosition: 400px 0; }
}
`;

let injected = false;
function ensureKeyframes() {
  if (injected || typeof document === "undefined") return;
  if (!document.getElementById("sk-shimmer-style")) {
    const style = document.createElement("style");
    style.id = "sk-shimmer-style";
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
  }
  injected = true;
}

// ── Base shimmer style ──
export const shimmer = {
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.15) 37%, rgba(0,0,0,0.06) 63%)",
  backgroundSize: "400px 100%",
  animation: "sk-shimmer 1.2s ease infinite",
  borderRadius: "2px",
};

// ── Reusable skeleton primitives ──
export function SkeletonBlock({
  width = "100%",
  height = 200,
  borderRadius = 0,
  style = {},
}) {
  return (
    <div
      style={{
        ...shimmer,
        width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonLine({
  width = "100%",
  height = 14,
  style = {},
}) {
  return (
    <div
      style={{
        ...shimmer,
        width,
        height: `${height}px`,
        ...style,
      }}
    />
  );
}

// ── Loading bar (fixed top) ──
export function LoadingBar() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background:
          "linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)",
        backgroundSize: "200% 100%",
        animation: "sk-shimmer 0.8s ease infinite",
        zIndex: 9999,
      }}
    />
  );
}

// ── Full page skeleton wrapper ──
export default function PageSkeleton({
  children,
  bgColor = "#fff",
}) {
  useEffect(() => { ensureKeyframes(); }, []);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh" }}>
      <LoadingBar />
      <LoadingLayer isLoading />
      {children}
    </div>
  );
}

// ── Pre-built skeleton layouts for common page types ──

/** Grid-based list page: heading + cards in columns */
export function GridListSkeleton({ columns = 3, rows = 2, cardAspect = "75%", headingWidth = 120, bgColor = "#fff" }) {
  useEffect(() => { ensureKeyframes(); }, []);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "40px 50px 120px" }}>
      <LoadingBar />
      <LoadingLayer isLoading />
      <SkeletonLine width={`${headingWidth}px`} height={30} style={{ marginBottom: "40px" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "32px",
        }}
      >
        {Array.from({ length: columns * rows }).map((_, i) => (
          <div key={i}>
            <SkeletonBlock width="100%" height={0} style={{ paddingBottom: cardAspect, marginBottom: "14px" }} />
            <SkeletonLine width="60%" height={12} style={{ marginBottom: "6px" }} />
            <SkeletonLine width="85%" height={14} style={{ marginBottom: "4px" }} />
            <SkeletonLine width="45%" height={11} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Detail page: image + text + metadata */
export function DetailPageSkeleton({ bgColor = "#fff", showImage = true, paragraphs = 4 }) {
  useEffect(() => { ensureKeyframes(); }, []);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "40px 50px 120px" }}>
      <LoadingBar />
      <LoadingLayer isLoading />
      {showImage && (
        <>
          <SkeletonBlock height={400} style={{ marginBottom: "32px" }} />
          <SkeletonLine width="70%" height={26} style={{ marginBottom: "16px" }} />
          <SkeletonLine width="30%" height={14} style={{ marginBottom: "40px" }} />
        </>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "48px" }}>
        {Array.from({ length: paragraphs }).map((_, i) => (
          <SkeletonLine key={i} width={`${85 + (i % 3) * 5}%`} height={14} />
        ))}
      </div>
      <SkeletonLine width="160px" height={13} style={{ marginBottom: "12px" }} />
      <SkeletonLine width="200px" height={13} style={{ marginBottom: "12px" }} />
      <SkeletonLine width="140px" height={13} />
    </div>
  );
}

/** Simple text page: heading + paragraphs */
export function SimplePageSkeleton({ bgColor = "#fff", paragraphs = 3 }) {
  useEffect(() => { ensureKeyframes(); }, []);

  return (
    <div style={{ backgroundColor: bgColor, minHeight: "100vh", padding: "40px 50px 120px" }}>
      <LoadingBar />
      <LoadingLayer isLoading />
      <SkeletonLine width="180px" height={30} style={{ marginBottom: "32px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "680px" }}>
        {Array.from({ length: paragraphs }).map((_, i) => (
          <SkeletonLine key={i} width={`${90 - i * 8}%`} height={14} />
        ))}
      </div>
    </div>
  );
}
