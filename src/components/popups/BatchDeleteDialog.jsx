import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Box, Alert, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/Warning";
import { useReverseTheme } from '@/hooks/useReverseTheme';

const BatchDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  selectedRowsData = [],
  getLabel = (k) => k,
  labelFontStyle = {},
  renderRow,
}) => {
  const { isDark } = useReverseTheme();
  // Default row renderer if not provided
  const defaultRenderRow = (row, index) => (
    <React.Fragment key={row.id || index}>
      <ListItem>
        <ListItemText
          primary={
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500, 
                ...labelFontStyle,
                color: isDark ? '#ffffff' : '#000000'
              }}
            >
              {row.title || getLabel("untitled")} - {row.type || getLabel("unknown")}
            </Typography>
          }
        />
      </ListItem>
      {index < selectedRowsData.length - 1 && <Divider sx={{ 
        borderColor: isDark ? '#444' : '#e0e0e0' 
      }} />}
    </React.Fragment>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        color: isDark ? '#ffffff' : '#000000'
      }}>
        {icon || <WarningIcon sx={{ color: '#d32f2f', fontSize: 28 }} />}
        {title}
      </DialogTitle>
      <DialogContent>
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 2,
            borderRadius: "8px",
            backgroundColor: isDark ? alpha("#ff9800", 0.2) : alpha("#ff9800", 0.1),
            color: isDark ? '#ffffff' : '#000000',
            "& .MuiAlert-icon": {
              color: "#ff9800",
            },
            "& .MuiAlert-message": {
              color: isDark ? '#ffffff' : '#000000',
            },
          }}
        >
          {getLabel("deleteWarning")}
        </Alert>
        <Typography 
          variant="body1" 
          gutterBottom 
          sx={{ 
            mb: 2, 
            ...labelFontStyle,
            color: isDark ? '#ffffff' : '#000000'
          }}
        >
          {message || getLabel("confirmDeleteMessage")}
        </Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: isDark ? '#2a2a2a' : '#f5f5f5',
            borderRadius: "8px",
            maxHeight: 300,
            overflow: "auto",
            border: `1px solid ${isDark ? '#444' : '#e0e0e0'}`,
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              ...labelFontStyle,
              color: isDark ? '#ffffff' : '#000000'
            }}
          >
            {getLabel("selectedRecords")}: {selectedRowsData.length} {getLabel("recordsToDelete")}
          </Typography>
          <List 
            dense
            sx={{
              '& .MuiListItem-root': {
                color: isDark ? '#ffffff' : '#000000',
              }
            }}
          >
            {selectedRowsData.map((row, index) =>
              renderRow ? renderRow(row, index, labelFontStyle) : defaultRenderRow(row, index)
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            color: isDark ? '#ffffff' : '#000000',
            borderColor: isDark ? '#ffffff' : '#000000',
            '&:hover': {
              borderColor: isDark ? '#ffffff' : '#000000',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          sx={{
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#c62828',
            }
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchDeleteDialog; 