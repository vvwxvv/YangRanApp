
import useFont from '@/hooks/useFont';
/**
 * useButtonStyle - Custom hook to get style objects and unique framer-motion hover effects for different button types
 * @returns {object} { submitButtonStyle, ..., submitButtonHover, ..., navOpenButtonStyle, navOpenButtonHover, navCloseButtonStyle, navCloseButtonHover }
 */
export default function useButtonStyle() {

  const { buttonFontFamily } = useFont();

  // You can use context if you want to make styles language/theme aware
  // const { isCn } = useContext(LanguageContext);

  // Define your button styles here
  // Submit Button: Black, bold, modern
  const submitButtonStyle = {
    backgroundColor: '#111',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    padding: '12px 28px',
    border: 'none',
    backdropFilter: 'blur(6px)',
    fontFamily: buttonFontFamily,
  };
  const submitButtonHover = {
    scale: 1.08,
    backgroundColor: '#222',
    boxShadow: '0px 4px 24px #888',
    filter: 'blur(1.5px)',
    transition: { duration: 0.18, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // Confirm Button: Dark gray, bold
  const confirmButtonStyle = {
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    padding: '12px 28px',
    border: 'none',
    backdropFilter: 'blur(6px)',
    fontFamily: buttonFontFamily,
  };
  const confirmButtonHover = {
    scale: 1.08,
    backgroundColor: '#333',
    boxShadow: '0px 4px 24px #888',
    filter: 'blur(1.5px)',
    transition: { duration: 0.18, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // Back Button: Light gray, less bold
  const backButtonStyle = {
    backgroundColor: '#f5f5f5',
    color: '#222',
    fontWeight: 500,
    borderRadius: '10px',
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '10px 24px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backdropFilter: 'blur(4px)',
    fontFamily: buttonFontFamily,
  };
  const backButtonHover = {
    scale: 1.15,
    transition: { duration: 0.16, ease: 'easeInOut' },
    cursor: 'pointer',
    x:-20
  };

  // Cancel Button: White with black border, less bold
  const cancelButtonStyle = {
    backgroundColor: '#fff',
    color: '#111',
    fontWeight: 500,
    borderRadius: '10px',
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '10px 24px',
    border: '1.5px solid #111',
    backdropFilter: 'blur(4px)',
    fontFamily: buttonFontFamily,
  };
  const cancelButtonHover = {
    scale: 1.05,
    backgroundColor: '#f5f5f5',
    color: '#222',
    boxShadow: '0px 2px 12px #bbb',
    filter: 'blur(2px)',
    transition: { duration: 0.16, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // Delete Button: Black, bold, strong shadow
  const deleteButtonStyle = {
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
    padding: '12px 28px',
    border: 'none',
    backdropFilter: 'blur(8px)',
    fontFamily: buttonFontFamily,
  };
  const deleteButtonHover = {
    scale: 1.1,
    backgroundColor: '#222',
    boxShadow: '0px 6px 32px #888',
    filter: 'blur(2.5px)',
    transition: { duration: 0.2, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // Link Button: Transparent, black text
  const linkButtonStyle = {
    backgroundColor: 'transparent',
    color: '#111',
    fontWeight: 500,
    borderRadius: '10px',
    fontSize: '22px',
    textTransform: 'none',
    marginLeft:"20px",
    boxShadow: 'none',
    padding: '20px 24px',
    border: 'none',
    backdropFilter: 'none',
    fontFamily: buttonFontFamily,
  };
  const linkButtonHover = {
    scale: 1.06,
    letterSpacing: "2px",
    backgroundColor: '#f5f5f5',
    padding: '8px 12px',
    borderRadius: '6px',
    boxShadow: 'none',
    transition: { duration: 0.2, ease: 'easeInOut' },
    cursor: 'pointer',
    x: 25,
  };

  // Edit Button: Gray, bold
  const editButtonStyle = {
    backgroundColor: '#444',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    padding: '12px 28px',
    border: 'none',
    backdropFilter: 'blur(6px)',
    fontFamily: buttonFontFamily,
  };
  const editButtonHover = {
    scale: 1.08,
    backgroundColor: '#666',
    boxShadow: '0px 4px 24px #888',
    filter: 'blur(1.5px)',
    transition: { rotate: { duration: 0.18, ease: 'easeInOut' } },
    cursor: 'pointer',
  };

  // Create Button: Medium gray, bold
  const createButtonStyle = {
    backgroundColor: '#888',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    padding: '12px 28px',
    border: 'none',
    backdropFilter: 'blur(6px)',
    fontFamily: buttonFontFamily,
  };
  const createButtonHover = {
    scale: 1.08,
    backgroundColor: '#555',
    boxShadow: '0px 4px 24px #888',
    filter: 'blur(1.5px)',
    transition: { duration: 0.18, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // View Button: Dark gray, medium
  const viewButtonStyle = {
    backgroundColor: '#222',
    color: '#fff',
    fontWeight: 600,
    borderRadius: '10px',
    fontSize: '1.05rem',
    textTransform: 'uppercase',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    padding: '10px 24px',
    border: 'none',
    backdropFilter: 'blur(4px)',
    fontFamily: buttonFontFamily,
  };
  const viewButtonHover = {
    scale: 1.06,
    backgroundColor: '#111',
    boxShadow: '0px 2px 12px #888',
    filter: 'blur(1.5px)',
    transition: { duration: 0.15, ease: 'easeInOut' },
    cursor: 'pointer',
  };

  // Nav Open Button (menu icon) - Fixed: added position to style object
  const navOpenButtonStyle = {
    position: 'absolute', // Moved from prop to style object
    backgroundColor: '#000',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: buttonFontFamily,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
  };
  const navOpenButtonHover = {
    rotate: 20,
    y: 0,
    backgroundColor: '#222',
    color: '#fff',
    boxShadow: '0 0 16px black',
    cursor: 'pointer',
    transition: { rotate: { duration: 0.18, ease: 'easeInOut' } },
  };

  // Nav Close Button (close icon)
  const navCloseButtonStyle = {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: '50%',
    padding: '8px',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: buttonFontFamily,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  };
  const navCloseButtonHover = {
    scale: 1.3,
    backgroundColor: '#eee',
    color: '#000',
    transition: { rotate: { duration: 0.18, ease: 'easeInOut' } },
    cursor: 'pointer',
  };

  // Batched Edit Button: Outlined, secondary style (like MUI secondary button)
  const batchedEditButtonStyle = {
    backgroundColor: '#fff',
    color: 'black',
    border: '1.5px solid black',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '6px 18px',
    boxShadow: 'none',
    textTransform: 'none',
    fontFamily: buttonFontFamily,
    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };
  const batchedEditButtonHover = {
    backgroundColor: '#e3f2fd',
    color: 'black',
    scale: 1.1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    transition: { rotate: { duration: 0.58, ease: 'easeInOut' } },
    cursor: 'pointer',
  };

  return {
    submitButtonStyle,
    confirmButtonStyle,
    backButtonStyle,
    cancelButtonStyle,
    linkButtonStyle,
    deleteButtonStyle,
    editButtonStyle,
    createButtonStyle,
    viewButtonStyle,
    submitButtonHover,
    confirmButtonHover,
    backButtonHover,
    cancelButtonHover,
    linkButtonHover,
    deleteButtonHover,
    editButtonHover,
    createButtonHover,
    viewButtonHover,
    navOpenButtonStyle,
    navOpenButtonHover,
    navCloseButtonStyle,
    navCloseButtonHover,
    batchedEditButtonStyle,
    batchedEditButtonHover,
  };
}