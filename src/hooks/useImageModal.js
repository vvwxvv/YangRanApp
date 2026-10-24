

import { useState, useCallback } from 'react';

const useImageModal = (fallbackImage = "/no-image.png") => {
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle image click to open modal
  const handleImageClick = useCallback((imageUrl) => {
    if (!imageUrl || imageUrl === fallbackImage) return;
    setEnlargedImage(imageUrl);
    setModalOpen(true);
  }, [fallbackImage]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEnlargedImage(null);
  }, []);

  // Open modal with specific image
  const openModal = useCallback((imageUrl) => {
    if (!imageUrl || imageUrl === fallbackImage) return;
    setEnlargedImage(imageUrl);
    setModalOpen(true);
  }, [fallbackImage]);

  // Close modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEnlargedImage(null);
  }, []);

  return {
    enlargedImage,
    modalOpen,
    handleImageClick,
    handleModalClose,
    openModal,
    closeModal
  };
};

export default useImageModal;
