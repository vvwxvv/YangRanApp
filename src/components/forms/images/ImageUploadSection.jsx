"use client";
import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import FileUploadComponent from '../../uploads/FileUploadComponent';
import useFont from '@/hooks/useFont';
import { LanguageContext } from "@/components/contexts/LanguageContext";

// ============================================================================
// TEXT LABELS CONFIGURATION
// ============================================================================
const TEXT_LABELS = {
  manualUrlInput: {
    en: 'Manual URL Input',
    cn: '手动输入图片URL'
  },
  uploadImage: {
    en: 'Upload Image', 
    cn: '上传图片'
  },
  chooseInstruction: {
    en: 'Select Image URL or Upload',
    cn: '选择图片URL或上传'
  },
  imageUrlPlaceholder: {
    en: 'Enter image URL...',
    cn: '请输入图片URL...'
  },
  uploadedImageUrl: {
    en: 'Image URL',
    cn: '图片URL'
  },
  imageUrlNote: {
    en: 'You can use this image URL in your content. GIFs will display with animation.',
    cn: '您可以在内容中使用此图片URL。GIF将显示动画效果。'
  },
  imagePreviewAlt: {
    en: 'Image preview',
    cn: '图片预览'
  },
  clickToViewFull: {
    en: 'Click to view full size',
    cn: '点击查看大图'
  },
  imageLoadFailed: {
    en: 'Image failed to load',
    cn: '图片加载失败'
  }
};

const getText = (key, isCn = false) => {
  const textObj = TEXT_LABELS[key];
  if (!textObj) return '';
  return isCn ? textObj.cn : textObj.en;
};

