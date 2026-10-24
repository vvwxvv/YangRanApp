"use client";

import React from 'react';
import { Divider } from '@mui/material';



const SectionDivider = ({ colors, marginY = 2, height = '2px' }) => (
  <Divider 
    sx={{ 
      my: marginY,
      height,
      backgroundColor: colors.text,
      border: 'none',
      width: '100%',
      opacity: 1
    }}
  />
);

export default SectionDivider;
