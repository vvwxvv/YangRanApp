import React, { useCallback } from 'react';

/**
 * FieldRenderer Component
 * Reusable component for rendering field data with labels and custom rendering functions
 */
const FieldRenderer = ({
  fields = [],
  context = '',
  showLabels = true,
  item = {},
  createUniqueKey,
  renderLabel,
  renderFieldValue
}) => {
  const FieldRendererContent = useCallback(() => (
    <>
      {fields.map((field, index) => {
        const { key, label, render } = field;
        const uniqueKey = createUniqueKey(field, index, context);
        const value = item[key];
        
        if (!value && value !== 0) return null;

        return (
          <div
            key={uniqueKey}
            className={`text-xs text-black dark:text-white mb-1 ${
              key === 'type' ? 'mt-1' : ''
            }`}
            style={key === 'type' ? { marginTop: 5 } : {}}
          >
            {showLabels ? (
              <>
                <span className="font-medium text-black dark:text-white">
                  {renderLabel(label)}:
                </span>{' '}
                <span className="text-black dark:text-white">
                  {render ? render(value, item) : value}
                </span>
              </>
            ) : (
              <span className="text-black dark:text-white">
                {render ? render(value, item) : value}
              </span>
            )}
          </div>
        );
      })}
    </>
  ), [fields, context, showLabels, item, createUniqueKey, renderLabel]);

  return <FieldRendererContent />;
};

export default FieldRenderer;
