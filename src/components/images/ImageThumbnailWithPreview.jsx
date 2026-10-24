import React, { useState } from "react";
import BootstrapTooltip from "@/components/others/BootstrapTooltip";
import ImageZoomModal from "@/components/images/ImageZoomModal";
import { imageUtils } from '@/utils/imageUtils';
import ImageCaptionTooltip from './ImageCaptionTooltip';

const ImageThumbnailWithPreview = ({ 
  src, 
  alt = "thumbnail", 
  tooltip, 
  width = 200, 
  style = {}, 
  onPreview, 
  enableGifRestart = true,
  // New tooltip props
  isCn = false,
  captionEn,
  captionCn,
  showTooltip = true,
  tooltipPosition = 'bottom'
}) => {
  const [open, setOpen] = useState(false);
  
  if (!src) return <span style={{ color: '#999' }}>-</span>;
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (onPreview) onPreview(src);
    else setOpen(true);
  };

  return (
    <>
      <div className="relative group">
        <BootstrapTooltip title={tooltip || src}>
          <img
            src={enableGifRestart && imageUtils.isGif(src) 
              ? imageUtils.addTimestampToGif(src, Date.now())
              : src
            }
            alt={alt}
            style={{ 
              width, 
              minWidth: width, 
              height: 'auto', 
              objectFit: 'contain', 
              borderRadius: 4, 
              border: '1px solid #eee', 
              background: '#fff', 
              display: 'block', 
              cursor: 'pointer', 
              ...style 
            }}
            onClick={handleClick}
            onLoad={() => {
              if (imageUtils.isGif(src)) {
                console.log('GIF loaded in ImageThumbnailWithPreview:', src);
              }
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </BootstrapTooltip>

        {/* Custom tooltip for captions */}
        <ImageCaptionTooltip
          caption={isCn ? captionCn : captionEn}
          altText={alt}
          isCn={isCn}
          showTooltip={showTooltip}
          position={tooltipPosition}
        />
      </div>

      {open && (
        <ImageZoomModal isOpen={open} onClose={() => setOpen(false)} imageUrl={src} title={alt} />
      )}
    </>
  );
};

export default ImageThumbnailWithPreview;
