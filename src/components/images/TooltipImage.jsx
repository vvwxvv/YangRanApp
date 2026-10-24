"use client";

import React, { useMemo, forwardRef } from 'react';
import { Tooltip, Box } from '@mui/material';
import { Image } from 'antd';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

/* ─── Defaults ───────────────────────────────────────────── */
const DEFAULTS = {
  size: 160,
  borderRadius: '4px',
  padding: 1,
  spinnerSize: 40,
  placement: 'right',
  enterDelay: 300,
  leaveDelay: 0,
};

/* ═══════════════════════════════════════════════════════════
   PreviewImage — Standalone image with loading placeholder.
   Use inside tooltips, cards, grids, or anywhere else.
   ═══════════════════════════════════════════════════════════ */
const PreviewImage = forwardRef(({
  src,
  alt = '',
  // sizing — use `size` for square, or `width`/`height` individually
  size = DEFAULTS.size,
  width,
  height,
  // appearance
  borderRadius = DEFAULTS.borderRadius,
  objectFit = 'cover',
  backgroundColor,
  className = '',
  // loading
  spinnerSize = DEFAULTS.spinnerSize,
  placeholderNode,
  // antd Image passthrough
  preview = false,
  fallback,
  // click
  onClick,
  // extra style
  style: customStyle,
  ...imageProps
}, ref) => {
  const imgWidth = width ?? size;
  const imgHeight = height ?? size;

  const placeholder = useMemo(
    () =>
      placeholderNode ?? (
        <div
          style={{
            width: imgWidth,
            height: imgHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor ?? 'transparent',
            borderRadius,
          }}
        >
          <LoadingSpinner size={spinnerSize} />
        </div>
      ),
    [placeholderNode, imgWidth, imgHeight, backgroundColor, borderRadius, spinnerSize],
  );

  return (
    <div ref={ref} onClick={onClick} className={className} style={{ display: 'inline-block' }}>
      <Image
        src={src}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        style={{ objectFit, borderRadius, ...customStyle }}
        fallback={fallback ?? src}
        preview={preview}
        placeholder={placeholder}
        {...imageProps}
      />
    </div>
  );
});

PreviewImage.displayName = 'PreviewImage';

/* ═══════════════════════════════════════════════════════════
   buildTooltipSx — Shared tooltip styling factory.
   Returns Popper sx object for consistent themed tooltips.
   ═══════════════════════════════════════════════════════════ */
const buildTooltipSx = (colors = {}) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: colors.background ?? 'transparent',
    color: colors.text ?? 'inherit',
    fontSize: '12px',
    padding: '8px',
    borderRadius: '4px',
    border: `1px solid ${colors.border || colors.text || '#ccc'}`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  '& .MuiTooltip-arrow': {
    color: colors.background ?? 'transparent',
  },
});

/* ═══════════════════════════════════════════════════════════
   TooltipImage — Hover to show an image preview tooltip.

   @example Basic
   <TooltipImage src={url} colors={colors}>
     <button>Hover me</button>
   </TooltipImage>

   @example Custom content
   <TooltipImage tooltipContent={<MyCard />} colors={colors}>
     <span>Hover</span>
   </TooltipImage>

   @example With text fallback (no image)
   <TooltipImage textFallback="Oil on canvas" colors={colors}>
     <div>Hover</div>
   </TooltipImage>
   ═══════════════════════════════════════════════════════════ */
const TooltipImage = ({
  // Image props
  src,
  alt = '',
  size = DEFAULTS.size,
  width,
  height,
  borderRadius = DEFAULTS.borderRadius,
  objectFit = 'cover',
  spinnerSize = DEFAULTS.spinnerSize,
  preview = false,
  imageStyle,
  placeholderNode,

  // Tooltip props
  placement = DEFAULTS.placement,
  arrow = true,
  enterDelay = DEFAULTS.enterDelay,
  leaveDelay = DEFAULTS.leaveDelay,
  padding = DEFAULTS.padding,
  tooltipContent,
  textFallback = '',
  disabled = false,

  // Theme
  colors = {},

  // Children (the hover target)
  children,

  // Pass-through any extra Tooltip props
  ...tooltipProps
}) => {
  const hasContent = src || tooltipContent || textFallback;

  if (disabled || !hasContent) {
    return <>{children}</>;
  }

  const tooltipSx = useMemo(() => buildTooltipSx(colors), [colors]);

  // Priority: custom content > image preview > text fallback
  const content = useMemo(() => {
    if (tooltipContent) return tooltipContent;
    if (src) {
      return (
        <Box sx={{ p: padding }}>
          <PreviewImage
            src={src}
            alt={alt}
            size={size}
            width={width}
            height={height}
            borderRadius={borderRadius}
            objectFit={objectFit}
            backgroundColor={colors.background}
            spinnerSize={spinnerSize}
            preview={preview}
            style={imageStyle}
            placeholderNode={placeholderNode}
          />
        </Box>
      );
    }
    return textFallback;
  }, [
    tooltipContent, src, alt, size, width, height, borderRadius,
    objectFit, colors.background, spinnerSize, preview, imageStyle,
    placeholderNode, padding, textFallback,
  ]);

  return (
    <Tooltip
      title={content}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      PopperProps={{ sx: tooltipSx }}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};

/* ═══════════════════════════════════════════════════════════
   TextTooltip — Plain-text tooltip with consistent styling.

   @example
   <TextTooltip text="Oil on canvas – 2024" fontFamily="serif">
     <img src="..." />
   </TextTooltip>
   ═══════════════════════════════════════════════════════════ */
const TextTooltip = ({
  text = '',
  placement = 'bottom',
  arrow = true,
  enterDelay = DEFAULTS.enterDelay,
  leaveDelay = DEFAULTS.leaveDelay,
  disabled = false,
  fontSize = 13,
  fontFamily,
  lineHeight = 1.5,
  maxWidth = 360,
  px = 1.5,
  py = 1,
  tooltipSx: tooltipSxOverride,
  children,
  ...tooltipProps
}) => {
  const sx = useMemo(
    () =>
      tooltipSxOverride ?? {
        fontSize,
        fontFamily,
        lineHeight,
        maxWidth,
        px,
        py,
      },
    [tooltipSxOverride, fontSize, fontFamily, lineHeight, maxWidth, px, py],
  );

  if (disabled || !text) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={text}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      slotProps={{ tooltip: { sx } }}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
};

export { PreviewImage, TextTooltip, buildTooltipSx, DEFAULTS };
export default React.memo(TooltipImage);