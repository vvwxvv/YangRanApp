import { useState, useCallback } from "react";

/**
 * Manages image zoom modal open/close state.
 * Reused by SeriesDetail, ArtworkDetail, any page with zoom.
 *
 * @returns {{ modalOpen, selectedImage, handleImageClick, handleModalClose }}
 */
export default function useImageZoom() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = useCallback((imageOrUrl) => {
    let imageUrl;

    if (typeof imageOrUrl === "string") {
      imageUrl = imageOrUrl;
    } else if (imageOrUrl?.url || imageOrUrl?.img_url) {
      imageUrl = imageOrUrl.url || imageOrUrl.img_url;
    } else {
      console.warn("Invalid image data passed to handleImageClick:", imageOrUrl);
      return;
    }

    setSelectedImage(imageUrl);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedImage(null);
  }, []);

  return { modalOpen, selectedImage, handleImageClick, handleModalClose };
}