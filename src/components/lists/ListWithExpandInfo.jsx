/**
 * ListWithExpandInfo.jsx
 * Production-grade expandable list item component
 * Works with any Prisma model — MUI-based, fully typed-friendly
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Divider,
  Typography,
  Collapse,
  Stack,
  useTheme,
} from '@mui/material';

import MediaThumbnail from '@/components/images/MediaThumbnail';
import ExpandButton from '@/components/buttons/ExpandButton';
import MediaPreviewModal from '@/components/modals/MediaPreviewModal';
import EditDeleteButtonsInList from '@/components/buttons/EditDeleteButtonsInList';
import useFont from '@/hooks/useFont';
import { resolveFontFamily } from '@/lib/typography';
import {
  TYPOGRAPHY,
  isImageField,
  isEmpty,
  filterEmptyValues,
  getVisibleSummaryFields,
  getVisibleDetailFields,
  formatDisplayValue,
  getMediaInfo,
  getItemData,
} from '@/utils/fieldUtils';


// ─── Constants ───────────────────────────────────────────────────────────────

const ANIMATION = {
  expandButton: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  thumbnail: {
    hover: { scale: 2, zIndex: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' },
    initial: { scale: 1, zIndex: 2, boxShadow: 'none' },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  titleUnderline: {
    initial: { width: 0, opacity: 0, x: -40 },
    animate: { width: 'calc(100% - 80px)', opacity: 1, x: 0 },
    exit: { width: 0, opacity: 0, x: -40 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const BUTTON_CONFIG = {
  ui: { spacing: { buttonGap: 'gap-4' } },
  buttons: {
    action: 'p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200',
  },
};


// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a font style object based on field name convention (_cn / .cn suffix).
 * Not a hook — safe to call anywhere.
 */
const buildFontStyle = (fontSize, fieldName) => {
  const name = fieldName?.toString()?.toLowerCase() ?? '';
  const isCn = name.endsWith('_cn') || name.endsWith('.cn');
  return { fontFamily: resolveFontFamily('bodyText', isCn ? 'zh' : 'en'), fontSize };
};


// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated underline that appears below the title on hover */
const TitleUnderline = () => (
  <motion.div
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      height: 2,
      borderRadius: 1,
      backgroundColor: 'currentColor',
    }}
    initial={ANIMATION.titleUnderline.initial}
    animate={ANIMATION.titleUnderline.animate}
    exit={ANIMATION.titleUnderline.exit}
    transition={ANIMATION.titleUnderline.transition}
  />
);

/** Vertical bar + text row used for array-type field values */
const ArrayValueRow = ({ value, fontStyle }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
    <Box
      sx={{
        width: 3,
        flexShrink: 0,
        minHeight: '1em',
        backgroundColor: 'text.primary',
      }}
    />
    <Typography variant="body2" sx={fontStyle}>
      {value}
    </Typography>
  </Box>
);

/** Clickable image thumbnail inside a detail field */
const InlineImage = ({ src, alt, onClick, fontStyle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      component="img"
      src={src}
      alt={alt}
      onClick={onClick}
      onError={(e) => { e.target.src = '/error.png'; }}
      loading="lazy"
      sx={{
        width: 64,
        height: 64,
        objectFit: 'cover',
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        '&:hover': { opacity: 0.8 },
      }}
    />
    <Typography
      variant="caption"
      onClick={onClick}
      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, ...fontStyle }}
    >
      Click to view
    </Typography>
  </Box>
);


// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ListWithExpandInfo
 *
 * @param {object}   item             - Data record (any Prisma model)
 * @param {string}   titleKey         - Field key used as the primary title
 * @param {string}   subtitleKey      - Field key used as the subtitle (optional)
 * @param {string}   imageKey         - Field key for cover image URL
 * @param {string}   videoKey         - Field key for video URL
 * @param {Array}    summaryFields    - Fields shown in collapsed view
 * @param {Array}    detailFields     - Fields shown when expanded
 * @param {Function} onEdit           - Edit callback
 * @param {Function} onDelete         - Delete callback
 * @param {Function} onHover          - Hover state callback
 * @param {boolean}  manager          - Show management controls (edit/delete/expand)
 * @param {boolean}  showExpandButton - Whether to render the expand toggle
 * @param {boolean}  isCn             - Locale flag forwarded to child buttons
 */
