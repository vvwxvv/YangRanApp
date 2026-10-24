import React, { useMemo } from "react";
import TooltipImage, { TextTooltip } from "@/components/images/TooltipImage";

const DEFAULTS = {
  enterDelay: 300,
  leaveDelay: 100,
  maxWidth: 360,
};

/**
 * Returns a function that wraps any element with the appropriate tooltip.
 *
 * @param {object} options
 * @param {string}  options.mode        - "none" | "text" | "image" | "both"
 * @param {boolean} options.disabled    - skip tooltip entirely (e.g. mobile)
 * @param {string}  options.text        - tooltip text content
 * @param {string}  options.imageUrl    - image URL for image tooltip
 * @param {boolean} options.hasImage    - whether image exists
 * @param {string}  options.altText     - alt text for tooltip image
 * @param {string}  options.placement   - tooltip placement
 * @param {number}  options.imageSize   - tooltip image preview size
 * @param {object}  options.colors      - theme colors for tooltip
 * @param {string}  options.fontFamily  - font for text tooltip
 * @param {number}  options.enterDelay
 * @param {number}  options.leaveDelay
 * @param {number}  options.maxWidth
 * @returns {(children: React.ReactNode) => React.ReactNode}
 */
export default function useTooltipWrapper({
  mode = "text",
  disabled = false,
  text = "",
  imageUrl = null,
  hasImage = false,
  altText = "",
  placement = "bottom",
  imageSize = 200,
  colors = {},
  fontFamily,
  enterDelay = DEFAULTS.enterDelay,
  leaveDelay = DEFAULTS.leaveDelay,
  maxWidth = DEFAULTS.maxWidth,
} = {}) {
  return useMemo(() => {
    // No tooltip
    if (disabled || mode === "none") {
      return (children) => children;
    }

    // Image or both
    if (mode === "image" || mode === "both") {
      return (children) => (
        <TooltipImage
          src={hasImage ? imageUrl : null}
          alt={altText}
          size={imageSize}
          placement={placement}
          enterDelay={enterDelay}
          leaveDelay={leaveDelay}
          textFallback={mode === "both" ? text : ""}
          colors={colors}
          disabled={!hasImage && mode === "image"}
        >
          {children}
        </TooltipImage>
      );
    }

    // Text only (default)
    return (children) => (
      <TextTooltip
        text={text}
        placement={placement}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
        fontFamily={fontFamily}
        maxWidth={maxWidth}
      >
        {children}
      </TextTooltip>
    );
  }, [
    mode, disabled, text, imageUrl, hasImage, altText,
    placement, imageSize, colors, fontFamily,
    enterDelay, leaveDelay, maxWidth,
  ]);
}