"use client";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';
import InfoModal from '@/components/modals/InfoModal';
import useFont from '@/hooks/useFont';

const FormErrorModal = ({
  isOpen,
  onClose,
  errorMessage,
  errorDetails,
  isCn = false,
  colors = {}
}) => {
  const { contentFontFamily, contentTitleFontFamily, buttonFontFamily } = useFont();

  if (!isOpen || !errorMessage) return null;

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor={colors.background || '#ffffff'}
      closeButtonColor={colors.text || '#000000'}
      zIndex={10000}
    >
      <Box sx={{ 
        p: 4, 
        textAlign: 'center', 
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Error Icon */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <AlertTriangle size={48} color="#d32f2f" />
        </Box>

        {/* Error Title */}
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            color: colors.text || '#000000',
            fontSize: '18px',
            fontFamily: contentTitleFontFamily
          }}
        >
          {isCn ? '提交失败' : 'Submission Failed'}
        </Typography>

        {/* Error Message */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: colors.text || '#000000',
            fontSize: '14px',
            lineHeight: 1.6,
            fontFamily: contentFontFamily
          }}
        >
          {errorMessage}
        </Typography>

        {/* Error Details (if available) */}
        {errorDetails && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: colors.background === '#ffffff' ? '#f5f5f5' : 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.text || '#000000',
                fontSize: '12px',
                fontFamily: contentFontFamily
              }}
            >
              {errorDetails}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: colors.text || '#000000',
              borderColor: colors.text || '#000000',
              fontSize: '13px',
              padding: '8px 20px',
              fontFamily: buttonFontFamily,
              '&:hover': {
                backgroundColor: colors.background === '#ffffff' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)',
                borderColor: colors.text || '#000000'
              }
            }}
          >
            {isCn ? '关闭' : 'Close'}
          </Button>
        </Box>
      </Box>
    </InfoModal>
  );
};

export default FormErrorModal;
