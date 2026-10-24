import React from 'react';
import { useReverseTheme } from '@/hooks/useReverseTheme';
import { DeviceContext } from '@/components/contexts/DeviceContext';
import useFont from '@/hooks/useFont';

export default function DeleteDialog({
  open = false,
  onClose = () => {},
  onConfirm = () => {},
  title = "Confirm Delete",
  content = "",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false
}) {
  const { isDark, colors } = useReverseTheme();
  const { isMobile } = React.useContext(DeviceContext);
  const { contentFontFamily, contentTitleFontFamily, buttonFontFamily } = useFont();

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          paddingTop: isMobile ? 'calc(10%)' : 'calc(15%)'
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff',
            backdropFilter: 'blur(10px)',
            borderRadius: '18px',
            border: '1px solid black',
            width: isMobile ? '90vw' : '80vw',
            maxWidth: isMobile ? '450px' : '700px',
            minWidth: isMobile ? '400px' : '600px',
            maxHeight: isMobile ? '400px' : '600px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderBottom: '1px solid black',
              borderRadius: '18px 18px 0 0',
              padding: '24px 24px 16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: colors.text,
              fontFamily: contentTitleFontFamily,
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.text}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {title}
          </div>

          {/* Body */}
          <div
            style={{
              backgroundColor: '#ffffff',
              color: colors.text,
              fontFamily: contentFontFamily,
              fontSize: '1rem',
              lineHeight: 1.5,
              padding: '20px 24px',
              flex: 1
            }}
          >
            {content}
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid black',
              borderRadius: '0 0 18px 18px',
              padding: '16px 24px 24px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}
          >
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'black',
                border: '1px solid black',
                color: colors.text,
                fontFamily: buttonFontFamily,
                fontWeight: 500,
                borderRadius: '10px',
                minWidth: '100px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                borderColor: 'black',
                border: '1px solid black',
                color: colors.text,
                fontFamily: buttonFontFamily,
                fontWeight: 500,
                borderRadius: '10px',
                minWidth: '100px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ffffff';
              }}
            >
              {loading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}