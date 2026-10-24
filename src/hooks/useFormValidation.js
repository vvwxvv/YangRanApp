
import { useCallback, useRef } from 'react';

// Debounce applied before a field is validated (ms).
const VALIDATION_DEBOUNCE_MS = 300;

export function useFormValidation(schema, getLabel) {
  const validationTimeoutRef = useRef();

  const validateField = useCallback((fieldName, value, rules = {}) => {
    // Clear previous validation timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    return new Promise((resolve) => {
      validationTimeoutRef.current = setTimeout(() => {
        try {
          // Custom validation logic here
          const errors = [];

          // Required validation
          if (rules.required && (!value || value.toString().trim() === '')) {
            errors.push(`${getLabel(fieldName)} ${getLabel('isRequired')}`);
          }

          // Length validation
          if (value && rules.minLength && value.toString().length < rules.minLength) {
            errors.push(`${getLabel(fieldName)} ${getLabel('mustBeAtLeast')} ${rules.minLength} ${getLabel('characters')}`);
          }

          if (value && rules.maxLength && value.toString().length > rules.maxLength) {
            errors.push(`${getLabel(fieldName)} ${getLabel('mustBeAtMost')} ${rules.maxLength} ${getLabel('characters')}`);
          }

          // Email validation
          if (value && rules.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            errors.push(getLabel('invalidEmail'));
          }

          resolve(errors.length > 0 ? errors[0] : null);
        } catch (error) {
          resolve(`${getLabel('validationError')}: ${error.message}`);
        }
      }, VALIDATION_DEBOUNCE_MS);
    });
  }, [getLabel]);

  const validateForm = useCallback(async (formData, validationRules) => {
    const errors = {};

    for (const [fieldName, value] of Object.entries(formData)) {
      const rules = validationRules[fieldName];
      if (rules) {
        const error = await validateField(fieldName, value, rules);
        if (error) {
          errors[fieldName] = error;
        }
      }
    }

    return errors;
  }, [validateField]);

  return {
    validateField,
    validateForm,
  };
}
