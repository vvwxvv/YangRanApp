import React, { useMemo } from "react";
import { Card, Box, Chip, Grow, Tooltip } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageViewer from './ImageViewer';
import { formatImageUrl } from '@/components/pages/manager/constants';
import { getOrder } from '@/utils/mediaOrder';

const DraggableImage = ({ 
  image, 
  index, 
  isCn = false, 
  isOver = false, 
  isDragging: externalIsDragging = false,
  isOverlay = false 
}) => {
  // Sortable hook - note: id uses image._id to match your data structure
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging: sortableIsDragging 
  } = useSortable({
    id: image?._id || `fallback-${index}`,
    disabled: isOverlay || !image?._id,
  });

  // Determine final dragging state
  const isDragging = externalIsDragging || sortableIsDragging;

  // Robust image URL extraction with memoization
  const imageUrl = useMemo(() => {
    if (!image) return null;
    
    const getImageUrl = (item) => {
      const possibleImageKeys = [
        'img_url', 'image_url', 'imageUrl', 'imgUrl', 'cover_img_url',
        'coverImageUrl', 'cover_image_url', 'photo_url', 'photoUrl',
        'picture_url', 'pictureUrl', 'src', 'url'
      ];
      for (const key of possibleImageKeys) {
        if (item[key] && typeof item[key] === 'string' && item[key].trim() !== '') {
          return item[key];
        }
      }
      return null;
    };
    
    try {
      return formatImageUrl(getImageUrl(image));
    } catch (error) {
      console.warn('Error formatting image URL:', error);
      return null;
    }
  }, [image]);

  // Early return for invalid image
  if (!image || (!image._id && !isOverlay)) {
    return null;
  }

  // Don't apply drag listeners to overlay
  const dragProps = isOverlay ? {} : {
    ref: setNodeRef,
    ...attributes,
    ...listeners,
  };

  return (
    <Grow in timeout={300 + index * 50}>
      <div
        {...dragProps}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          marginBottom: 24,
          zIndex: isDragging ? 999 : "auto",
          cursor: "grab",
        }}
      >
        <Card
          sx={{
            position: 'relative',
            borderRadius: '16px',
            border: isDragging ? '2px solid #1976d2' : '1px solid #e0e0e0',
            backgroundColor: '#fff',
            boxShadow: isDragging
              ? '0 8px 24px rgba(25, 118, 210, 0.15)'
              : '0 2px 8px rgba(0,0,0,0.08)',
            transform: isDragging ? 'rotate(3deg) scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            width: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.01)',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.12)',
            },
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          {/* Drop indicator - keeping your original style */}
          {isOver && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 6,
              background: 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '90%',
                height: 3,
                borderRadius: 2,
                background: '#fff',
                boxShadow: '0 0 8px 2px #fff',
                animation: 'blinkWhiteLine 1s steps(2, start) infinite',
              }} />
              <style>{`
                @keyframes blinkWhiteLine {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.2; }
                }
              `}</style>
            </div>
          )}

          {/* Order badge - keeping your original style */}
          <Chip
            label={getOrder(image, "artist_page_order") || (index + 1)}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 3,
              backgroundColor: 'var(--background-primary, #fff)',
              color: 'var(--text-primary, #000)',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              height: 28,
              minWidth: 28,
              '& .MuiChip-label': {
                px: 1,
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease',
            }}
          />

          {/* Image container - keeping your original style exactly */}
          <Tooltip title={image.title || ''} arrow placement="top">
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              aspectRatio: '1/1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: { xs: 120, sm: 160, md: 200, lg: 240 }, 
              maxHeight: { xs: 180, sm: 240, md: 320, lg: 400 } 
            }}>
              {imageUrl ? (
                <ImageViewer 
                  img_url={imageUrl} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'fill', 
                    borderRadius: 8, 
                    background: '#f5f5f5', 
                    aspectRatio: '1/1' 
                  }} 
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  borderRadius: 8,
                  background: '#f5f5f5',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  No Image
                </div>
              )}
            </Box>
          </Tooltip>
        </Card>
      </div>
    </Grow>
  );
};

DraggableImage.displayName = 'DraggableImage';

export default React.memo(DraggableImage, (prevProps, nextProps) => {
  return (
    prevProps.image?._id === nextProps.image?._id &&
    prevProps.index === nextProps.index &&
    prevProps.isCn === nextProps.isCn &&
    prevProps.isOver === nextProps.isOver &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isOverlay === nextProps.isOverlay
  );
});