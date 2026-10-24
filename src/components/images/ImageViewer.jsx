import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Snackbar, Alert } from "@mui/material";
import { imageUtils } from '@/utils/imageUtils';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const imageContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "auto",
  overflow: "hidden",
  margin: "10px",
};

const ImageViewer = ({ img_url, caption, onLoadingChange, style, enableGifRestart = true }) => {
  const containerRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(450);
  const [src, setSrc] = useState(img_url);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const timeoutRef = useRef(null);

  console.log('ImageViewer received img_url:', img_url);

  const setResponsiveImageWidth = () => {
    if (containerRef.current) {
      setImageWidth(containerRef.current.offsetWidth);
    }
  };

  const setLoadingState = (loading) => {
    console.log('Setting loading state to:', loading);
    setIsLoading(loading);
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  };

  useEffect(() => {
    setResponsiveImageWidth();
    window.addEventListener("resize", setResponsiveImageWidth);

    return () => {
      window.removeEventListener("resize", setResponsiveImageWidth);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log('ImageViewer img_url changed to:', img_url);
    setSrc(img_url);
    setError(false);
    
    if (img_url) {
      setLoadingState(true);
      
      timeoutRef.current = setTimeout(() => {
        console.log('Loading timeout reached, hiding loading state');
        setLoadingState(false);
      }, 3000);
    } else {
      setLoadingState(false);
    }
  }, [img_url]);

  const validImageUrl = (url) => {
    const isValid = (
      typeof url === "string" &&
      url.trim() !== "" &&
      (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://"))
    );
    if (!isValid) {
      console.log('[ImageViewer] Invalid image URL:', url);
    }
    return isValid;
  };

  const imageSrc = error ? "/error.png" : (validImageUrl(img_url) ? img_url : "/error.png");
  
  // Add timestamp to GIF to force restart if enabled
  const finalImageSrc = enableGifRestart && imageUtils.isGif(imageSrc) 
    ? imageUtils.addTimestampToGif(imageSrc, Date.now())
    : imageSrc;

  const handleImageError = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[ImageViewer] Image failed to load:', img_url, '| imageSrc:', imageSrc);
    }
    setError(true);
    setShowErrorAlert(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoadingState(false);
  };

  const handleImageLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoadingState(false);
    
    // Log GIF loading for debugging
    if (imageUtils.isGif(img_url)) {
      console.log('GIF loaded in ImageViewer:', img_url);
    }
  };

  const handleImageClick = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const handleCloseErrorAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowErrorAlert(false);
  };

  return (
    <>
      <div ref={containerRef} style={imageContainer}>
        <div 
          style={{ 
            position: 'relative',
            width: style?.width || 200,
            height: style?.height || 200,
            cursor: 'pointer',
            borderRadius: style?.borderRadius || 8,
            overflow: 'hidden',
            background: style?.background || '#f5f5f5',
            ...style
          }}
          onClick={handleImageClick}
        >
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <LoadingSpinner size={40} />
            </div>
          )}
          
          <Image
            src={finalImageSrc}
            alt="Image Viewer"
            fill
            style={{ 
              objectFit: style?.objectFit || 'fill',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {caption && (
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            {caption}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={closePreview}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <Image
              src={finalImageSrc}
              alt="Preview"
              width={800}
              height={600}
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            <button
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      {showErrorAlert && (
        <Snackbar
          open={showErrorAlert}
          autoHideDuration={4000}
          onClose={handleCloseErrorAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="error" 
            onClose={handleCloseErrorAlert} 
            sx={{ 
              backgroundColor: 'var(--background-primary, #fff)', 
              color: 'var(--text-primary, #000)', 
              borderRadius: '8px', 
              fontWeight: 500 
            }}
          >
            {caption ? `${caption}: ` : ''}Image failed to load.
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

// New DetailImageView component for artwork detail page
export const DetailImageView = ({ img_url, caption, style }) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  const imageSrc = error ? "/error.png" : img_url;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src={imageSrc}
          alt={caption || 'Artwork Image'}
          fill
          style={{
            objectFit: 'contain',
            background: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            ...style
          }}
          onError={handleImageError}
          sizes="100vw"
        />
      </div>
    </div>
  );
};

export default ImageViewer;