export default function ListWithExpandInfo({
  item,
  titleKey = 'title_en',
  subtitleKey = null,
  imageKey = 'cover_img_url',
  videoKey = 'video_url',
  summaryFields = [],
  detailFields = [],
  onEdit,
  onDelete,
  onHover,
  manager = true,
  showExpandButton = true,
  isCn = false,
}) {
  const theme = useTheme();

  // ── Local state ────────────────────────────────────────────────────────────
  const [hovered, setHovered]       = useState(false);
  const [expanded, setExpanded]     = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState('image');

  // ── Font hooks (title & subtitle only) ────────────────────────────────────
  const titleFont    = useFont('bodyText');
  const subtitleFont = useFont('bodyText');

  // ── Derived data ───────────────────────────────────────────────────────────
  const mediaInfo = useMemo(
    () => getMediaInfo(item, imageKey, videoKey),
    [item, imageKey, videoKey],
  );

  const itemData = useMemo(
    () => getItemData(item, titleKey, subtitleKey),
    [item, titleKey, subtitleKey],
  );

  const visibleSummaryFields = useMemo(
    () => getVisibleSummaryFields(item, summaryFields, imageKey, videoKey, titleKey, subtitleKey, 3),
    [item, summaryFields, imageKey, videoKey, titleKey, subtitleKey],
  );

  const visibleDetailFields = useMemo(
    () => getVisibleDetailFields(item, detailFields, imageKey, videoKey, titleKey, subtitleKey),
    [item, detailFields, imageKey, videoKey, titleKey, subtitleKey],
  );

  // ── Event handlers ─────────────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    onHover?.(true);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    onHover?.(false);
  }, [onHover]);

  const handleExpandToggle = useCallback(() => setExpanded((prev) => !prev), []);

  const handlePreviewClose = useCallback(() => {
    setPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewType('image');
  }, []);

  const handleMediaClick = useCallback(
    (url = null) => {
      const targetUrl = url || mediaInfo.imgUrl;
      if (mediaInfo.videoUrl?.trim()) {
        setPreviewUrl(mediaInfo.videoUrl);
        setPreviewType('video');
      } else if (targetUrl?.trim()) {
        setPreviewUrl(targetUrl);
        setPreviewType('image');
      } else {
        setPreviewUrl('/error.png');
        setPreviewType('image');
      }
      setPreviewOpen(true);
    },
    [mediaInfo.imgUrl, mediaInfo.videoUrl],
  );

  // ── Field value renderer ──────────────────────────────────────────────────
  const renderFieldValue = useCallback(
    (field, value) => {
      const { key, render } = field;
      const fontStyle = buildFontStyle(TYPOGRAPHY.detail.fontSize, key);

      // 1. Custom renderer
      if (typeof render === 'function') return render(value, item);

      // 2. Image field
      if (isImageField(key) && value?.trim()) {
        return (
          <InlineImage
            src={value}
            alt={`${itemData.title} — ${key}`}
            onClick={() => handleMediaClick(value)}
            fontStyle={fontStyle}
          />
        );
      }

      // 3. Array field
      if (Array.isArray(value) && value.length > 0) {
        const filtered = filterEmptyValues(value);
        if (!filtered.length) return null;
        return (
          <Box sx={{ mt: 0.5 }}>
            {filtered.map((entry, i) => (
              <ArrayValueRow key={i} value={entry} fontStyle={fontStyle} />
            ))}
          </Box>
        );
      }

      // 4. Default
      return <span style={fontStyle}>{formatDisplayValue(value)}</span>;
    },
    [itemData.title, handleMediaClick, item],
  );

  // ── Dynamic border style ──────────────────────────────────────────────────
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const containerSx = {
    position: 'relative',
    transition: 'all 0.3s',
    borderRadius: '3px',
    ...(hovered && {
      boxShadow: 8,
      border: `2px solid ${borderColor}`,
    }),
    ...(expanded && !hovered && {
      border: `1px solid ${borderColor}`,
    }),
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Card wrapper ── */}
      <Box sx={containerSx} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

        {/* ── Collapsed row ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            py: 2,
            minHeight: 96,
            borderBottom: `${hovered ? 2 : 0.5}px solid ${borderColor}`,
            color: 'text.primary',
          }}
        >
          {/* Media thumbnail + vertical divider */}
          {mediaInfo.hasMedia && (
            <>
              <MediaThumbnail
                imgUrl={mediaInfo.imgUrl}
                videoUrl={mediaInfo.videoUrl}
                title={itemData.title}
                onMediaClick={handleMediaClick}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1.5, borderColor, borderWidth: 2, alignSelf: 'stretch', my: 1 }}
              />
            </>
          )}

          {/* Content area */}
          <Box sx={{ flex: 1, px: 2.5, minWidth: 0 }}>

            {/* Title row */}
            <Box sx={{ fontWeight: 600, mb: 0.5, position: 'relative' }}>
              <Typography
                component="div"
                title={itemData.title}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  wordBreak: 'break-word',
                  ...titleFont.style,
                }}
              >
                <span style={{ flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
                  {itemData.title}
                </span>
              </Typography>

              <AnimatePresence>
                {hovered && manager && <TitleUnderline />}
              </AnimatePresence>
            </Box>

            {/* Subtitle */}
            {itemData.subtitle && (
              <Typography variant="body2" sx={{ mb: 1, ...subtitleFont.style }}>
                {itemData.subtitle}
              </Typography>
            )}

            <Box sx={{ height: 10 }} />

            {/* Summary fields */}
            <Stack spacing={0.5}>
              {visibleSummaryFields.map((field, index) => {
                const value = item[field.key];
                if (isEmpty(value)) return null;
                const labelStyle = buildFontStyle(TYPOGRAPHY.sub.fontSize, field.key);

                return (
                  <Box
                    key={`summary-${field.key}-${index}`}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', flexWrap: 'nowrap', gap: 0.5, minWidth: 0 }}
                  >
                    {manager && (
                      <Typography
                        component="span"
                        sx={{ fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap', ...labelStyle }}
                      >
                        {field.label}:
                      </Typography>
                    )}
                    <Box
                      component="span"
                      sx={{ display: 'inline', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', ml: 0.5 }}
                    >
                      {renderFieldValue(field, value)}
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            {/* Expand toggle */}
            {manager && showExpandButton && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <ExpandButton expanded={expanded} onToggle={handleExpandToggle} />
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Expanded section ── */}
        <Collapse in={expanded && manager} unmountOnExit>
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderTop: `1px solid ${borderColor}`,
            }}
          >
            <Stack spacing={1.5}>
              {visibleDetailFields.map((field, index) => {
                const value = item[field.key];
                if (isEmpty(value)) return null;
                const labelStyle = buildFontStyle(TYPOGRAPHY.detail.fontSize, field.key);

                return (
                  <Box key={`detail-${field.key}-${index}`}>
                    <Typography component="span" sx={{ fontWeight: 500, ...labelStyle }}>
                      {field.label}:
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {renderFieldValue(field, value)}
                    </Box>
                  </Box>
                );
              })}

              {/* Edit / Delete actions */}
              <EditDeleteButtonsInList
                onEdit={onEdit}
                onDelete={onDelete}
                item={item}
                config={BUTTON_CONFIG}
                isCn={isCn}
              />
            </Stack>
          </Box>
        </Collapse>
      </Box>

      {/* ── Media preview modal ── */}
      <MediaPreviewModal
        isOpen={previewOpen}
        onClose={handlePreviewClose}
        imageUrl={previewType === 'image' ? previewUrl : mediaInfo.imgUrl}
        videoUrl={previewType === 'video' ? previewUrl : mediaInfo.videoUrl}
        title={itemData.title}
        enableGifRestart
      />
    </>
  );
}