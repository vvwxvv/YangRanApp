// utils/groupData.js
export function groupData(items, groupConfig, context = {}) {
    if (!groupConfig?.enabled) {
      return null;
    }
  
    const {
      field,
      getGroupKey,
      getGroupLabel,
      emptyLabel = { EN: "Ungrouped", CN: "未分组" },
      sortGroups = false,
      sortGroupsFn,
      sortItemsBy,
      sortItemsOrder = "asc",
      sortItemsFn,
    } = groupConfig;

    // `emptyLabel` may be a plain string (several managers pass "Ungrouped") or
    // the bilingual { EN, CN } shape — both must render, otherwise the raw
    // "__UNGROUPED__" key leaks into the group header.
    const ungroupedLabel =
      typeof emptyLabel === "string"
        ? emptyLabel
        : (context.isCn ? emptyLabel?.CN : emptyLabel?.EN) ||
          (context.isCn ? "未分组" : "Ungrouped");
  
    const map = new Map();
  
    for (const item of items) {
      const rawKey =
        typeof getGroupKey === "function"
          ? getGroupKey(item, context)
          : item?.[field];

      // A getGroupKey may return an ARRAY of keys — used by the image manager,
      // where one image can belong to several artists (an exhibition's images
      // appear under every artist in that show). An empty array would make the
      // item vanish, so it falls back to the ungrouped bucket.
      const rawKeys = Array.isArray(rawKey) ? rawKey : [rawKey];
      const keys = rawKeys.length ? rawKeys : ["__UNGROUPED__"];

      for (const raw of keys) {
        const normalizedKey =
          raw === undefined || raw === null || String(raw).trim() === ""
            ? "__UNGROUPED__"
            : String(raw).trim();

        if (!map.has(normalizedKey)) {
          const label =
            normalizedKey === "__UNGROUPED__"
              ? ungroupedLabel
              : typeof getGroupLabel === "function"
              ? getGroupLabel(normalizedKey, [], context)
              : normalizedKey;

          map.set(normalizedKey, {
            key: normalizedKey,
            label,
            items: [],
          });
        }

        map.get(normalizedKey).items.push(item);
      }
    }
  
    let groups = Array.from(map.values());
  
    groups = groups.map((group) => {
      let sortedItems = [...group.items];
  
      if (typeof sortItemsFn === "function") {
        sortedItems.sort(sortItemsFn);
      } else if (sortItemsBy) {
        sortedItems.sort((a, b) => {
          const aVal = a?.[sortItemsBy];
          const bVal = b?.[sortItemsBy];
  
          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return 1;
          if (bVal == null) return -1;
  
          const result = String(aVal).localeCompare(String(bVal), undefined, {
            numeric: true,
            sensitivity: "base",
          });
  
          return sortItemsOrder === "desc" ? -result : result;
        });
      }
  
      return {
        ...group,
        label:
          group.key === "__UNGROUPED__"
            ? group.label
            : typeof getGroupLabel === "function"
            ? getGroupLabel(group.key, sortedItems, context)
            : group.label,
        items: sortedItems,
      };
    });
  
    if (typeof sortGroupsFn === "function") {
      groups.sort(sortGroupsFn);
    } else if (
      sortGroups === "asc" ||
      sortGroups === "desc" ||
      sortGroups === true
    ) {
      // `true` is the common shorthand the manager pages pass (groupConfig
      // { sortGroups: true }) — treat it as ascending A→Z. The "Ungrouped"
      // bucket always sinks to the bottom.
      const direction = sortGroups === "desc" ? -1 : 1;
      const locale = context.isCn ? "zh-Hans-CN" : undefined;
      groups.sort((a, b) => {
        const aUngrouped = a.key === "__UNGROUPED__";
        const bUngrouped = b.key === "__UNGROUPED__";
        if (aUngrouped !== bUngrouped) return aUngrouped ? 1 : -1;

        const result = String(a.label).localeCompare(String(b.label), locale, {
          numeric: true,
          sensitivity: "base",
        });
        return direction * result;
      });
    }
  
    return groups;
  }