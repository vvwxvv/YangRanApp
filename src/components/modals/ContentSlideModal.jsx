"use client";
import React, { useContext } from "react";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";

const ContentSlideModal = ({ isVisible, handleClose, ContentComponent, ...props }) => {
  const { ismobile } = useContext(DeviceContext);

  const transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };
  const MotionDialog = motion.create(Dialog);

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionDialog
          fullScreen={ismobile}
          open={isVisible}
          onClose={handleClose}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={transition}
          PaperProps={{
            style: ismobile ? { width: '100vw', height: '100vh', margin: 0, maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0 } : {},
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '12px 20px 8px 20px', borderBottom: '1px solid var(--border-light, #eee)' }}>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{ padding: ismobile ? '0 0 16px 0' : '24px 24px 16px 24px', minWidth: ismobile ? '100vw' : 320, minHeight: ismobile ? '100vh' : undefined }}>
            {ContentComponent && <ContentComponent {...props} />}
          </div>
        </MotionDialog>
      )}
    </AnimatePresence>
  );
};

export default ContentSlideModal;
