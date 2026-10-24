"use client";

import {
  Box,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { Image } from "antd";
import PropTypes from 'prop-types';
import { imageUtils } from '@/utils/imageUtils';

// Configuration for the ImageGrid component
const CONFIG = {
  layout: {
    gridSpacing: {
      mobile: 2,
      desktop: 3,
    }
  },
  animation: {
    staggerDelay: 0.1,
  },
  images: {
    aspectRatio: "4/3",
  },
  colors: {
    noDataBg: "#f9f9f9",
  }
};

// Utility function to create motion variants
const createMotionVariants = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

const ImageGrid = ({ 
  images = [], 
  maxImages = 3, 
  aspectRatio = CONFIG.images.aspectRatio,
  spacing = null,
  padding = "40px",
  marginTop = 2.5,
  borderRadius = "8px",
  backgroundColor = CONFIG.colors.noDataBg,
  altTextPrefix = "Gallery view",
  enableGifRestart = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const gridSpacing = spacing || (isMobile ? CONFIG.layout.gridSpacing.mobile : CONFIG.layout.gridSpacing.desktop);

  // If no images provided, return null
  if (!images || images.length === 0) {
    return null;
  }

  // Limit the number of images to display
  const displayImages = images.slice(0, maxImages);

  return (
    <Box sx={{ mt: marginTop, padding }}>
      <Grid container spacing={gridSpacing}>
        {displayImages.map((imgSrc, idx) => (
          <Grid item xs={4} sm={4} md={4} key={idx}>
            <motion.div {...createMotionVariants(idx * CONFIG.animation.staggerDelay)}>
              <Box 
                sx={{ 
                  aspectRatio,
                  overflow: "hidden",
                  borderRadius,
                  backgroundColor
                }}
              >
                <Image 
                  src={enableGifRestart && imageUtils.isGif(imgSrc) 
                    ? imageUtils.addTimestampToGif(imgSrc, Date.now() + idx)
                    : imgSrc
                  } 
                  alt={`${altTextPrefix} ${idx + 1}`} 
                  width="100%" 
                  height="100%"
                  style={{ 
                    objectFit: "cover",
                    borderRadius
                  }}
                  onLoad={() => {
                    if (imageUtils.isGif(imgSrc)) {
                      console.log('GIF loaded in ImageGrid:', imgSrc);
                    }
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// PropTypes for type checking
ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxImages: PropTypes.number,
  aspectRatio: PropTypes.string,
  spacing: PropTypes.number,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.string,
  backgroundColor: PropTypes.string,
  altTextPrefix: PropTypes.string,
  enableGifRestart: PropTypes.bool,
};

export default ImageGrid;   