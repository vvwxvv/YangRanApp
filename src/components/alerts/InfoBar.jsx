import React from 'react';
import { Alert } from '@mui/material';

const InfoBar = ({ 
  message, 
  isCn = false, 
  labelFontStyle = {}, 
  sx = {} 
}) => {
  return (
    <Alert 
      severity="info" 
      sx={{ 
        borderRadius: 2, 
        ...labelFontStyle,
        backgroundColor: 'transparent',
        color: '#000',
        border: '1px solid #000',
        '& .MuiAlert-icon': {
          color: '#000'
        },
        ...sx
      }}
    >
      {message}
    </Alert>
  );
};

export default InfoBar;
