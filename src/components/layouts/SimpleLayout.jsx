import React from 'react';

const SimpleLayout = ({ 
  children, 
  headerContent, 
  actionButtons, 
  filterPanel, 
  mainContent,
  footerContent,
  themeStyles = {},
  className = ""
}) => {
  const defaultThemeStyles = {
    PAGE_CONTAINER: {
      padding: '16px',
      minHeight: '100vh',
      boxSizing: 'border-box',
      marginTop: '270px',
    },
    CONTAINER: {
      paddingLeft: '0px',
      paddingRight: '0px',
      width: '100%',
    },
    DIVIDER: {
      width: '100%',
      borderBottom: '2px solid var(--text-primary, #000000)',
      marginBottom: '1.5rem',
    },
    ...themeStyles
  };

  return (
    <div 
      className={className}
      style={{
        ...defaultThemeStyles.PAGE_CONTAINER,
        backgroundColor: 'var(--background-primary, #ffffff)',
        color: 'var(--text-primary, #000000)',
      }}
    >
      <div style={defaultThemeStyles.CONTAINER}>
        {/* Header Section */}
        {headerContent && (
          <>
            <div className="flex justify-between items-end mb-4 px-4" style={{ marginTop: '-230px' }}>
              {headerContent}
            </div>
            <div style={defaultThemeStyles.DIVIDER} />
          </>
        )}

        {/* Action Buttons Section */}
        {actionButtons && (
          <div className="px-4">
            {actionButtons}
          </div>
        )}

        {/* Filter Panel Section */}
        {filterPanel && (
          <>
            {filterPanel}
          </>
        )}

        {/* Main Content Section */}
        {mainContent && (
          <div className="px-4">
            {mainContent}
          </div>
        )}

        {/* Footer Section */}
        {footerContent && (
          <>
            {footerContent}
          </>
        )}

        {/* Additional Children */}
        {children}
      </div>
    </div>
  );
};

export default SimpleLayout;
