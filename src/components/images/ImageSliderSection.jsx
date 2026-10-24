"use client";

import React from 'react';
import ImageAutoSlider from '@/components/images/ImageAutoSlider';



const NO_IMAGE = '/no-image.png';
const PLACEHOLDER_IMAGE = '/placeholder.png';
const SLIDER_CONFIG = {
  autoPlayInterval: 4000,
  gifDuration: 5000,
  height: '50vh'
};


const ImageSliderSection = ({ images, fontFamily }) => (
  <section 
    className="relative mt-0"  
    style={{ 
      fontFamily,
      backgroundColor: "transparent",
      height: SLIDER_CONFIG.height
    }}
  >
    <ImageAutoSlider
      images={images}
      className="w-full h-full"
      fallbackImage={NO_IMAGE}
      loadingImage={PLACEHOLDER_IMAGE}
      autoPlayInterval={SLIDER_CONFIG.autoPlayInterval}
      gifDuration={SLIDER_CONFIG.gifDuration}
    />
  </section>
);

export default ImageSliderSection;