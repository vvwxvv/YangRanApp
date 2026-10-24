"use client";
import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import ImageZoomModal from '@/components/images/ImageZoomModal';

const InfoModal = ({
  isOpen,
  onClose,
  children,
  title = '',
  showImageZoom = false,
  imageUrl = null,
  imageTitle = '',
  maxWidth = '100%',
  maxHeight = '100%',
  padding = 3,
  backgroundColor = 'var(--background-primary, #ffffff)',
  closeButtonColor = '#000000',
  closeButtonBgColor = 'rgba(255, 255, 255, 0.1)',
  closeButtonHoverBgColor = 'rgba(255, 255, 255, 0.2)',
  zIndex = 9999
}) => {
  const [imageZoomOpen, setImageZoomOpen] = useState(false);

  const handleCloseImageZoom = () => {
    setImageZoomOpen(false);
  };

  const handleImageClick = () => {
    if (showImageZoom && imageUrl) {
      setImageZoomOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Info Modal */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: backgroundColor,
          zIndex: zIndex,
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: zIndex + 1,
            color: closeButtonColor,
            backgroundColor: closeButtonBgColor,
            '&:hover': {
              backgroundColor: closeButtonHoverBgColor,
            },
          }}
        >
          <X size={24} />
        </IconButton>

        {/* Modal Content */}
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            p: padding,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={handleImageClick}
        >
          {children}
        </Box>
      </Box>

      {/* Image Zoom Modal - Only rendered if showImageZoom is true */}
      {showImageZoom && (
        <ImageZoomModal
          isOpen={imageZoomOpen}
          onClose={handleCloseImageZoom}
          imageUrl={imageUrl}
          title={imageTitle}
        />
      )}
    </>
  );
};


export default InfoModal;
