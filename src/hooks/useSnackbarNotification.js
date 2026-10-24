import { useState, useCallback } from 'react';

export const useSnackbarNotification = () => {
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const showNotification = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const hideNotification = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showNotification,
    hideNotification
  };
};