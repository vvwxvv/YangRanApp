import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import useFont from '@/hooks/useFont';

// ================================
// TYPOGRAPHY & LAYOUT CONSTANTS
// ================================
const TYPOGRAPHY = {
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px'
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    bolder: '800',
    heavy: '900'
  }
};

const LAYOUT = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '10px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
  },
  margin: {
    group: '20px'
  }
};

// ================================
// REUSABLE INDEXGRIDLIST COMPONENT
// ================================
const IndexGridList = ({
  // Data props
  groupedItems = [],
  
  // Display configuration
  showGroupLabels = true,
  groupLabelStyle = {},
  
  // Item configuration
  getImageUrl = (item) => item.imageUrl || '',
  getItemId = (item) => item._id || item.id,
  getItemTitle = (item) => item.title || '',
  getItemYear = (item) => item.year || '--',
  getItemSeries = (item) => item.series || '',
  getItemTypeLabel = (item) => item.type || '',
  
  // Hover card configuration
  hoverCardFields = [],
  showHoverCard = true,
  
  // Click behavior configuration
  onItemClick = null,
  clickBehavior = 'navigate', // 'navigate' | 'modal' | 'custom' | 'none'
  
  // Modal/Popup configuration
  onModalOpen = null,
  modalComponent = null,
  
  // Management mode
  isManageMode = false,
  onEditClick = null,
  onDeleteClick = null,
  showEditButton = true,
  showDeleteButton = true,
  
  // Style configuration
  fontFamily,
  contentTitleFontFamily,
  
  // Responsive configuration
  gridCols = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    large: 5
  },
  
  // Animation configuration
  enableAnimations = true,
  animationDelay = 0.1,
  
  // Other props
  isCn = false,
  className = '',
  NO_IMAGE = '/placeholder.jpg'
}) => {
  // ================================
  // STATE MANAGEMENT
  // ================================
  const [hoveredItem, setHoveredItem] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { contentFontFamily: hookBodyFont, contentTitleFontFamily: hookTitleFont } = useFont();
  const resolvedFontFamily = fontFamily && fontFamily !== 'inherit' ? fontFamily : hookBodyFont;
  const resolvedTitleFontFamily = contentTitleFontFamily && contentTitleFontFamily !== 'inherit' ? contentTitleFontFamily : hookTitleFont;

  // ================================
  // COMPONENT STYLES
  // ================================
  const componentStyles = useMemo(() => ({
    groupLabel: {
      fontWeight: TYPOGRAPHY.fontWeight.bolder,
      color: 'var(--text-primary, #000000)',
      fontSize: TYPOGRAPHY.fontSize.base,
      ...groupLabelStyle
    },
    groupDivider: {
      height: '1px',
      backgroundColor: 'var(--text-primary, #000000)',
      margin: `${LAYOUT.margin.group} 0`,
      width: '100%'
    }
  }), [groupLabelStyle]);

  // ================================
  // EVENT HANDLERS
  // ================================
  
  /**
   * Handle item click based on behavior configuration
   */
  const handleItemClick = useCallback((item, event) => {
    event?.preventDefault();
    
    switch (clickBehavior) {
      case 'modal':
        setModalItem(item);
        setIsModalOpen(true);
        onModalOpen?.(item);
        break;
        
      case 'custom':
        onItemClick?.(item, event);
        break;
        
      case 'navigate':
        onItemClick?.(item, event);
        break;
        
      case 'none':
      default:
        // Do nothing
        break;
    }
  }, [clickBehavior, onItemClick, onModalOpen]);

  /**
   * Handle edit button click
   */
  const handleEditClick = useCallback((item, event) => {
    event?.stopPropagation();
    onEditClick?.(item, event);
  }, [onEditClick]);

  /**
   * Handle delete button click
   */
  const handleDeleteClick = useCallback((item, event) => {
    event?.stopPropagation();
    onDeleteClick?.(item, event);
  }, [onDeleteClick]);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalItem(null);
  }, []);

  // ================================
  // RENDER HELPERS
  // ================================
  
  /**
   * Render hover card for item
   */
  const renderHoverCard = useCallback((item) => {
    if (!showHoverCard || !hoverCardFields.length) return null;
    
    return (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-white p-4 rounded shadow-lg max-w-xs">
          {hoverCardFields.map((field, index) => {
            const value = typeof field.getValue === 'function' 
              ? field.getValue(item) 
              : item[field.key];
              
            if (!value) return null;
            
            return (
              <div key={field.key || index} className="mb-2">
                <span className="font-semibold">{field.label}: </span>
                <span>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [showHoverCard, hoverCardFields]);

  /**
   * Render management buttons
   */
  const renderManagementButtons = useCallback((item) => {
    if (!isManageMode) return null;
    
    return (
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        {showEditButton && onEditClick && (
          <button
            onClick={(e) => handleEditClick(item, e)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            style={{ fontSize: TYPOGRAPHY.fontSize.xs }}
          >
            Edit
          </button>
        )}
        {showDeleteButton && onDeleteClick && (
          <button
            onClick={(e) => handleDeleteClick(item, e)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            style={{ fontSize: TYPOGRAPHY.fontSize.xs }}
          >
            Delete
          </button>
        )}
      </div>
    );
  }, [isManageMode, showEditButton, showDeleteButton, onEditClick, onDeleteClick, handleEditClick, handleDeleteClick]);

  /**
   * Render individual item card
   */
  const renderItemCard = useCallback((item, index, groupIndex = 0) => {
    const imageUrl = getImageUrl(item) || NO_IMAGE;
    const itemId = getItemId(item);
    const title = getItemTitle(item);
    
    const cardContent = (
      <div 
        className={`group relative cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${clickBehavior === 'none' ? 'cursor-default' : ''}`}
        onClick={clickBehavior !== 'none' ? (e) => handleItemClick(item, e) : undefined}
        onMouseEnter={() => setHoveredItem(itemId)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = NO_IMAGE;
            }}
          />
          
          {/* Hover Card Overlay */}
          {renderHoverCard(item)}
          
          {/* Management Buttons */}
          {renderManagementButtons(item)}
        </div>
        
        {/* Item Details - Show title by default */}
        <div className="p-3">
          <h3 
            className="font-medium text-sm mb-1 line-clamp-2"
            style={{ 
              fontFamily: resolvedTitleFontFamily,
              fontSize: TYPOGRAPHY.fontSize.sm,
              color: 'var(--text-primary, #000000)'
            }}
          >
            {title}
          </h3>
        </div>
      </div>
    );

    if (enableAnimations) {
      return (
        <motion.div
          key={itemId || `item-${groupIndex}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * animationDelay 
          }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return (
      <div key={itemId || `item-${groupIndex}-${index}`}>
        {cardContent}
      </div>
    );
  }, [
    getImageUrl, getItemId, getItemTitle,
    NO_IMAGE, clickBehavior, handleItemClick, resolvedFontFamily, resolvedTitleFontFamily,
    renderHoverCard, renderManagementButtons, enableAnimations, animationDelay
  ]);

  // ================================
  // MAIN RENDER
  // ================================
  return (
    <div className={className} style={{ fontFamily: resolvedFontFamily }}>
      {/* Responsive Grid Styles */}
      <style jsx>{`
        .responsive-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(${gridCols.mobile}, 1fr);
        }
        @media (min-width: 640px) {
          .responsive-grid {
            grid-template-columns: repeat(${gridCols.tablet}, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .responsive-grid {
            grid-template-columns: repeat(${gridCols.desktop}, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .responsive-grid {
            grid-template-columns: repeat(${gridCols.large}, 1fr);
          }
        }
      `}</style>
      {/* Grouped Items Display */}
      {groupedItems.map((group, groupIndex) => (
        <div key={group.label || `group-${groupIndex}`}>
          {/* Group Container */}
          <div style={{ marginBottom: LAYOUT.margin.group }}>
            {/* Group Label */}
            {showGroupLabels && group.label && (
              <div 
                className="mb-4"
                style={componentStyles.groupLabel}
              >
                {group.label}
              </div>
            )}
            
            {/* Items Grid */}
            <div className="responsive-grid">
              {group.items?.map((item, index) => 
                renderItemCard(item, index, groupIndex)
              )}
            </div>
          </div>
          
          {/* Group Divider */}
          {groupIndex < groupedItems.length - 1 && (
            <div style={componentStyles.groupDivider} />
          )}
        </div>
      ))}
      
      {/* Modal Renderer */}
      {isModalOpen && modalComponent && modalItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4">
              <button
                onClick={handleModalClose}
                className="float-right text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              {modalComponent(modalItem, handleModalClose)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexGridList;