import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Reusable Side Drawer Component
const SideDrawer = ({ isOpen, onClose, children, maxWidth = 'max-w-md' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black bg-opacity-30"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 h-full w-full ${maxWidth} z-50 overflow-y-auto bg-white`}
            style={{
              border: '1px solid black',
              boxShadow: '-2px 0 0 rgba(0, 0, 0, 1)',
            }}
          >
            {/* Close button - Bauhaus X */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="p-2 pt-20">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;