import { useState, useCallback } from 'react';

export const useFormState = () => {
  const [state, setState] = useState({
    isSubmitting: false,
    successMessage: null,
    errorMessage: null,
    showSuccessPopup: false
  });

  const setLoading = useCallback((isLoading) => {
    setState(prev => ({ ...prev, isSubmitting: isLoading }));
  }, []);

  const setSuccess = useCallback((message) => {
    setState(prev => ({ 
      ...prev, 
      successMessage: message,
      showSuccessPopup: true,
      errorMessage: null 
    }));
  }, []);

  const setError = useCallback((message) => {
    setState(prev => ({ 
      ...prev, 
      errorMessage: message,
      successMessage: null 
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, errorMessage: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      successMessage: null,
      errorMessage: null,
      showSuccessPopup: false
    });
  }, []);

  return {
    state,
    setLoading,
    setSuccess,
    setError,
    clearError,
    reset
  };
};
