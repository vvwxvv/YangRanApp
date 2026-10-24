"use client";
import React, { useState, useCallback, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';

// Contexts and hooks
import { LanguageContext } from '@/components/contexts/LanguageContext';
import useData from '@/hooks/useData';
import useFont from '@/hooks/useFont';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useIndexFilters } from '@/hooks/useIndexFilters';
import { useIndexData } from '@/hooks/useIndexData';
import { useNavigationHandlers } from '@/hooks/useNavigationHandlers';

// Components
import NoDataInfo from '@/components/alerts/NoDataInfo';
import AlertInfo from '@/components/alerts/AlertInfo';
import ManagerCard from '@/components/pages/manager/components/ManagerCard';
import EditDeleteButtons from '@/components/buttons/EditDeleteButtons';
import SimplePageTitle from '@/components/titles/SimplePageTitle';
import IndexFilterBar from '@/components/navs/IndexFilterBar';

// Utils
import { getFilteredFieldOptions, groupItemsByField } from '@/utils/filterAndSortItems';
import { UI_CONSTANTS, COMPONENT_STYLES } from '@/hooks/useIndexConstants';
import { filterAndSortItems } from '@/utils/filterAndSortItems';

/**
 * IndexPageLayout – Universal index page component
 * Can be used with any schema by passing the appropriate configuration.
 *
 * @param {Object} props
 * @param {string} props.schemaName - Name of the schema (for display)
 * @param {Object} props.schemaConfig - API endpoints for the main data
 * @param {Object} props.imageConfig - API endpoints for images (optional)
 * @param {Function} props.uiTextGetter - Function to fetch UI text by key
 * @param {Object} props.fieldMappings - Map logical fields to actual field names
 * @param {Object} props.languageConfig - Language values for filtering
 * @param {Object} props.sortConfig - Default sorting field and direction
 * @param {Object} props.groupConfig - Grouping settings
 * @param {Object} props.filterConfig - Filter field definitions
 * @param {Object} props.hoverCardConfig - Hover card fields and image key
 * @param {string} props.baseRoute - Base route for detail links
 * @param {Array} props.typeOptions - Options for type dropdown
 * @param {boolean} props.isManageMode - Show edit/delete buttons
 */
