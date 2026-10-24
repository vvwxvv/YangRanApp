import React, { useState, useEffect} from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';
import useFont from '@/hooks/useFont';

/**
 * RelationSelector - Select multiple related items from a collection
 *
 * @param {string} name - Field name (e.g., 'relatedImages')
 * @param {string} label - Field label
 * @param {object} control - React Hook Form control
 * @param {boolean} disabled - Disable the selector
 * @param {object} colors - Color theme
 * @param {string} collectionType - Type of collection ('image', 'video', 'web', 'writing', 'event')
 * @param {function} onChange - Change handler
 */
const RelationSelector = ({
  name,
  label,
  control,
  disabled = false,
  colors = {},
  collectionType,
  onChange,
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { style: labelFontStyle, inputFontFamily, labelFontFamily } = useFont();

  // Fetch available items from API
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/${collectionType}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${collectionType}`);
        }

        const data = await response.json();

        // Transform data to options format
        const items = Array.isArray(data.data) ? data.data : [];
        const formattedOptions = items.map(item => ({
          id: item.id || item._id,
          label: getItemLabel(item, collectionType),
          item: item,
        }));

        setOptions(formattedOptions);
      } catch (err) {
        console.log(`Error fetching ${collectionType}s:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [collectionType]);

  // Get display label for an item based on collection type
  const getItemLabel = (item, type) => {
    switch (type) {
      case 'web':
        return item.tag_en || item.tag_cn || item.web_url || `Web ${item.id?.slice(-6)}`;
      default:
        return item.id?.slice(-6) || 'Unknown';
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        // Convert IDs to options - ensure uniqueness
        const selectedOptions = options.filter(opt =>
          field.value?.includes(opt.id)
        );

        // Filter options based on search term
        const filteredOptions = options.filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const handleRemove = (optionId) => {
          const newValue = field.value.filter(id => id !== optionId);
          field.onChange(newValue);
          onChange?.();
        };

        const handleToggle = (optionId) => {
          const isSelected = field.value?.includes(optionId);
          const newValue = isSelected
            ? field.value.filter(id => id !== optionId)
            : [...(field.value || []), optionId];
          field.onChange(newValue);
          onChange?.();
        };

        return (
          <div
            className="mb-4"
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <label
              className="form-label"
              style={{
                color: colors?.text || '#2c2c2c',
                fontFamily: labelFontFamily,
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {label}
            </label>

            {error && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#dc2626',
                  marginBottom: '8px',
                }}
              >
                {error}
              </div>
            )}

            {/* Selected items as chips */}
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedOptions.map((option) => (
                  <div
                    key={option.id}
                    style={{
                      backgroundColor: colors.chipBackground || '#e5e7eb',
                      color: colors.chipText || '#1f2937',
                      fontFamily: inputFontFamily,
                      fontSize: '13px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{option.label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(option.id)}
                      disabled={disabled}
                      className="hover:opacity-70 transition-opacity"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown */}
            <div className="relative">
              <div
                onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                style={{
                  backgroundColor: colors.background || '#fff',
                  borderColor: colors?.border || '#d9d9d9',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: disabled || loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: inputFontFamily,
                  fontSize: '13px',
                  color: colors?.text || '#2c2c2c',
                }}
              >
                <input
                  type="text"
                  placeholder={`Select ${label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                  disabled={disabled || loading}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    flex: 1,
                    fontFamily: inputFontFamily,
                    fontSize: '13px',
                    color: colors?.text || '#2c2c2c',
                  }}
                />
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>

              {/* Dropdown menu */}
              {isOpen && !loading && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: colors.background || '#fff',
                    borderColor: colors?.border || '#d9d9d9',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: '8px',
                    maxHeight: '240px',
                    overflowY: 'auto',
                    zIndex: 50,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {filteredOptions.length === 0 ? (
                    <div
                      style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: colors.secondaryText || '#6b7280',
                        fontFamily: inputFontFamily,
                      }}
                    >
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option) => {
                      const isSelected = field.value?.includes(option.id);
                      return (
                        <div
                          key={option.id}
                          onClick={() => handleToggle(option.id)}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            backgroundColor: isSelected
                              ? colors.chipBackground || '#e5e7eb'
                              : 'transparent',
                            fontFamily: inputFontFamily,
                            fontSize: '13px',
                            color: colors?.text || '#2c2c2c',
                          }}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ marginRight: '8px' }}
                          />
                          {option.label}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Show count */}
            {field.value?.length > 0 && (
              <div
                style={{
                  fontSize: '12px',
                  color: colors.secondaryText || '#6b7280',
                  marginTop: '4px',
                  fontFamily: labelFontFamily,
                }}
              >
                {field.value.length} {field.value.length === 1 ? 'item' : 'items'} selected
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default RelationSelector;