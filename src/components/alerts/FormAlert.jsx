"use client";
import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { LanguageContext } from '@/components/contexts/LanguageContext';
import useFont from '@/hooks/useFont';

// CSS Styles Constants - Will be made dynamic based on theme
const createStyles = (colors, contentFontFamily) => ({
  container: {
    mb: 3,
  },
  baseAlert: {
    display: "flex",
    alignItems: "center",
    borderRadius: "8px",
    fontFamily: contentFontFamily,
    transition: 'all 0.2s ease-in-out',
    padding: "12px 16px",
    color: colors?.text || '#000000',
  },
  successAlert: {
    mb: 2,
    backgroundColor: "rgba(46, 125, 50, 0.08)",
    border: "1px solid rgba(46, 125, 50, 0.2)",
    color: colors?.text || "#000000",
    '&:hover': {
      backgroundColor: "rgba(46, 125, 50, 0.12)",
    },
  },
  errorAlert: {
    backgroundColor: "rgba(211, 47, 47, 0.08)",
    border: "1px solid rgba(211, 47, 47, 0.2)",
    color: colors?.text || "#000000",
    '&:hover': {
      backgroundColor: "rgba(211, 47, 47, 0.12)",
    },
  },
  warningAlert: {
    backgroundColor: "rgba(237, 108, 2, 0.08)",
    border: "1px solid rgba(237, 108, 2, 0.2)",
    color: colors?.text || "#000000",
    '&:hover': {
      backgroundColor: "rgba(237, 108, 2, 0.12)",
    },
  },
  infoAlert: {
    backgroundColor: "rgba(2, 136, 209, 0.08)",
    border: "1px solid rgba(2, 136, 209, 0.2)",
    color: colors?.text || "#000000",
    '&:hover': {
      backgroundColor: "rgba(2, 136, 209, 0.12)",
    },
  },
  alertTitle: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginLeft: "8px",
    color: colors?.text || '#000000',
    fontFamily: contentFontFamily,
  },
});

const CONSTANTS = {
  severityTypes: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
};

/**
 * FormAlert Component
 */
const FormAlert = ({
  successMessage,
  errorMessage,
  warningMessage,
  infoMessage,
  autoHide = false,
  autoHideDelay = 5000,
  onClose,
  showIcon = true,
  customStyles = {},
  colors,
}) => {
  const { isCn } = useContext(LanguageContext);
  const { contentFontFamily } = useFont();

  const defaultMessages = {
    success: isCn ? '操作成功完成' : 'Operation completed successfully',
    error: isCn ? '发生了错误' : 'An error occurred',
    warning: isCn ? '警告：请检查相关信息' : 'Warning: Please review',
    info: isCn ? '提示信息' : 'Information',
  };

  const [visibleAlerts, setVisibleAlerts] = React.useState({
    success: !!successMessage,
    error: !!errorMessage,
    warning: !!warningMessage,
    info: !!infoMessage,
  });

  React.useEffect(() => {
    if (!autoHide) return;

    const timers = [];

    Object.entries(visibleAlerts).forEach(([type, isVisible]) => {
      if (isVisible) {
        const timer = setTimeout(() => {
          handleClose(type);
        }, autoHideDelay);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [autoHide, autoHideDelay, visibleAlerts]);

  const handleClose = (alertType) => {
    setVisibleAlerts(prev => ({
      ...prev,
      [alertType]: false,
    }));

    if (onClose) {
      onClose(alertType);
    }
  };

  const getAlertStyles = (severity) => {
    const styles = createStyles(colors, contentFontFamily);
    const baseStyles = { ...styles.baseAlert };

    switch (severity) {
      case CONSTANTS.severityTypes.SUCCESS:
        return { ...baseStyles, ...styles.successAlert, ...customStyles.success };
      case CONSTANTS.severityTypes.ERROR:
        return { ...baseStyles, ...styles.errorAlert, ...customStyles.error };
      case CONSTANTS.severityTypes.WARNING:
        return { ...baseStyles, ...styles.warningAlert, ...customStyles.warning };
      case CONSTANTS.severityTypes.INFO:
        return { ...baseStyles, ...styles.infoAlert, ...customStyles.info };
      default:
        return baseStyles;
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case CONSTANTS.severityTypes.SUCCESS:
        return <CheckCircle size={20} />;
      case CONSTANTS.severityTypes.ERROR:
        return <AlertCircle size={20} />;
      case CONSTANTS.severityTypes.WARNING:
        return <AlertTriangle size={20} />;
      case CONSTANTS.severityTypes.INFO:
        return <Info size={20} />;
      default:
        return null;
    }
  };

  const renderAlert = (messageProp, severity, isVisible) => {
    if (!isVisible) return null;

    const message = messageProp || defaultMessages[severity];

    return (
      <Box
        sx={getAlertStyles(severity)}
        role="alert"
        aria-live="polite"
      >
        {showIcon && getIcon(severity)}
        <Typography sx={{ ...createStyles(colors, contentFontFamily).alertTitle, ...customStyles.title }}>
          {message}
        </Typography>
      </Box>
    );
  };

  const hasVisibleAlerts = Object.values(visibleAlerts).some(Boolean) &&
    (successMessage || errorMessage || warningMessage || infoMessage);

  if (!hasVisibleAlerts) return null;

  return (
    <Box sx={{ ...createStyles(colors).container, ...customStyles.container }} role="region" aria-label="Form alerts">
      {renderAlert(successMessage, CONSTANTS.severityTypes.SUCCESS, visibleAlerts.success)}
      {renderAlert(errorMessage, CONSTANTS.severityTypes.ERROR, visibleAlerts.error)}
      {renderAlert(warningMessage, CONSTANTS.severityTypes.WARNING, visibleAlerts.warning)}
      {renderAlert(infoMessage, CONSTANTS.severityTypes.INFO, visibleAlerts.info)}
    </Box>
  );
};

export default FormAlert;
