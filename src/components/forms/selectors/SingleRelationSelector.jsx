import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react';

/**
 * Single relation selector with data fetching
 * For Image model's singular relation fields (artworkId, writingId, eventId)
 * 
 * @param {string} label - Field label
 * @param {string} value - Currently selected ID
 * @param {function} onChange - Change handler (receives id)
 * @param {function} onClear - Clear handler
 * @param {string} collectionType - Type of collection to fetch (artwork, writing, event)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Disable the selector
 * @param {object} colors - Color theme
 * @param {string} fontFamily - Font family for input
 * @param {boolean} showChip - Show selected item as chip above input
 */
const SingleRelationSelector = ({
  label,
  value,
  onChange,
  onClear,
  collectionType,
  placeholder = 'Select an option...',
  disabled = false,
  colors = {},
  fontFamily = 'inherit',
  showChip = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch options based on collectionType
  useEffect(() => {
    const fetchOptions = async () => {
      if (!collectionType) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`/api/${collectionType}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${collectionType}: ${response.statusText}`);
        }
  
        const responseData = await response.json();
  
        // Extract the array from the `data` property
        const data = responseData.data;
  
        // Ensure data is an array before mapping
        if (Array.isArray(data)) {
          const transformedOptions = data.map((item) => ({
            id: item.id,
            label: item.title || item.name || item.artist || `${collectionType} ${item.id}`,
          }));
          setOptions(transformedOptions);
        } else {
          throw new Error(`Unexpected response format: ${JSON.stringify(responseData)}`);
        }
      } catch (err) {
        console.log(`Error fetching ${collectionType}:`, err);
        setError(err.message);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOptions();
  }, [collectionType]);

  // Find the selected option
  const selectedOption = options.find(opt => opt.id === value);

  // Filter options based on search term
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionId) => {
    onChange?.(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearClick = () => {
    onClear?.();
    setSearchTerm('');
  };

  return (
    <div onTouchEnd={(e) => e.stopPropagation()}>
      {/* Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: 500,
            color: colors.text || '#2c2c2c',
            fontFamily: fontFamily,
          }}
        >
          {label}
        </label>
      )}

      {/* Selected item chip */}
      {showChip && selectedOption && (
        <div className="mb-2">
          <div
            style={{
              backgroundColor: colors.chipBackground || '#e5e7eb',
              color: colors.chipText || '#1f2937',
              fontFamily: fontFamily,
              fontSize: '13px',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{selectedOption.label}</span>
            <button
              type="button"
              onClick={handleClearClick}
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
            fontFamily: fontFamily,
            fontSize: '13px',
            color: colors?.text || '#2c2c2c',
          }}
        >
          <input
            type="text"
            placeholder={selectedOption ? selectedOption.label : placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => !loading && setIsOpen(true)}
            disabled={disabled || loading}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              flex: 1,
              fontFamily: fontFamily,
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

        {/* Error message */}
        {error && (
          <div
            style={{
              marginTop: '4px',
              fontSize: '12px',
              color: '#dc2626',
              fontFamily: fontFamily,
            }}
          >
            {error}
          </div>
        )}

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
                  fontFamily: fontFamily,
                }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? colors.chipBackground || '#e5e7eb'
                        : 'transparent',
                      fontFamily: fontFamily,
                      fontSize: '13px',
                      color: colors?.text || '#2c2c2c',
                    }}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRelationSelector;