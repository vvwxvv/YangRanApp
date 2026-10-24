import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography,
  Box,
  Divider
} from '@mui/material';

export const TagFilterSectionDrawer = ({
  selectedTag,
  setSelectedTag,
  tagOptions,
  labels,
  isCn
}) => {
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const handleClearFilter = () => {
    setSelectedTag(null);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: '2px solid #000',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#000',
            mb: 2,
            fontSize: '1.1rem'
          }}
        >
          {labels.tagLabel}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 2,
            fontSize: '0.9rem'
          }}
        >
          {labels.instruction}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#000', height: 2 }} />

      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleClearFilter}
            selected={!selectedTag}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#f0f0f0',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              },
            }}
          >
            <ListItemText
              primary={labels.all}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: !selectedTag ? 600 : 400,
                  color: '#000',
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        {tagOptions.map((tag) => (
          <ListItem key={tag} disablePadding>
            <ListItemButton
              onClick={() => handleTagSelect(tag)}
              selected={selectedTag === tag}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#f0f0f0',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                },
              }}
            >
              <ListItemText
                primary={tag}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: selectedTag === tag ? 600 : 400,
                    color: '#000',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}; 