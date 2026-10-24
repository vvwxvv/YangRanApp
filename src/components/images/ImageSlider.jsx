"use client";

import React, { useState, useContext, useEffect } from "react";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { Carousel, Image, Card, Typography } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const { Text } = Typography;

// Utility function to extract image URLs from an item object
function getImagesFromSchema(item) {
  if (!item || typeof item !== 'object' || item === null || Array.isArray(item)) {
    return [];
  }

  const imageKeys = Object.keys(item).filter(
    (key) => typeof key === 'string' && key.endsWith("_images_url")
  );

  if (imageKeys.length > 0) {
    const firstImageArrayKey = imageKeys[0];
    const potentialImageArray = item[firstImageArrayKey];

    if (Array.isArray(potentialImageArray)) {
      const validUrls = potentialImageArray.filter(
        (url) => typeof url === 'string' && url.trim() !== ''
      );
      return validUrls;
    }
  }
  return [];
}

// Custom arrow components
const CustomArrow = ({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      absolute top-1/2 transform -translate-y-1/2 z-10
      w-10 h-10 flex items-center justify-center
      bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black rounded-full shadow-lg
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${direction === 'prev' ? 'left-2' : 'right-2'}
    `}
  >
    {direction === 'prev' ? 
      <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" /> : 
      <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
    }
  </button>
);

function ImageSlider({ 
  // Can accept either images array or item object
  images = [],
  item = null,
  captions = [],
  // Configuration options
  showArrows = true,
  showDots = true,
  enablePreview = true,
  showCaptions = true,
  // Styling options
  width = "auto",
  maxWidth = "1000px",
  minWidth = "300px",
  aspectRatio = "1 / 1",
  fallbackImage = "/error.png",
  // Callbacks
  onImageError = null,
  onSlideChange = null
}) {
  const { isMobile, isMiddleSizeDevice } = useContext(DeviceContext) || {};
  
  // State for managing valid images
  const [validImages, setValidImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Initialize images from either images prop or item prop
  useEffect(() => {
    let imageList = [];
    
    if (images && images.length > 0) {
      // Handle images array format
      imageList = images.map((img, index) => ({
        src: typeof img === 'string' ? img : img.src,
        alt: typeof img === 'string' ? `Image ${index + 1}` : (img.alt || `Image ${index + 1}`),
        caption: null
      }));
    } else if (item) {
      // Handle item object format
      const extractedUrls = getImagesFromSchema(item);
      imageList = extractedUrls.map((url, index) => ({
        src: url,
        alt: `Image ${index + 1}`,
        caption: null
      }));
    }

    // Set fallback if no valid images found
    const finalImageList = imageList.length > 0 ? imageList : [{
      src: fallbackImage,
      alt: "No image available",
      caption: null
    }];

    setValidImages(finalImageList);
  }, [JSON.stringify(images), item, fallbackImage]);

  // Handle image load errors
  const handleImageLoadError = (indexWithError) => {
    const erroredImageUrl = validImages[indexWithError]?.src;
    
    setValidImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== indexWithError);
      return updatedImages.length > 0 ? updatedImages : [{
        src: fallbackImage,
        alt: "No image available",
        caption: null
      }];
    });

    if (onImageError) {
      onImageError(indexWithError, erroredImageUrl);
    }
  };

  // Handle slide change
  const handleSlideChange = (current) => {
    setCurrentSlide(current);
    if (onSlideChange) {
      onSlideChange(current);
    }
  };

  // Responsive width calculation
  const getResponsiveWidth = () => {
    if (width !== "auto") return width;
    if (isMobile) return "100%";
    if (isMiddleSizeDevice) return "400px";
    return "700px";
  };

  // Check if showing only fallback
  const isShowingFallback = validImages.length === 1 && validImages[0].src === fallbackImage;
  const hasNoValidImages = !images?.length && (!item || getImagesFromSchema(item).length === 0);

  // Handle case where no item/images provided
  if (!item && (!images || images.length === 0)) {
    return (
      <div 
        style={{ 
          width: getResponsiveWidth(), 
          maxWidth, 
          minWidth,
          margin: "0 auto", 
          padding: "20px", 
          textAlign: "center" 
        }}
      >
        <Card>
          <Image 
            src={fallbackImage} 
            alt="Data unavailable" 
            width={64} 
            preview={false} 
          />
          <Text type="secondary" style={{ display: 'block', marginTop: '10px' }}>
            Image data is currently unavailable.
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        width: getResponsiveWidth(),
        maxWidth,
        minWidth,
        margin: "0 auto",
        position: "relative"
      }}
    >
      <Carousel
        dots={showDots ? { className: "custom-dots" } : false}
        arrows={showArrows}
        prevArrow={showArrows ? <CustomArrow direction="prev" /> : null}
        nextArrow={showArrows ? <CustomArrow direction="next" /> : null}
        afterChange={handleSlideChange}
        infinite={validImages.length > 1}
      >
        {validImages.map((imageData, index) => (
          <div key={`${imageData.src}-${index}`}>
            <Card
              styles={{ body: { padding: 0 } }}
              style={{
                aspectRatio,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={imageData.src}
                  alt={imageData.alt}
                  preview={enablePreview && imageData.src !== fallbackImage}
                  width="100%"
                  height="100%"
                  style={{ objectFit: "contain" }}
                  onError={() => handleImageLoadError(index)}
                  placeholder={
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <LoadingSpinner size={40} />
                    </div>
                  }
                />
              </div>
            </Card>
            {showCaptions && imageData.caption && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '10px',
                padding: '0 20px'
              }}>
                <Text type="secondary">{imageData.caption}</Text>
              </div>
            )}
          </div>
        ))}
      </Carousel>
      
      {/* Show message when only fallback is displayed */}
      {isShowingFallback && hasNoValidImages && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Text type="secondary">No displayable images found for this item.</Text>
        </div>
      )}
    </div>
  );
}

export default ImageSlider;