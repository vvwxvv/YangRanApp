import React from "react";
import { Edit, Trash2 } from 'lucide-react';
import { Box, Grid, Divider, IconButton } from '@mui/material';

const TwoColumnLayout = ({ 
  isManagerMode = false, 
  onEdit, 
  onDelete,
  leftContent,
  rightContent
}) => {
  if (!leftContent && !rightContent) return null;

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        borderRadius: isManagerMode ? '10px' : 0,
        backgroundColor: isManagerMode ? '#fff' : 'transparent',
        overflow: isManagerMode ? 'hidden' : 'visible',
        mx: isManagerMode ? '10px' : 0,
        p: isManagerMode ? '20px' : 0,
        '&:hover': isManagerMode ? {
          boxShadow: 6,
          border: '2px solid black',
        } : {},
        transition: 'all 0.3s',
      }}
    >
      {/* Manager Mode Action Buttons */}
      {isManagerMode && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
            zIndex: 1000,
          }}
        >
          {onEdit && (
            <IconButton
              aria-label="Edit item"
              onClick={onEdit}
              sx={{
                p: 1.5,
                bgcolor: 'white',
                border: '1px solid black',
                '&:hover': { bgcolor: 'black', color: 'white' },
              }}
            >
              <Edit size={20} />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              aria-label="Delete item"
              onClick={onDelete}
              sx={{
                p: 1.5,
                bgcolor: 'white',
                border: '1px solid black',
                '&:hover': { bgcolor: 'black', color: 'white' },
              }}
            >
              <Trash2 size={20} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Two Column Grid */}
      <Grid
        container
        spacing={0}
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          alignItems: 'flex-start', /* align top */
        }}
      >
        {/* Left Column */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            pr: { xs: 0, md: '20px' },
            pb: { xs: '20px', md: 0 },
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {leftContent}
        </Grid>

        {/* Separator */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: 'none', md: 'block' },
            borderColor: '#111',
            borderRightWidth: 1,
            alignSelf: 'stretch',
            mx: 0,
          }}
        />

        {/* Mobile horizontal divider */}
        <Grid
          item
          xs={12}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <Divider sx={{ borderColor: '#111', my: '10px' }} />
        </Grid>

        {/* Right Column */}
        <Grid
          item
          xs={12}
          md
          sx={{
            pl: { xs: 0, md: '20px' },
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {rightContent}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TwoColumnLayout;