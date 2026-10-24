import React, { useContext } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { DeviceContext } from '@/components/contexts/DeviceContext';
import { renderTextWithFormatting, renderArrayContent } from '@/utils/textFormatting';
import TwoColumnLayout from '@/components/layouts/TwoColumnLayout';
import CoverImage from '@/components/images/CoverImage';
import { Box, Typography } from '@mui/material';
import AlertInfo from '@/components/alerts/AlertInfo';

const TwoColumnDetailSection = ({ 
  // Data
  dataItem,
  
  // Filter configuration - generic field-based filtering
  filterConfig = {
    filters: [] // Array of filter objects: { field: 'mark', value: 'expected_value', languageDependent: true, defaults: { cn: "画廊介绍", en: "About Gallery" } }
  },
  
  // Field configuration for rendering - completely configurable
  fieldConfig = {
    coverImage: {
      field: 'cover_image_url',
      titleField: 'title',
      defaultUrl: "/imgs/gallery_space_00.webp"
    },
    sections: [
      {
        id: 'mainHeading',
        field: 'title', // Generic field name
        type: 'heading',
        style: {
          color: '#212529',
          fontSize: '12px',
          fontWeight: 700,
          lineHeight: '1.3',
          margin: 0,
          letterSpacing: '-0.02em'
        }
      },
      {
        id: 'mainContent',
        field: 'content', // Generic field name
        type: 'text',
        style: {
          color: '#495057',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '1.7',
          margin: 0,
          textAlign: 'justify'
        }
      },
      {
        id: 'additionalContent',
        field: 'items', // Generic field name
        type: 'array',
        style: {
          color: '#495057',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '1.8'
        },
        itemStyle: {
          textAlign: 'justify',
          lineHeight: 1.8,
          fontSize: '12px',
          margin: '0 0 16px 0',
          color: '#495057'
        }
      },
      {
        id: 'specialContent',
        field: 'description', // Generic field name
        type: 'special',
        style: {
          fontFamily: null, // Will be set based on language
          fontSize: "12px",
          color: "#444",
          lineHeight: 1.8,
          whiteSpace: "pre-line",
          letterSpacing: "0.3px"
        }
      }
    ]
  },
  
  // Layout options
  twoColumnMode = false,
  showCoverImage = true,
  showContentSection = true,
  
  // Style overrides
  coverImageProps = {},
  contentSectionProps = {},
  coverImageUrl = null,
  
  // Alert messages
  alertMessages = {
    message: "NO INFORMATION",
    subMessage: "No information available",
    messageCn: "无信息",
    subMessageCn: "没有可用的信息"
  },
  
  // Add onImageClick prop
  onImageClick,
  
  // Additional content to render at bottom of right column
  additionalRightContent = null,
}) => {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
   
  if (!dataItem) {
    return (
      <AlertInfo
        message={alertMessages.message}
        subMessage={alertMessages.subMessage}
        messageCn={alertMessages.messageCn}
        subMessageCn={alertMessages.subMessageCn}
        isCn={isCn}
      />
    );
  }

  // Apply filters - generic filtering system
  const passesFilters = filterConfig.filters?.every(filter => {
    if (!filter.field || !dataItem.hasOwnProperty(filter.field)) {
      return true; // Skip filter if field doesn't exist
    }

    let expectedValue = filter.value;
    
    // Handle language-dependent values
    if (filter.languageDependent && filter.defaults) {
      expectedValue = filter.value || (isCn ? filter.defaults.cn : filter.defaults.en);
    }

    return dataItem[filter.field] === expectedValue;
  });

  if (!passesFilters) {
    return null;
  }

  // Helper function to render different field types
  const renderField = (section, fieldData) => {
    if (!fieldData || !section) return null;

    switch (section.type) {
      case 'array':
        if (!Array.isArray(fieldData)) return null;
        return (
          <div style={section.style}>
            {renderArrayContent(fieldData, section.itemStyle)}
          </div>
        );

      case 'special':
        const specialStyle = {
          ...section.style,
          fontFamily: section.style?.fontFamily || (isCn ? "YShiPen_Shuti" : "Stardos Stencil")
        };
        
        return (
          <Typography sx={specialStyle}>
            {fieldData}
          </Typography>
        );

      case 'heading':
        return (
          <h2 style={section.style}>
            {renderTextWithFormatting(fieldData)}
          </h2>
        );

      case 'text':
      default:
        return (
          <div style={section.style}>
            {renderTextWithFormatting(fieldData)}
          </div>
        );
    }
  };

  // Get field data safely
  const getFieldData = (fieldName) => {
    return fieldName ? dataItem[fieldName] : null;
  };

  // Cover Image Section - now with onImageClick support
  const CoverImageSection = showCoverImage ? (
    <CoverImage 
      coverImageUrl={
        coverImageUrl || 
        getFieldData(fieldConfig?.coverImage?.field) || 
        fieldConfig?.coverImage?.defaultUrl || 
        "/no-image.png"
      }
      title={getFieldData(fieldConfig?.coverImage?.titleField) || "Cover Image"}
      alt={getFieldData(fieldConfig?.coverImage?.titleField) || "Cover Image"}
      onImageClick={onImageClick} // Pass the onImageClick prop
      {...coverImageProps}
    />
  ) : null;

  // Find special content section for separate rendering
  const specialContentSection = fieldConfig?.sections?.find(section => section.type === 'special');
  const specialContentData = specialContentSection ? getFieldData(specialContentSection.field) : null;

  // Special Content Section
  const SpecialContentSection = showContentSection && specialContentData ? (
    <Box sx={{ 
      width: "100%",
      display: "flex",
      flexDirection: "column",
      maxWidth: "800px",
      mx: "auto",
      px: "16px",
      ...contentSectionProps
    }}>
      {renderField(specialContentSection, specialContentData)}
    </Box>
  ) : null;

  // Main Text Content Section
  const TextContent = (
    <div className="w-full">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {fieldConfig?.sections?.map((section) => {
          // Skip special content sections as they're rendered separately
          if (section.type === 'special') return null;
          
          const fieldData = getFieldData(section.field);
          if (!fieldData) return null;
          
          return (
            <div key={section.id}>
              {renderField(section, fieldData)}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Two Column Layout
  if (twoColumnMode) {
    const LeftContent = (
      <div className="w-full flex items-center justify-center overflow-hidden" 
           style={{ padding: '0', marginTop: isMobile ? '20px' : '0' }}>
        {CoverImageSection}
      </div>
    );

    const RightContent = (
      <div className="w-full min-h-full relative" style={{ padding: '0' }}>
        <div style={{
          paddingTop: isMobile ? '0px' : '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {fieldConfig?.sections?.map((section) => {
            // Skip special content sections as they're rendered separately
            if (section.type === 'special') return null;
            
            const fieldData = getFieldData(section.field);
            if (!fieldData) return null;
            
            return (
              <div key={section.id}>
                {renderField(section, fieldData)}
              </div>
            );
          })}
          {/* Additional content at bottom of right column */}
          {additionalRightContent && (
            <div style={{ marginTop: '12px' }}>
              {additionalRightContent}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="w-full">
        <TwoColumnLayout
          isManagerMode={false}
          leftContent={LeftContent}
          rightContent={RightContent}
        />
        {SpecialContentSection}
      </div>
    );
  }

  // Single Column Layout
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '16px 0' }}>
      {CoverImageSection}
      {TextContent}
      {additionalRightContent && (
        <div style={{ marginTop: '20px' }}>
          {additionalRightContent}
        </div>
      )}
      {SpecialContentSection}
    </div>
  );
};

export default TwoColumnDetailSection;