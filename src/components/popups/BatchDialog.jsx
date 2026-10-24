import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, Typography, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Warning as WarningIcon, Info as InfoIcon, Save as SaveIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useFont from '@/hooks/useFont';

// Filter out unwanted props before passing to motion.div
const MotionDiv = React.forwardRef(function MotionDiv(props, ref) {
  const { transitionDuration, ...rest } = props;
  return <motion.div ref={ref} {...rest} />;
});

const typeDefaults = {
  delete: {
    icon: <WarningIcon sx={{ color: "#000000", fontSize: 32 }} />,
    color: "#000000",
    bg: "#ffffff",
    border: "2px solid #000000",
  },
  save: {
    icon: <SaveIcon sx={{ color: "#000000", fontSize: 32 }} />,
    color: "#000000",
    bg: "#ffffff",
    border: "2px solid #000000",
  },
  info: {
    icon: <InfoIcon sx={{ color: "#000000", fontSize: 32 }} />,
    color: "#000000",
    bg: "#ffffff",
    border: "2px solid #000000",
  },
  warning: {
    icon: <WarningIcon sx={{ color: "#000000", fontSize: 32 }} />,
    color: "#000000",
    bg: "#ffffff",
    border: "2px solid #000000",
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  exit: {
    opacity: 0, scale: 0.9, y: -20,
    transition: { duration: 0.15 }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -90 },
  visible: {
    scale: 1, rotate: 0,
    transition: { type: "spring", stiffness: 600, damping: 20, delay: 0.1 }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { delay: 0.2, duration: 0.3 }
  }
};

const BatchDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  rowsData = [],
  type = "info",
  getLabel = (k) => k,
  labelFontStyle = {},
  renderRow,
  loading = false,
}) => {
  const defaults = typeDefaults[type] || typeDefaults.info;
  const showList = Array.isArray(rowsData) && rowsData.length > 0;

  const { style: fontStyle } = useFont(); // Changed to 12px base

  // Default row renderer if not provided
  const defaultRenderRow = (row, index) => (
    <React.Fragment key={row.id || index}>
      <ListItem sx={{ py: 1.5, px: 0 }}>
        <ListItemText
          primary={
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                fontSize: '16px !important', // Force 16px for row items
                color: '#000000',
                ...labelFontStyle, 
                ...fontStyle 
              }}
            >
              {row.title || row.id || getLabel("untitled")}
            </Typography>
          }
          secondary={
            row.type || row.year || row.venue ? (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666666', 
                  fontSize: '12px !important', // Force 12px for secondary text
                  ...labelFontStyle, 
                  ...fontStyle 
                }}
              >
                {row.type && `${getLabel("type")}: ${row.type}`}
                {row.year && ` • ${getLabel("year")}: ${row.year}`}
                {row.venue && ` • ${getLabel("venue")}: ${row.venue}`}
              </Typography>
            ) : null
          }
        />
      </ListItem>
      {index < rowsData.length - 1 && <Divider sx={{ borderColor: '#e0e0e0' }} />}
    </React.Fragment>
  );

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          PaperComponent={MotionDiv}
          PaperProps={{
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            style: {
              background: defaults.bg,
              backdropFilter: 'blur(18px)',
              border: defaults.border,
              borderRadius: '16px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)',
              overflow: 'hidden',
              position: 'relative',
              minWidth: '420px',
              maxWidth: '500px',
            }
          }}
          BackdropComponent={MotionDiv}
          BackdropProps={{
            variants: backdropVariants,
            initial: "hidden",
            animate: "visible",
            exit: "hidden",
            style: {
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: defaults.color,
              fontWeight: 600,
              fontSize: '20px !important', // Force 20px for title
              padding: '24px 24px 20px 24px',
              letterSpacing: '0.01em',
            }}
          >
            <motion.div
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}
            >
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff'
                }}
              >
                {icon || defaults.icon}
              </Box>
            </motion.div>
            <motion.span
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{ textAlign: 'center', width: '100%', fontSize: '20px' }}
            >
              {title}
            </motion.span>
          </DialogTitle>

          <DialogContent sx={{ padding: '0 24px 20px 24px', color: defaults.color }}>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <Typography
                sx={{
                  fontSize: '12px !important', // Force 12px for message
                  lineHeight: 1.6,
                  fontWeight: 400,
                  color: '#000000',
                  textAlign: 'center',
                  mb: showList ? 2 : 0,
                  ...fontStyle,
                  ...labelFontStyle, // Apply labelFontStyle last to allow override
                }}
              >
                {message}
              </Typography>
              {showList && (
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: '#ffffff',
                    borderRadius: '8px',
                    maxHeight: 300,
                    overflow: 'auto',
                    border: '2px dashed #cccccc',
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600, 
                      fontSize: '14px !important', // Force 14px for list header
                      color: '#000000',
                      ...fontStyle,
                      ...labelFontStyle, 
                    }}
                  >
                    {getLabel("selectedRecords")}: {rowsData.length} {getLabel("items")}
                  </Typography>
                  <List 
                    dense
                    sx={{
                      '& .MuiListItem-root': {
                        color: '#000000',
                      }
                    }}
                  >
                    {rowsData.map((row, index) =>
                      renderRow ? renderRow(row, index, labelFontStyle) : defaultRenderRow(row, index)
                    )}
                  </List>
                </Box>
              )}
            </motion.div>
          </DialogContent>

          <DialogActions
            sx={{
              padding: '16px 24px 24px 24px',
              gap: 2,
              justifyContent: 'center',
              background: defaults.bg,
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}
          >
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                color: '#000000',
                fontWeight: 500,
                borderRadius: '8px',
                minWidth: '120px',
                padding: '10px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px',
                ...fontStyle
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                color: '#000000',
                fontWeight: 500,
                borderRadius: '8px',
                minWidth: '120px',
                padding: '10px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px',
                ...fontStyle
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              {loading ? 'Loading...' : confirmLabel}
            </button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default BatchDialog;