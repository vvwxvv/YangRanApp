"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import useFont from '@/hooks/useFont';

/**
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {import("react").ReactNode} children
 */
export default function RightSlideDrawer({ open, onClose, children }) {
  const { colors } = useReverseTheme();
  const { fontFamily } = useFont();

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[5000] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 h-full w-screen z-[5001] overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
              fontFamily,
              fontSize: "13px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={handleClose}
              aria-label="Close"
              className="fixed left-0 top-0 w-[50px] h-[50px] bg-black flex items-center justify-center z-[10000]"
              whileTap={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <X size={20} className="text-white" />
            </motion.button>

            {/* Drawer content */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}