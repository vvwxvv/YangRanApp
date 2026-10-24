'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { TextField, Typography, Box, Grow, Zoom, Avatar, IconButton, Chip, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Check, X, Plus, Trash2 } from 'lucide-react';
import { getSystemLabel } from '@/components/labels/system_labels';
import { resolveFieldLabel } from '@/components/pages/manager/batch_edit/utils/fieldLabels';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function EditableCell({ 
  value, 
  onSave, 
  type = "text", 
  options = [], 
  fieldType = "string",
  renderDisplay,
  labelFontStyle = {},
  isCn = false,
  column = {}
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [arrayItems, setArrayItems] = useState([]);
  const inputRef = useRef(null);
  const isDark = useDarkMode();
  const textColor = isDark ? "var(--text-primary, #ffffff)" : "var(--text-primary, #000000)";
  const placeholderColor = isDark ? "var(--text-primary, #666666)" : "var(--text-primary, #999999)";
  const borderColor = isDark ? "var(--border-light, #ffffff)" : "var(--border-light, #000000)";
  const hoverBg = isDark ? alpha("#ffffff", 0.08) : alpha("#000000", 0.04);

  // Smart array detection
  const isArrayField = useMemo(() => {
    return Array.isArray(value) || 
           fieldType === "array" || 
           type === "array" ||
           column?.isArray === true;
  }, [value, fieldType, type, column]);

  // Smart image detection
  const isImageField = useMemo(() => {
    return column?.field === 'cover_img_url' || 
           column?.field === 'image_url' ||
           column?.field === 'avatar_url' ||
           column?.field?.includes('img') ||
           column?.field?.includes('image') ||
           type === 'image';
  }, [column, type]);

  // Initialize array items when editing starts
  useEffect(() => {
    if (isEditing && isArrayField) {
      const items = Array.isArray(value) ? value : (value ? [value] : []);
      setArrayItems(items.length > 0 ? items : ['']);
    }
  }, [isEditing, isArrayField, value]);

  // Update editValue when value changes and not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Normalize options
  const normalizedOptions = useMemo(() => {
    return options.map((opt, index) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      } else if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value !== undefined ? String(opt.value) : `option-${index}`,
          label: opt.label !== undefined ? String(opt.label) : String(opt.value || `option-${index}`)
        };
      } else {
        return { value: `option-${index}`, label: `Option ${index + 1}` };
      }
    });
  }, [options]);

  const handleSave = () => {
    if (isArrayField) {
      const cleanedArray = arrayItems.filter(item => 
        item !== null && item !== undefined && item !== ''
      );
      if (onSave) onSave(cleanedArray.length > 0 ? cleanedArray : []);
    } else {
      if (onSave && editValue !== value) {
        onSave(editValue);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isArrayField) {
      setArrayItems([]);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isArrayField) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Array management functions
  const handleArrayItemChange = (index, newValue) => {
    const newItems = [...arrayItems];
    newItems[index] = newValue;
    setArrayItems(newItems);
  };

  const handleAddArrayItem = () => {
    setArrayItems([...arrayItems, '']);
  };

  const handleRemoveArrayItem = (index) => {
    if (arrayItems.length > 1) {
      const newItems = arrayItems.filter((_, i) => i !== index);
      setArrayItems(newItems);
    }
  };

  // Render image display with responsive sizing
  const renderImageUrl = (url) => {
    if (!url) return <Typography variant="body2" sx={{ color: placeholderColor, ...labelFontStyle }}>-</Typography>;
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        width: '100%', 
        gap: 0.75,
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <Avatar
          src={url}
          variant="rounded"
          sx={{ 
            width: '100%',
            maxWidth: 120,
            height: 'auto',
            aspectRatio: '1/1',
            border: '1px solid var(--border-light, #ddd)',
            objectFit: 'cover'
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: textColor, 
            ...labelFontStyle,
            fontSize: '9px',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
            lineHeight: 1.3,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {url}
        </Typography>
      </Box>
    );
  };

  // Render array display
  const renderArrayDisplay = (arrayValue) => {
    if (!arrayValue || (Array.isArray(arrayValue) && arrayValue.length === 0)) {
      return <Typography variant="body2" sx={{ color: placeholderColor, ...labelFontStyle }}>-</Typography>;
    }
    
    const displayArray = Array.isArray(arrayValue) ? arrayValue : [arrayValue];
    
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5,
        width: '100%',
        maxWidth: '100%'
      }}>
        {displayArray.slice(0, 3).map((item, idx) => (
          <Chip
            key={idx}
            label={item || "(empty)"}
            size="small"
            sx={{
              fontSize: '9px',
              height: '22px',
              maxWidth: '100%',
              '& .MuiChip-label': {
                px: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              backgroundColor: isDark ? alpha("#ffffff", 0.1) : alpha("#000000", 0.08),
              color: textColor,
              ...labelFontStyle
            }}
          />
        ))}
        {displayArray.length > 3 && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: placeholderColor, 
              fontSize: '9px',
              fontStyle: 'italic',
              ml: 0.5
            }}
          >
            +{displayArray.length - 3} {isCn ? '更多' : 'more'}
          </Typography>
        )}
      </Box>
    );
  };

  // ── Hover hint: tells you this cell is editable, and what it is ──────────
  const fieldLabel = resolveFieldLabel(column, { getSystemLabel, isCn });
  const editHint = isCn
    ? `双击编辑 · ${fieldLabel}`
    : `Double-click to edit · ${fieldLabel}`;

  // Display Mode
  if (!isEditing) {
    return (
      <Tooltip title={editHint} placement="top" enterDelay={400} followCursor={false}>
      <Grow in={true} timeout={300}>
        <Box 
          onDoubleClick={() => setIsEditing(true)}
          sx={{ 
            cursor: "pointer",
            padding: "8px",
            borderRadius: "6px",
            minHeight: "40px",
            display: "flex",
            alignItems: (isImageField || isArrayField) ? "flex-start" : "center",
            transition: "all 0.2s ease",
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            "&:hover": {
              backgroundColor: hoverBg,
              transform: "scale(1.01)",
            }
          }}
        >
          {renderDisplay ? (
            renderDisplay(value)
          ) : isImageField ? (
            renderImageUrl(value)
          ) : isArrayField ? (
            renderArrayDisplay(value)
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                color: value ? textColor : placeholderColor, 
                ...labelFontStyle,
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                lineHeight: 1.4,
                width: '100%'
              }}
            >
              {value || "-"}
            </Typography>
          )}
        </Box>
      </Grow>
      </Tooltip>
    );
  }

  // Edit Mode - Array Field
  if (isArrayField) {
    return (
      <Zoom in={true} timeout={200}>
        <Box sx={{ 
          p: 1.5, 
          backgroundColor: isDark ? alpha("#ffffff", 0.05) : alpha("#000000", 0.02),
          borderRadius: '8px',
          border: `1px solid ${borderColor}20`,
          width: '100%',
          maxWidth: '100%'
        }}>
          {arrayItems.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 1,
                alignItems: 'center'
              }}
            >
              <TextField
                size="small"
                value={item}
                onChange={(e) => handleArrayItemChange(index, e.target.value)}
                fullWidth
                placeholder={`${isCn ? '项目' : 'Item'} ${index + 1}`}
                InputProps={{ 
                  style: {
                    ...labelFontStyle,
                    fontSize: '11px'
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: borderColor },
                    "&.Mui-focused fieldset": { borderColor: borderColor }
                  }
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveArrayItem(index)}
                disabled={arrayItems.length === 1}
                sx={{
                  color: "red",
                  opacity: arrayItems.length === 1 ? 0.3 : 1,
                  "&:hover": { 
                    backgroundColor: arrayItems.length === 1 ? 'transparent' : alpha("#ff0000", 0.1) 
                  },
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
            <IconButton
              size="small"
              onClick={handleAddArrayItem}
              sx={{
                color: borderColor,
                border: `1px solid ${borderColor}30`,
                borderRadius: '6px',
                "&:hover": { 
                  backgroundColor: hoverBg,
                  borderColor: borderColor
                },
              }}
            >
              <Plus size={16} />
            </IconButton>
            
            <Box sx={{ flex: 1 }} />
            
            <IconButton
              size="small"
              onClick={handleSave}
              sx={{
                color: "green",
                backgroundColor: alpha("#00ff00", 0.1),
                "&:hover": { backgroundColor: alpha("#00ff00", 0.2) },
              }}
            >
              <Check size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleCancel}
              sx={{
                color: "red",
                backgroundColor: alpha("#ff0000", 0.1),
                "&:hover": { backgroundColor: alpha("#ff0000", 0.2) },
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        </Box>
      </Zoom>
    );
  }

  // Edit Mode - Select Field
  if (type === "select") {
    return (
      <Zoom in={true} timeout={200}>
        <TextField
          select
          size="small"
          value={editValue || ""}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          SelectProps={{ native: true }}
          fullWidth
          autoFocus
          inputRef={inputRef}
          InputProps={{ style: labelFontStyle }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": { borderColor: borderColor },
              "&.Mui-focused fieldset": { borderColor: borderColor }
            }
          }}
        >
          <option value="">{getSystemLabel('select', isCn)}</option>
          {normalizedOptions.map((opt, index) => (
            <option key={`${opt.value}-${index}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </TextField>
      </Zoom>
    );
  }

  // Edit Mode - Regular Text/Image URL Field
  return (
    <Zoom in={true} timeout={200}>
      <TextField
        size="small"
        value={editValue || ""}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        fullWidth
        autoFocus
        inputRef={inputRef}
        type={fieldType === "number" ? "text" : "text"}
        multiline={isImageField}
        minRows={isImageField ? 2 : 1}
        maxRows={isImageField ? 4 : 1}
        InputProps={{ 
          style: {
            ...labelFontStyle,
            fontSize: '11px',
            ...(isImageField && {
              wordBreak: 'break-all',
              whiteSpace: 'normal'
            })
          }
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: borderColor },
            "&.Mui-focused fieldset": { borderColor: borderColor }
          },
          "& .MuiInputBase-input": {
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }}
      />
    </Zoom>
  );
}