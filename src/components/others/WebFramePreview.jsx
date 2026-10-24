import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import WebFramer from '@/components/others/WebFramer';

/**
 * WebFramePreview Component
 * Reusable web frame preview component with hover effects and responsive sizing
 */
const WebFramePreview = ({
  webUrl,
  hasWebUrl,
  title = 'Web Frame',
  isMuted = true,
  onMuteToggle,
  hovered = false,
  isCn = false,
  width = '45%',
  minHeight = '400px',
  height = '400px'
}) => {
  const WebFramePreviewContent = useCallback(() => {
    if (!hasWebUrl) {
      return (
        <div 
          className="relative overflow-hidden ml-5 flex-shrink-0 flex items-center justify-center bg-gray-100 border border-gray-300 rounded"
          style={{ width, minHeight }}
        >
          <span className="text-gray-400 text-sm">
            {isCn ? '无网页链接' : 'No web URL available'}
          </span>
        </div>
      );
    }

    return (
      <div 
        className="relative overflow-hidden ml-5 flex-shrink-0 rounded border border-gray-300"
        style={{ width, minHeight }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            scale: hovered ? 1.02 : 1,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          style={{
            transformOrigin: 'center center',
            height: '100%',
            width: '100%',
          }}
        >
          <WebFramer 
            url={webUrl}
            height={height}
            width="100%"
            title={title}
            isMuted={isMuted}
            onMuteToggle={onMuteToggle}
          />
        </motion.div>
      </div>
    );
  }, [webUrl, hasWebUrl, title, isMuted, onMuteToggle, hovered, isCn, width, minHeight, height]);

  return <WebFramePreviewContent />;
};

export default WebFramePreview;
