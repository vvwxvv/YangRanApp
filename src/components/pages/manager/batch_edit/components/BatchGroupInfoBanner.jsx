/**
 * BatchGroupInfoBanner.jsx
 *
 * The explanatory banner shown above GroupedBatchList. Split out into its
 * own file so the copy/translation logic lives in one place.
 *
 * Responsibilities:
 *   - Explain what "Grouped" vs "Flat" means.
 *   - Explain *why* the list is currently grouped, or why it fell back to
 *     Flat (no usable group data yet).
 *   - Bilingual (EN / 中文) via the `isCn` prop — the language switch lives
 *     elsewhere in the app (e.g. LanguageContext); this component just
 *     reads `isCn` and renders the matching copy.
 *   - Plain black-and-white style, matching the original InfoBanner.
 *
 * Usage:
 *   <BatchGroupInfoBanner
 *     hasGroups={groupingAvailable}
 *     viewMode={viewMode}           // "grouped" | "flat"
 *     config={config}
 *     itemCount={rows.length}
 *     groupCount={realGroupCount}
 *     isCn={isCn}
 *   />
 */

"use client";

import React, { useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoBanner       from "@/components/banners/InfoBanner";

// ─────────────────────────────────────────────────────────────────────────────
// Copy
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds `{ title, description }` for the banner.
 * `description` is an array of paragraph strings, all in one language
 * (the language selected by `isCn`).
 */
function getBannerCopy({ isCn, hasGroups, viewMode, config, itemCount, groupCount }) {
  const groupNoun = isCn
    ? (config.groupDimensionLabelCn || config.groupsLabel || "分组")
    : (config.groupDimensionLabel   || config.groupsLabel || "group");

  const itemNoun = isCn
    ? (config.itemsLabelCn || config.itemsLabel || "项")
    : (config.itemsLabel || "items");

  // No usable grouping data at all → explain why we fell back to Flat.
  if (!hasGroups) {
    return {
      title: isCn ? "已自动切换为「平铺」视图" : "Showing the flat list",
      description: [
        isCn
          ? `由于暂时没有可用于「${groupNoun}」分组的信息，分组视图没有意义，现已改为按顺序列出全部 ${itemCount} ${itemNoun}。`
          : `None of these ${itemNoun} currently have ${groupNoun} information, so a grouped view wouldn't add anything — all ${itemCount} ${itemNoun} are listed below in order instead.`,
        isCn
          ? `为某个${itemNoun}填写${groupNoun}信息后，「分组」视图会重新出现，可按${groupNoun}归类查看与编辑。`
          : `Once any ${itemNoun} has ${groupNoun} information, the Grouped view will appear here and let you review items by ${groupNoun}.`,
      ],
    };
  }

  // Grouping is available and currently shown.
  if (viewMode === "grouped") {
    return {
      title: isCn ? "分组视图" : "Grouped view",
      description: [
        isCn
          ? `当前 ${itemCount} ${itemNoun}已按「${groupNoun}」整理为 ${groupCount} 组，点击任意一组即可展开，分类查看与批量编辑。`
          : `These ${itemCount} ${itemNoun} are organized into ${groupCount} groups by ${groupNoun}. Click any group to expand it and edit its items.`,
        isCn
          ? `切换到「平铺」可不分类别，按顺序查看全部${itemNoun}。`
          : `Switch to Flat to see every ${itemNoun} in one continuous, ordered list without categories.`,
      ],
    };
  }

  // Grouping is available, but the user is viewing the flat list.
  return {
    title: isCn ? "平铺视图" : "Flat view",
    description: [
      isCn
        ? `当前以单个列表按顺序显示全部 ${itemCount} ${itemNoun}，不区分「${groupNoun}」。`
        : `All ${itemCount} ${itemNoun} are shown in a single ordered list, regardless of ${groupNoun}.`,
      isCn
        ? `切换到「分组」可按${groupNoun}归类整理，便于分类查看与批量编辑。`
        : `Switch to Grouped to organize these ${itemNoun} by ${groupNoun} for category-by-category review.`,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BatchGroupInfoBanner({
  hasGroups,
  viewMode,
  config,
  itemCount,
  groupCount,
  isCn = false,
}) {
  const copy = useMemo(
    () => getBannerCopy({ isCn, hasGroups, viewMode, config, itemCount, groupCount }),
    [isCn, hasGroups, viewMode, config, itemCount, groupCount]
  );

  return (
    <InfoBanner
      title={copy.title}
      description={copy.description}
      icon={<InfoOutlinedIcon sx={{ fontSize: "14px", color: "var(--text-primary, #000)", mt: "2px", flexShrink: 0 }} aria-hidden="true" />}
    />
  );
}