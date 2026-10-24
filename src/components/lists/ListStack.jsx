import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Box, Divider } from '@mui/material';
import AnimatedUnderlineTitle from '../animations/AnimatedUnderlineTitle';
import { useReverseTheme } from '@/hooks/useReverseTheme';

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },
  listItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
};

/**
 * ListStack - A vertical stack of selectable items with integrated item wrapper
 * Combines list container and item functionality in one component
 * @param {Object} props
 * @returns {JSX.Element}
 */
export const ListStack = ({
  items,
  selectedItemId,
  onSelectItem,
  renderItem,
  getItemId,
  isMobile = false,
  className = '',
  containerStyle = {},
  animationVariants = ANIMATION_VARIANTS,
  showDividers = true,
  // Item-level props
  itemClassName = '',
  itemHoverEffect = { x: 3 },
  itemTapEffect = { scale: 0.98 },
  dividerStyle = {},
  ...otherProps
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { colors } = useReverseTheme();

  return (
    <motion.div
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
      className={`w-full h-full min-h-screen listScrollbar ${className}`}
      style={{ 
        overflowY: 'auto', 
        overflowX: 'hidden',
        backgroundColor: colors.background,
        ...containerStyle 
      }}
    >
      <Box className="h-full pb-0">
        <Box sx={{ p: 2, md: { p: 3 } }}>
          <Box role="list" className="w-full">
            {items.map((item, idx) => {
              const itemId = getItemId(item);
              const isSelected = itemId === selectedItemId;
              const isLast = idx === items.length - 1;
              const isHovered = hoveredIdx === idx;
              
              return (
                <Box 
                  key={itemId} 
                  className={`relative w-full ${itemClassName}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Integrated Item Wrapper with Animation */}
                  <motion.div
                    variants={animationVariants.listItem}
                    whileHover={itemHoverEffect}
                    whileTap={itemTapEffect}
                  >
                    {renderItem ? renderItem({
                      item,
                      isSelected,
                      onSelect: () => onSelectItem(itemId),
                      isLast,
                      isHovered,
                      isMobile,
                      index: idx,
                      showDividers,
                      ...otherProps
                    }) : (
                      <AnimatedUnderlineTitle 
                        title={item.title} 
                        isHovered={isHovered} 
                      />
                    )}
                  </motion.div>
                  
                  {/* Integrated Divider */}
                  {!isLast && showDividers && (
                    <Box sx={{ mx: 1.5, md: { mx: 2 }, ...dividerStyle }}>
                      <Divider />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

ListStack.propTypes = {
  // Core list props
  items: PropTypes.array.isRequired,
  selectedItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectItem: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  getItemId: PropTypes.func.isRequired,
  
  // Display props
  isMobile: PropTypes.bool,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  animationVariants: PropTypes.object,
  showDividers: PropTypes.bool,
  
  // Item-level props
  itemClassName: PropTypes.string,
  itemHoverEffect: PropTypes.object,
  itemTapEffect: PropTypes.object,
  dividerStyle: PropTypes.object
};

export default ListStack;