const IndexPageLayout = ({
  schemaName,
  schemaConfig,
  imageConfig,
  uiTextGetter,
  fieldMappings = {
    language: 'language',
    title: 'title',
    year: 'year',
    id: '_id',
    slug: 'slug',
    coverImage: 'cover_img_url',
    category: 'series',
    type: 'type',
    description: 'description',
    artist: 'artist',
    medium: 'medium',
    dimensions: 'dimensions',
    location: 'location',
  },
  languageConfig = {
    cn: 'CN',
    en: 'EN',
  },
  sortConfig = {
    field: 'year',
    type: 'desc',
  },
  groupConfig = {
    enabled: true,
    field: 'category',
  },
  filterConfig = {
    categoryFields: ['category'],
    typeField: 'type',
    yearField: 'year',
    fields: [
      {
        key: 'category',
        type: 'category',
        labelKey: 'category',
        resetOthers: ['year', 'type'],
      },
      {
        key: 'year',
        type: 'year',
        labelKey: 'year',
        dependsOn: 'category',
        resetOthers: ['category', 'type'],
      },
      {
        key: 'type',
        type: 'type',
        labelKey: 'type',
        resetOthers: ['category', 'year'],
      },
    ],
  },
  hoverCardConfig = {
    fields: [
      { key: 'title', label: 'Title', getValue: (item, fm) => item[fm.title] },
      { key: 'year', label: 'Year', getValue: (item, fm) => item[fm.year] || '--' },
      { key: 'type', label: 'Type', getValue: (item, fm) => item[fm.type] },
      { key: 'category', label: 'Category', getValue: (item, fm) => item[fm.category] },
    ],
    imageKey: 'coverImage',
  },
  baseRoute = '',
  typeOptions = [],
  isManageMode = false,
}) => {
  // ─── Internal helper to generate slug ───────────────────────────
  const generateSlugInternal = useCallback((text) => {
    if (!text) return '';
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}\p{N}_-]/gu, '');
  }, []);

  // ── Hooks ───────────────────────────────────────────────────────
  const { isCn } = useContext(LanguageContext);
  const router = useRouter();
  const { width } = useWindowSize();
  const { fontFamily, contentFontFamily, contentTitleFontFamily } = useFont();

  // ── State ──────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // ── Build filter fields with mapped keys ──────────────────────
  const mappedFilterFields = useMemo(() => {
    return filterConfig.fields.map((field) => ({
      ...field,
      key: fieldMappings[field.key] || field.key,
      resetOthers: field.resetOthers
        ? field.resetOthers.map((rk) => fieldMappings[rk] || rk)
        : [],
    }));
  }, [filterConfig.fields, fieldMappings]);

  const { filters, updateFilter, resetFilters } = useIndexFilters(
    mappedFilterFields.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
  );

  // ── Computed values ─────────────────────────────────────────────
  const isMobile = width < 768;
  const getColumns = useCallback(() => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    if (width < 1280) return 3;
    if (width < 1536) return 4;
    return 5;
  }, [width]);
  const columns = getColumns();

  // ── Data fetching ──────────────────────────────────────────────
  const {
    data: primaryData = [],
    isLoading: loadingPrimary,
    error: errorPrimary,
    refetch: refetchPrimary,
  } = useData(schemaConfig?.api?.endpoints?.list);

  const {
    data: secondaryData = [],
    isLoading: loadingSecondary,
    error: errorSecondary,
    refetch: refetchSecondary,
  } = useData(imageConfig?.api?.endpoints?.list);

  // ── Data processing ─────────────────────────────────────────────
  const processData = useCallback(
    (items, rawImages, isCn, search) => {
      const filteredItems = filterAndSortItems({
        items: items || [],
        isCn,
        search,
        languageField: fieldMappings.language,
        titleField: fieldMappings.title,
        yearField: fieldMappings.year,
        langValues: languageConfig,
        sortField: Array.isArray(sortConfig.field)
          ? sortConfig.field.map((f) => fieldMappings[f] || f)
          : fieldMappings[sortConfig.field] || sortConfig.field,
        sortType: sortConfig.type,
      });

      // Extract categories
      const allCategories = filterConfig.categoryFields.reduce((acc, fieldKey) => {
        const actualFieldName = fieldMappings[fieldKey] || fieldKey;
        const values = Array.from(
          new Set(filteredItems.map((item) => item?.[actualFieldName]).filter(Boolean))
        );
        acc[fieldKey] = values;
        return acc;
      }, {});

      // Extract types
      const actualTypeField = fieldMappings[filterConfig.typeField] || filterConfig.typeField;
      const allTypes = actualTypeField
        ? Array.from(new Set(filteredItems.map((item) => item?.[actualTypeField]).filter(Boolean)))
        : [];

      return {
        filteredItems,
        allCategories:
          filterConfig.categoryFields.length === 1
            ? allCategories[filterConfig.categoryFields[0]]
            : allCategories,
        allTypes,
      };
    },
    [
      fieldMappings,
      languageConfig,
      sortConfig.field,
      sortConfig.type,
      filterConfig.categoryFields,
      filterConfig.typeField,
    ]
  );

  const { filteredItems, allCategories, allTypes, extractUniqueValues } = useIndexData({
    primaryData,
    secondaryData,
    searchQuery: search,
    language: isCn ? 'cn' : 'en',
    processingFunction: processData,
  });

  // ── Build filter options ────────────────────────────────────────
  const filterConfigs = useMemo(() => {
    return mappedFilterFields.map((field) => {
      let options = [];

      switch (field.type) {
        case 'category': {
          const actualFieldKey = fieldMappings[field.key] || field.key;
          const values = extractUniqueValues
            ? extractUniqueValues(filteredItems, actualFieldKey)
            : [];
          options = getFilteredFieldOptions({
            allValues: values,
            allLabel: uiTextGetter('all', isCn ? 'cn' : 'en'),
          });
          break;
        }
        case 'year': {
          const actualFieldKey = fieldMappings[field.key] || field.key;
          const allYears = extractUniqueValues
            ? extractUniqueValues(filteredItems, actualFieldKey)
            : [];
          options = getFilteredFieldOptions({
            allValues: allYears,
            allLabel: isCn ? '全部年份' : 'All Year',
            filteredItems,
            fieldName: actualFieldKey,
            dependentField: field.dependsOn ? fieldMappings[field.dependsOn] || field.dependsOn : undefined,
            dependentValue: field.dependsOn ? filters[fieldMappings[field.dependsOn] || field.dependsOn] : undefined,
          });
          break;
        }
        case 'type': {
          const actualFieldKey = fieldMappings[field.key] || field.key;
          const values = extractUniqueValues
            ? extractUniqueValues(filteredItems, actualFieldKey)
            : [];
          options = getFilteredFieldOptions({
            allValues: values,
            allLabel: isCn ? '全部类型' : 'All Type',
          }).map((opt) => {
            if (opt.value === 'all') return opt;
            const matched = (typeOptions || []).find(
              (t) => t?.label_en === opt.value || t?.label_cn === opt.value
            );
            return {
              value: opt.value,
              label: matched ? (isCn ? matched.label_cn : matched.label_en) : opt.label,
            };
          });
          break;
        }
        default: {
          const actualFieldKey = fieldMappings[field.key] || field.key;
          const values = extractUniqueValues
            ? extractUniqueValues(filteredItems, actualFieldKey)
            : [];
          options = getFilteredFieldOptions({
            allValues: values,
            allLabel: uiTextGetter('all', isCn ? 'cn' : 'en'),
          });
        }
      }

      return {
        ...field,
        options,
        label: uiTextGetter(field.labelKey, isCn ? 'cn' : 'en'),
      };
    });
  }, [mappedFilterFields, filteredItems, filters, isCn, uiTextGetter, extractUniqueValues, typeOptions, fieldMappings]);

  // ── Filtered display items ─────────────────────────────────────
  const displayItems = useMemo(() => {
    if (!filteredItems || !Array.isArray(filteredItems)) return [];
    return filteredItems.filter((item) =>
      mappedFilterFields.every((field) => {
        const filterValue = filters[field.key];
        if (!filterValue || filterValue === 'all') return true;
        return item[field.key] === filterValue;
      })
    );
  }, [filteredItems, filters, mappedFilterFields]);

  // ── Grouped data ──────────────────────────────────────────────
  const groupedItems = useMemo(() => {
    if (!groupConfig.enabled) return [{ label: '', items: displayItems }];
    const groupFieldMapped = fieldMappings[groupConfig.field] || groupConfig.field;
    return groupItemsByField({
      items: displayItems,
      groupField: groupFieldMapped,
      sortField: fieldMappings[sortConfig.field] || sortConfig.field,
      sortType: 'desc',
      otherLabel: uiTextGetter('other', isCn ? 'cn' : 'en'),
      locale: isCn ? 'zh-Hans-CN' : 'en',
    });
  }, [displayItems, groupConfig.enabled, groupConfig.field, fieldMappings, sortConfig.field, isCn, uiTextGetter]);

  // ── Navigation handlers ────────────────────────────────────────
  const navigationHandlers = useNavigationHandlers({
    router,
    isManageMode,
    isMobile,
    baseRoute,
    editRoute: '/manager',
    customHandlers: {
      getItemId: (item) => item[fieldMappings.id] || item[fieldMappings.slug] || item.id,
      getItemSlug: (item) => item[fieldMappings.slug] || item[fieldMappings.id] || item.id,
    },
  });

  // ── Event handlers ──────────────────────────────────────────────
  const handleTitleClick = useCallback(
    (item, e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (!item) return;
      const slug = item[fieldMappings.slug] || item[fieldMappings.id] || generateSlugInternal(item[fieldMappings.title]);
      if (!slug) {
        console.log('No slug or ID available for navigation', item);
        return;
      }
      const path = baseRoute ? `/${baseRoute}/${slug}` : `/${slug}`;
      router.push(path);
    },
    [router, baseRoute, fieldMappings, generateSlugInternal]
  );

  const handleFilterChange = useCallback(
    (key, value, resetOthers = []) => {
      updateFilter(key, value, resetOthers);
    },
    [updateFilter]
  );

  const handleRetry = useCallback(() => {
    refetchPrimary();
    refetchSecondary();
  }, [refetchPrimary, refetchSecondary]);

  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  // ── Loading / Error states ─────────────────────────────────────
  // Plain white loading screen — no skeleton, no loader.
  if (loadingPrimary || loadingSecondary) {
    return (
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", width: "100%" }} />
    );
  }

  if (errorPrimary || errorSecondary) {
    return (
      <AlertInfo
        message={uiTextGetter('loadingError', 'en')}
        subMessage={uiTextGetter('systemError', 'en')}
        buttonText={uiTextGetter('tryAgain', 'en')}
        messageCn={uiTextGetter('loadingError', 'cn')}
        subMessageCn={uiTextGetter('systemError', 'cn')}
        buttonTextCn={uiTextGetter('tryAgain', 'cn')}
        onBack={handleRetry}
        isCn={isCn}
      />
    );
  }

  if (!filteredItems || filteredItems.length === 0) {
    return <NoDataInfo schemaName={schemaName} isCn={isCn} />;
  }

  // ── Build hover card fields dynamically ──────────────────────
  const dynamicHoverCardFields = useMemo(() => {
    return hoverCardConfig.fields.map((fieldConfig) => ({
      key: fieldConfig.key,
      label: fieldConfig.label || uiTextGetter(`fields.${fieldConfig.key}`, 'en'),
      getValue:
        fieldConfig.getValue ||
        ((item) => {
          const actualFieldName = fieldMappings[fieldConfig.key] || fieldConfig.key;
          const value = item[actualFieldName];
          const actualTypeField = fieldMappings[filterConfig.typeField] || filterConfig.typeField;
          if (fieldConfig.key === filterConfig.typeField && typeOptions.length > 0) {
            const typeOption = typeOptions.find(
              (opt) => opt.label_en === value || opt.label_cn === value
            );
            return typeOption ? typeOption.label_en : value;
          }
          return fieldConfig.defaultValue !== undefined && !value
            ? fieldConfig.defaultValue
            : value;
        }),
    }));
  }, [hoverCardConfig.fields, fieldMappings, uiTextGetter, filterConfig.typeField, typeOptions]);

  const hoverCardImageKey = fieldMappings[hoverCardConfig.imageKey] || hoverCardConfig.imageKey;

  // ── Main render ────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily,
        fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.sm,
        backgroundColor: 'var(--background-primary, #ffffff)',
        color: 'var(--text-primary, #000000)',
      }}
    >
      {/* Page Header */}
      <section
        className={UI_CONSTANTS.LAYOUT.padding.section}
        style={{ fontFamily, fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.sm }}
      >
        <div className={UI_CONSTANTS.LAYOUT.container}>
          <div className="mb-8">
            <SimplePageTitle title={uiTextGetter('pageTitle', isCn ? 'cn' : 'en')} />
            <IndexFilterBar
              filters={filters}
              filterConfigs={filterConfigs}
              onFilterChange={handleFilterChange}
              isCn={isCn}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section
        className={UI_CONSTANTS.LAYOUT.padding.sectionBottom}
        style={{
          fontFamily,
          marginTop: UI_CONSTANTS.LAYOUT.margin.section,
          fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.sm,
        }}
      >
        <div className={UI_CONSTANTS.LAYOUT.container}>
          <div className="relative">
            {groupedItems.map((group, groupIndex) => (
              <div key={group.label || `group-${groupIndex}`} className="mb-1">
                {/* Group Label */}
                {groupConfig.enabled && group.label && (
                  <div style={{ marginBottom: '8px' }}>
                    <Typography
                      variant="body1"
                      style={{
                        fontFamily: contentTitleFontFamily,
                        fontWeight:
                          typeof group.label === 'string' && group.label.startsWith('|')
                            ? 'bolder'
                            : 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {group.label}
                    </Typography>
                    <div
                      style={{
                        borderBottom: '2px solid var(--text-primary, #000000)',
                        marginTop: '4px',
                        marginBottom: '4px',
                        width: '100%',
                      }}
                    />
                  </div>
                )}

                {/* Items Grid */}
                <div
                  className="grid mb-2"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    columnGap:
                      width >= 1536
                        ? '32px'
                        : width >= 1280
                        ? '24px'
                        : width >= 1024
                        ? '16px'
                        : width >= 640
                        ? '12px'
                        : '8px',
                    rowGap: '1px',
                  }}
                >
                  {group.items.map((item) => {
                    const title = item[fieldMappings.title] || 'Untitled';
                    const year = item.year || '--';
                    const itemId = item[fieldMappings.id] || item._id || item.id;

                    return (
                      <div
                        key={itemId}
                        className="group cursor-pointer transition-all duration-200 flex flex-col border-b border-gray-200 py-1 hover:border-gray-400 relative"
                        onMouseEnter={() => setHoveredId(itemId)}
                        onMouseLeave={() => setHoveredId(null)}
                        onMouseMove={handleMouseMove}
                        onClick={(e) => handleTitleClick(item, e)}
                        tabIndex={0}
                        role="button"
                        aria-label={`View item ${title}`}
                      >
                        <h4
                          className="font-light tracking-wide group-hover:tracking-wider transition-all duration-200 text-sm leading-tight"
                          style={{
                            fontFamily: contentTitleFontFamily,
                            fontSize: '12px',
                            color: 'var(--text-primary, #000000)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          {title} | {year}
                        </h4>

                        {isManageMode && (
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <EditDeleteButtons
                              onEdit={(e) => navigationHandlers.handleEditClick?.(item, e)}
                              onDelete={(e) => navigationHandlers.handleDeleteClick?.(item, e)}
                              size="small"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {groupIndex < groupedItems.length - 1 && (
                  <div style={COMPONENT_STYLES.groupDivider} />
                )}
              </div>
            ))}

            {/* Floating Hover Card */}
            <AnimatePresence>
              {hoveredId !== null &&
                Array.isArray(dynamicHoverCardFields) &&
                dynamicHoverCardFields.length > 0 &&
                (() => {
                  let hoveredItem = null;
                  for (const group of groupedItems) {
                    hoveredItem = group.items.find(
                      (i) => (i._id || i.id) === hoveredId
                    );
                    if (hoveredItem) break;
                  }
                  if (!hoveredItem) return null;
                  return (
                    <motion.div
                      key={`hover-${hoveredId}`}
                      className="fixed z-50 pointer-events-none"
                      style={{
                        left: mousePosition.x + 20,
                        top: mousePosition.y - 100,
                        width: 320,
                        maxWidth: '90vw',
                      }}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <ManagerCard
                        item={hoveredItem}
                        fields={dynamicHoverCardFields}
                        isCn={isCn}
                        showActions={false}
                        imageKey={hoverCardImageKey}
                        orderNumber={null}
                        style={{ pointerEvents: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                      />
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
          </div>

          {/* No Results Message */}
          {displayItems.length === 0 && (
            <div className="text-center py-12">
              <p
                className="text-black dark:text-white"
                style={{
                  fontFamily: contentFontFamily,
                  fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.sm,
                  color: 'var(--text-primary, #000000)',
                }}
              >
                {uiTextGetter('noItemsFound', isCn ? 'cn' : 'en')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default IndexPageLayout;