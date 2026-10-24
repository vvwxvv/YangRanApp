import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { Box, Avatar, Divider, useMediaQuery, useTheme } from '@mui/material';
import { imageUtils } from '@/utils/imageUtils';
import ImageCaptionTooltip from './ImageCaptionTooltip';

/**
 * ImageZoomable - A flexible, reusable image gallery for public display.
 *
 * @param {Array}    images          - Array of image objects from Image model.
 * @param {Function} onImageClick    - Callback when an image is clicked (receives image URL).
 *                                     Only called when zoomable=true.
 * @param {string}   artworkTitle    - Title for alt text.
 * @param {string}   imageUrlField   - Field name for image URL (default: 'img_url').
 * @param {string}   fallbackSrc     - Fallback image URL.
 * @param {boolean}  enableGifRestart
 * @param {boolean}  isCn            - Language switch for tooltips.
 * @param {string}   tooltipPosition - Position of tooltips.
 *
 * ── Zoom / navigation control ──────────────────────────────
 * @param {boolean}  zoomable        - When true (default) clicking opens the zoom
 *                                     handler via onImageClick.
 *                                     When false, clicking navigates to pageUrl.
 * @param {string}   pageUrl         - URL to navigate to when zoomable=false.
 *                                     Typically the artwork detail slug, e.g.
 *                                     `/artworks/my-artwork-slug`.
 *                                     If omitted nothing happens on click.
 */

const FALLBACK_IMAGE = '/no-image.png';

const ImageZoomable = ({
  images = [],
  onImageClick,
  artworkTitle = '',
  imageUrlField = 'img_url',
  fallbackSrc = FALLBACK_IMAGE,
  enableGifRestart = true,
  // Tooltip props
  isCn = false,
  tooltipPosition = 'bottom',
  // Zoom / navigation control
  zoomable = true,
  pageUrl = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  if (!images || images.length === 0) return null;

  /* ── Click handler ──────────────────────────────────────
     zoomable=true  → call onImageClick(src) so parent can open a lightbox
     zoomable=false → navigate to pageUrl (artwork detail page)
  ─────────────────────────────────────────────────────── */
  const handleClick = (imageSrc) => {
    if (zoomable) {
      onImageClick?.(imageSrc);
    } else if (pageUrl) {
      router.push(pageUrl);
    }
  };

  /* ── Cursor hint: pointer when there is something to do ── */
  const isClickable = zoomable ? Boolean(onImageClick) : Boolean(pageUrl);

  return (
    <Box sx={{ mt: { xs: 4, md: 6 }, background: 'transparent' }}>
      <Divider
        sx={{
          my: { xs: 3, md: 6 },
          borderColor: 'rgba(0,0,0,0.12)',
          borderBottomWidth: { xs: 1, md: 2 },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
          width: '100%',
          minWidth: 0,
          background: 'transparent',
          '@media (min-width: 600px)': {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (min-width: 900px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
          '@media (min-width: 1200px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        }}
      >
        {images.map((img, idx) => {
          const imageKey = img.id || img[imageUrlField] || idx;
          const imageSrc = (img[imageUrlField] || '').trim() || fallbackSrc;

          return (
            <ImageCaptionTooltip
              key={imageKey}
              captionEn={img.caption_en}
              captionCn={img.caption_cn}
              isCn={isCn}
              placement={tooltipPosition}
            >
              <Box
                sx={{
                  aspectRatio: isMobile ? 'auto' : '1/1',
                  overflow: 'hidden',
                  cursor: isClickable ? 'pointer' : 'default',
                  width: '100%',
                  background: 'transparent',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': isClickable && !isMobile
                    ? {
                        transform: 'scale(1.02)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      }
                    : {},
                }}
                onClick={() => handleClick(imageSrc)}
              >
                {isMobile ? (
                  <img
                    src={imageSrc}
                    alt={`${artworkTitle || 'Artwork'} ${idx + 2}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                      display: 'block',
                      background: 'transparent',
                    }}
                    onError={(e) => {
                      if (e.target.src !== fallbackSrc) e.target.src = fallbackSrc;
                    }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    src={
                      enableGifRestart && imageUtils.isGif(imageSrc)
                        ? imageUtils.addTimestampToGif(imageSrc, Date.now() + idx)
                        : imageSrc
                    }
                    alt={`${artworkTitle || 'Artwork'} ${idx + 2}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: '#fff',
                      '& img': { objectFit: 'cover' },
                    }}
                  />
                )}
              </Box>
            </ImageCaptionTooltip>
          );
        })}
      </Box>
    </Box>
  );
};

ImageZoomable.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func,
  artworkTitle: PropTypes.string,
  imageUrlField: PropTypes.string,
  fallbackSrc: PropTypes.string,
  enableGifRestart: PropTypes.bool,
  isCn: PropTypes.bool,
  tooltipPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  // Zoom / navigation control
  zoomable: PropTypes.bool,
  pageUrl: PropTypes.string,
};

export default ImageZoomable;