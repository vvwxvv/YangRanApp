"use client";
import React, { useContext } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import useFont from '@/hooks/useFont';
import { LanguageContext } from '@/components/contexts/LanguageContext';

// CSS Styles Constants
const STYLES = {
  container: {
    pt: 2,
  },
  
  description: {
    color: 'text.secondary',
    mb: 2,
  },
  
  fieldRow: {
    direction: 'row',
    spacing: 1,
    alignItems: 'flex-start',
  },
  
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  },
  
  removeButton: {
    mt: 1.5,
    backgroundColor: 'rgba(211, 47, 47, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.12)',
    },
    '&:disabled': {
      backgroundColor: 'rgba(211, 47, 47, 0.02)',
      opacity: 0.6,
    },
  },
  
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: '8px',
    borderColor: 'rgba(0, 0, 0, 0.23)',
    color: '#333',
    textTransform: 'none',
    fontWeight: 500,
    px: 3,
    py: 1.5,
    '&:hover': {
      borderColor: '#111',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&:disabled': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      color: 'rgba(0, 0, 0, 0.26)',
      backgroundColor: 'transparent',
    },
  },
};

// Component Constants
const CONSTANTS = {
  iconSizes: {
    plus: 18,
    trash: 20,
  },
  spacing: {
    container: 3,
    fieldRow: 1,
  },
};

// Default Labels
const DEFAULT_LABELS = {
  description: "Description",
  removeDescriptionButton: "Remove",
  addDescriptionButton: "Add Description",
};

// Import system labels
import { getSystemLabel } from '@/components/labels/system_labels';

/**
 * DescriptionManager Component
 * Manages dynamic descriptions with add/remove functionality
 * 
 * @param {Array} fields - Array of field objects from react-hook-form
 * @param {Function} append - Function to add new field
 * @param {Function} remove - Function to remove field
 * @param {Function} register - react-hook-form register function
 * @param {Object} errors - Form validation errors
 * @param {Function} getLabel - Function to get localized labels
 * @param {boolean} isSubmitting - Form submission state
 * @param {string} fieldName - The name of the field group
 */
const DescriptionManager = ({
  fields = [],
  append,
  remove,
  register,
  errors = {},
  getLabel = (key) => getSystemLabel(key, isCn),
  isSubmitting = false,
  fieldName = 'descriptions',
  isCn: isCnProp,
}) => {
  const context = useContext(LanguageContext);
  const isCn = typeof isCnProp === 'boolean' ? isCnProp : context?.isCn;
  const { style: fontStyle, inputFontFamily } = useFont();

  if (!append || !remove || !register) {
    console.log('DescriptionManager: Missing required props (append, remove, register)');
    return null;
  }

  const handleAddDescription = () => {
    if (!isSubmitting) {
      append({ en: '', cn: '' });
    }
  };

  const handleRemoveDescription = (index) => {
    if (!isSubmitting && fields.length > 0) {
      remove(index);
    }
  };

  const getFieldError = (index) => {
    return errors?.[fieldName]?.[index]?.[isCn ? 'CN':'EN'];
  };

  return (
    <Stack spacing={CONSTANTS.spacing.container} sx={STYLES.container}>
      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction={STYLES.fieldRow.direction}
          spacing={STYLES.fieldRow.spacing}
          alignItems={STYLES.fieldRow.alignItems}
        >
          <TextField
            id={`${fieldName}-${isCn ? 'CN':'EN'}-${index}`}
            label={getLabel(fieldName === 'paragraphs' ? 'paragraph' : 'description') + ` #${index + 1}`}
            {...register(`${fieldName}.${index}.${isCn ? 'CN':'EN'}`)}
            fullWidth
            multiline
            rows={3}
            error={!!getFieldError(index)}
            helperText={getFieldError(index)?.message}
            disabled={isSubmitting}
            InputLabelProps={{ shrink: true, style: { ...fontStyle, fontFamily: inputFontFamily } }}
            InputProps={{ style: { ...fontStyle, fontFamily: inputFontFamily } }}
            sx={{ ...STYLES.textField, fontFamily: inputFontFamily }}
            variant="outlined"
            size="medium"
          />
          <IconButton
            onClick={() => handleRemoveDescription(index)}
            disabled={isSubmitting}
            color="error"
            aria-label={getLabel("removeDescriptionButton") + ` ${index + 1}`}
            sx={STYLES.removeButton}
            size="medium"
          >
            <Trash2 size={CONSTANTS.iconSizes.trash} />
          </IconButton>
        </Stack>
      ))}
      <Button
        type="button"
        onClick={handleAddDescription}
        disabled={isSubmitting}
        variant="outlined"
        fullWidth
        startIcon={<PlusCircle size={CONSTANTS.iconSizes.plus} />}
        sx={STYLES.addButton}
      >
        {getLabel("addDescriptionButton") || DEFAULT_LABELS.addDescriptionButton}
      </Button>
    </Stack>
  );
};

export default DescriptionManager; 