// ============================================================================
// MAIN COMPONENT - FIXED VERSION
// ============================================================================
const ImageUploadSection = ({
  title,
  imgUrl,
  onUploadSuccess,
  onUploadError,
  disabled = false,
  getLabel,
  register,
  fieldName,
  onImageUrlChange,
  form,
  colors
}) => {
  const { inputFontFamily } = useFont();
  const { isCn } = useContext(LanguageContext);
  
  // Simple state management
  const [isManualInput, setIsManualInput] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');

  // Get labels
  const labels = {
    manualUrlInput: getLabel?.('manualUrlInput') ?? getText('manualUrlInput', isCn),
    uploadImage: getLabel?.('uploadImage') ?? getText('uploadImage', isCn),
    chooseInstruction: getLabel?.('chooseInstruction') ?? getText('chooseInstruction', isCn),
    imageUrlPlaceholder: getLabel?.('imageUrlPlaceholder') ?? getText('imageUrlPlaceholder', isCn),
    uploadedImageUrl: getLabel?.('uploadedImageUrl') ?? getText('uploadedImageUrl', isCn),
    imageUrlNote: getLabel?.('imageUrlNote') ?? getText('imageUrlNote', isCn),
    imagePreviewAlt: getLabel?.('imagePreviewAlt') ?? getText('imagePreviewAlt', isCn),
    clickToViewFull: getLabel?.('clickToViewFull') ?? getText('clickToViewFull', isCn),
    imageLoadFailed: getLabel?.('imageLoadFailed') ?? getText('imageLoadFailed', isCn),
  };

  const actualFieldName = fieldName || (register?.name) || 'image_url';

  // FIXED: Only sync on initial mount or when imgUrl changes from external source
  // Use a ref to track if we're typing to prevent sync during user input
  const [isUserTyping, setIsUserTyping] = useState(false);

  useEffect(() => {
    // Only update if not typing and the imgUrl is different from currentUrl
    if (!isUserTyping && imgUrl !== undefined && imgUrl !== currentUrl) {
      setCurrentUrl(imgUrl || '');
    }
  }, [imgUrl]); // Removed currentUrl and isUserTyping from dependencies

  // Simple event handlers
  const handleToggleChange = (event) => {
    setIsManualInput(event.target.checked);
    if (!event.target.checked) {
      setCurrentUrl('');
      if (form?.setValue) {
        form.setValue(actualFieldName, '');
      }
      if (onImageUrlChange) {
        onImageUrlChange('');
      }
    }
  };

  const handleManualUrlChange = (event) => {
    const url = event.target.value;
    
    // Mark that user is typing
    setIsUserTyping(true);
    
    // Update local state immediately for responsive input
    setCurrentUrl(url);
    
    // Update form if provided
    if (form?.setValue) {
      form.setValue(actualFieldName, url, { shouldValidate: false, shouldDirty: true });
    }
    
    // Call callback if provided
    if (onImageUrlChange) {
      onImageUrlChange(url);
    }
  };

  // Reset typing flag after user stops typing
  const handleManualUrlBlur = () => {
    setIsUserTyping(false);
  };

  const handleUploadSuccess = (url) => {
    setCurrentUrl(url);
    
    // Update form if provided
    if (form?.setValue) {
      form.setValue(actualFieldName, url, { shouldValidate: false, shouldDirty: true });
    }
    
    // Call callbacks if provided
    if (onUploadSuccess) {
      onUploadSuccess(url);
    }
    if (onImageUrlChange) {
      onImageUrlChange(url);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Toggle Switch */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isManualInput}
              onChange={handleToggleChange}
              disabled={disabled}
              color="default"
              sx={{
                '& .Mui-checked': {
                  color: colors?.text || 'black',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: colors?.text || 'black',
                },
                '& .MuiSwitch-thumb': {
                  color: colors?.text || 'black',
                },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontFamily: inputFontFamily, fontSize: '13px' }}>
              {isManualInput ? labels.manualUrlInput : labels.uploadImage}
            </Typography>
          }
        />
        <Box sx={{ width: '2px', height: 28, bgcolor: colors?.text || 'black', mx: 2 }} />
        <Box sx={{ 
          bgcolor: colors?.text || 'black', 
          color: colors?.background || 'white', 
          px: 2, 
          py: 0.5, 
          borderRadius: 1, 
          fontSize: '13px', 
          fontFamily: inputFontFamily 
        }}>
          {labels.chooseInstruction}
        </Box>
      </Box>

      {/* Upload Component */}
      {!isManualInput && (
        <FileUploadComponent
          onSuccess={handleUploadSuccess}
          onError={onUploadError}
          title={title}
          disabled={disabled}
          allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
          maxSize={10 * 1024 * 1024}
          isCn={isCn}
        />
      )}

      {/* Manual URL Input - FIXED */}
      {isManualInput && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={currentUrl}
            onChange={handleManualUrlChange}
            onBlur={handleManualUrlBlur}
            placeholder={labels.imageUrlPlaceholder}
            variant="outlined"
            size="small"
            disabled={disabled}
            InputProps={{
              sx: { fontFamily: inputFontFamily, fontSize: '13px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: inputFontFamily,
                fontSize: '13px',
              },
            }}
          />
        </Box>
      )}

      {/* Image Preview */}
      {currentUrl && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'success.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'success.200',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: 'success.main',
              fontFamily: inputFontFamily,
              fontSize: '13px',
            }}
          >
            {labels.uploadedImageUrl}
          </Typography>

          {/* Image Thumbnail */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'success.main',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                }
              }}
              title={labels.clickToViewFull}
            >
              <img
                src={currentUrl}
                alt={labels.imagePreviewAlt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          </Box>
          
          <TextField
            fullWidth
            value={currentUrl}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
              sx: {
                bgcolor: 'white',
                fontFamily: inputFontFamily,
                fontSize: '13px',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontFamily: inputFontFamily,
                fontSize: '13px',
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', color: 'text.secondary', fontFamily: inputFontFamily, fontSize: '13px' }}
          >
            {labels.imageUrlNote}
          </Typography>
        </Box>
      )}

      {/* Hidden input for react-hook-form */}
      {register && <input type="hidden" {...register} />}
    </Box>
  );
};

export default ImageUploadSection;

// ============================================================================
// CONFIGURATIONS
// ============================================================================
export const createImageUploadConfig = (schemaConfig) => {
  const {
    fieldName,
    title,
    defaultValue = '',
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize = 10 * 1024 * 1024,
  } = schemaConfig;

  if (!fieldName) {
    throw new Error('fieldName is required in schemaConfig');
  }

  return {
    fieldName,
    title,
    defaultValue,
    allowedTypes,
    maxSize,
    createRegister: (form) => form.register(fieldName),
    createSetValue: (form) => (url) => form.setValue(fieldName, url, { shouldValidate: false, shouldDirty: true }),
    createWatch: (form) => form.watch(fieldName),
    getValue: (form) => form.getValues(fieldName),
  };
};

