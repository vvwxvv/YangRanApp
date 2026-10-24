

import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';


/** Clickable image thumbnail inside a detail field */
const InlineImage = ({ src, alt, onClick, fontStyle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      component="img"
      src={src}
      alt={alt}
      onClick={onClick}
      onError={(e) => { e.target.src = '/error.png'; }}
      loading="lazy"
      sx={{
        width: 64,
        height: 64,
        objectFit: 'cover',
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        '&:hover': { opacity: 0.8 },
      }}
    />
    <Typography
      variant="caption"
      onClick={onClick}
      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, ...fontStyle }}
    >
      Click to view
    </Typography>
  </Box>
);


export default InlineImage;