import { useCallback } from 'react';

/**
 * Flatten react-hook-form / zod error objects into human-readable strings
 * like "email: Invalid email" or "social_media[0].url: Invalid URL".
 */
function flattenFieldErrors(errors, prefix = '') {
  const messages = [];
  if (!errors) return messages;
  if (Array.isArray(errors)) {
    errors.forEach((item, i) => {
      messages.push(...flattenFieldErrors(item, `${prefix}[${i}]`));
    });
    return messages;
  }
  Object.entries(errors).forEach(([key, value]) => {
    if (!value) return;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && typeof value.message === 'string' && value.message) {
      messages.push(`${fullKey}: ${value.message}`);
    } else if (typeof value === 'object') {
      messages.push(...flattenFieldErrors(value, fullKey));
    }
  });
  return messages;
}

export const useFormSubmission = (form, formState, getLabel, config) => {
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      formState.setLoading(true);
      formState.clearError();

      // Get form data and ensure array fields are properly captured
      const formData = form.getValues();
      
      // Check if form is ready
      if (!formData || Object.keys(formData).length === 0) {
        console.log('useFormSubmission - Form data is empty, form not ready');
        formState.setError('Form is not ready. Please wait and try again.');
        return;
      }
      
      // Ensure array fields are properly handled
      if (config.fields && config.fields.arrayFields) {
        config.fields.arrayFields.forEach(fieldName => {
          if (formData[fieldName] && Array.isArray(formData[fieldName])) {
            // Keep plain objects (JSON object arrays, e.g. related_artwork)
            // untouched — never String() them into "[object Object]".
            formData[fieldName] = formData[fieldName]
              .filter(item => item !== null && item !== undefined &&
                (typeof item === 'object' || String(item).trim() !== ''))
              .map(item => (item !== null && typeof item === 'object' ? item : String(item)));
          } else {
            formData[fieldName] = [];
          }
        });
      }
      
      // Ensure all fields are properly sanitized - remove undefined values
      Object.keys(formData).forEach(key => {
        if (formData[key] === undefined) {
          formData[key] = '';
        }
        if (formData[key] === null) {
          formData[key] = '';
        }
        // `order` may be a JSON object (per-page positions on Artwork / Image) —
        // pass objects through untouched; only coerce scalar values.
        if (key === 'order') {
          const orderValue = formData[key];
          if (orderValue === undefined || orderValue === null) {
            formData[key] = '';
          } else if (typeof orderValue !== 'object') {
            formData[key] = String(orderValue);
          }
          // objects (JSON order) fall through unchanged
        }
        // Ensure all string fields are properly handled
        if (typeof formData[key] === 'string') {
          formData[key] = formData[key] || '';
        }
      });
      
      console.log('useFormSubmission - Sanitized form data:', formData);
      
      // Let the form's schema handle validation - don't hardcode field requirements
      // Each form type (artwork, image, event, etc.) has its own schema with its own required fields
      
      const isValid = await form.trigger();

      if (!isValid) {
        console.warn('[useFormSubmission] Validation failed:', form.formState.errors);
        const details = flattenFieldErrors(form.formState.errors);
        formState.setError(
          details.length
            ? `Please fix: ${details.join(' | ')}`
            : getLabel("formErrorsMessage")
        );
        return;
      }

      const response = await fetch(config.api.endpoints.create, {
        method: config.api.methods.create,
        headers: config.api.headers,
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        formState.setSuccess(getLabel("successMessage"));
        
        // Preserve current language when resetting form
        const currentLanguage = form.getValues('language');
        form.reset();
        form.setValue('language', currentLanguage);
        
        // Redirect after delay
        setTimeout(() => {
          window.location.href = `/manager/${config.itemUrl}`;
        }, 1500);
      } else {
        console.log('[useFormSubmission] Server rejected submission:', result);
        formState.setError(result.message || getLabel("errorMessage"));
      }
    } catch (error) {
      console.log('[useFormSubmission] Submit threw:', error);
      formState.setError(getLabel("submissionErrorMessage"));
    } finally {
      formState.setLoading(false);
    }
  }, [form, formState, getLabel, config]);

  return {
    handleSubmit,
    isSubmitting: formState.state.isSubmitting
  };
};
