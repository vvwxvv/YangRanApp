import React, { forwardRef } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import useFont from '@/hooks/useFont';
import { useReverseTheme } from '@/hooks/useReverseTheme';

// Utility to filter out unwanted props
function filterDialogProps(props) {
  const { transitionDuration, DialogComponent, ...rest } = props;
  return rest;
}

// Custom transition components
const MotionDiv = React.forwardRef(function MotionDiv(props, ref) {
  const { transitionDuration, ...rest } = props;
  return <motion.div ref={ref} {...rest} />;
});

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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
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

export default function BatchEditDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  icon,
  dialogType = "info",
  content,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  isLoading = false,
  loadingId,
  itemId,
  children,
  maxWidth = "sm",
  fullWidth = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  confirmIcon,
  rowsData = [],
  getLabel = (k) => k,
  labelFontStyle = {},
  renderRow,
  ...props
}) {
  const { style: fontStyle, contentFontFamily, buttonFontFamily } = useFont();
  const { isDark } = useReverseTheme();
  
  const showLoading = isLoading || (loadingId && loadingId === itemId);
  const showList = Array.isArray(rowsData) && rowsData.length > 0;

  const defaultRenderRow = (row, index) => (
    <React.Fragment key={row.id || index}>
      <ListItem sx={{ py: 1.5, px: 0 }}>
        <ListItemText
          primary={
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                fontSize: '16px',
                color: '#000000',
                ...labelFontStyle,
                ...fontStyle,
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
                  fontSize: '12px',
                  ...labelFontStyle,
                  ...fontStyle,
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
    <AnimatePresence mode="wait">
      {open && (
        <Dialog
          open={open}
          onClose={(event, reason) => {
            if (reason === 'backdropClick' && disableBackdropClick) {
              return;
            }
            if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
              return;
            }
            onClose(event);
          }}
          PaperComponent={MotionDiv}
          PaperProps={{
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            style: {
              background: '#ffffff',
              backdropFilter: 'blur(18px)',
              border: '2px solid #000000',
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
            exit: "exit",
            style: {
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            }
          }}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          {...filterDialogProps(props)}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: 600,
              fontSize: '20px',
              fontFamily: contentFontFamily,
              padding: '24px 24px 20px 24px',
              letterSpacing: '0.01em',
              ...fontStyle
            }}
          >
            {icon && (
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
                  {icon}
                </Box>
              </motion.div>
            )}
            <motion.span
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              style={{ textAlign: 'center', width: '100%' }}
            >
              {title}
            </motion.span>
          </DialogTitle>

          <DialogContent sx={{ 
            padding: '0 24px 20px 24px',
            color: '#000000',
            fontFamily: contentFontFamily,
          }}>
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <Box 
                sx={{ 
                  fontSize: '12px',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  color: '#000000',
                  textAlign: 'center',
                  mb: showList ? 2 : 0,
                  ...fontStyle
                }}
              >
                {content}
                {children}
              </Box>
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
                      fontSize: '14px',
                      color: '#000000',
                      ...labelFontStyle,
                      ...fontStyle
                    }}
                  >
                    {getLabel("itemsToSave") || getLabel("selectedRecords")}: {rowsData.length} {getLabel("items")}
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
              background: '#ffffff',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px'
            }}
          >
            <button
              onClick={onClose}
              disabled={showLoading}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                color: '#000000',
                fontFamily: buttonFontFamily,
                fontWeight: 500,
                borderRadius: '8px',
                minWidth: '120px',
                padding: '10px 24px',
                cursor: showLoading ? 'not-allowed' : 'pointer',
                opacity: showLoading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px',
                ...fontStyle
              }}
              onMouseEnter={(e) => {
                if (!showLoading) {
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
              disabled={showLoading}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #000000',
                color: '#000000',
                fontFamily: buttonFontFamily,
                fontWeight: 500,
                borderRadius: '8px',
                minWidth: '120px',
                padding: '10px 24px',
                cursor: showLoading ? 'not-allowed' : 'pointer',
                opacity: showLoading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                ...fontStyle
              }}
              onMouseEnter={(e) => {
                if (!showLoading) {
                  e.target.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              {showLoading ? (
                <CircularProgress 
                  size={20} 
                  sx={{ color: '#000000', opacity: 0.8 }} 
                />
              ) : (
                <>
                  {confirmIcon && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {confirmIcon}
                    </Box>
                  )}
                  {confirmLabel}
                </>
              )}
            </button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}