import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useReverseTheme } from '@/hooks/useReverseTheme';

const CustomDrawer = ({ 
  content, 
  trigger, 
  direction = "left", 
  width = "220px", 
  title, 
  showTitle = true, 
  BackdropProps = {},
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useReverseTheme();

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      const body = document.body;
      if (body.style.overflow === 'hidden') {
        body.style.overflow = '';
      }
      // Remove any lingering backdrop elements
      const backdrops = document.querySelectorAll('.ant-drawer-mask, .ant-drawer-wrap');
      backdrops.forEach(backdrop => {
        if (backdrop && backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
    };
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    // Force cleanup of any lingering styles
    setTimeout(() => {
      const body = document.body;
      if (body.style.overflow === 'hidden') {
        body.style.overflow = '';
      }
      // Remove any lingering backdrop elements
      const backdrops = document.querySelectorAll('.ant-drawer-mask, .ant-drawer-wrap');
      backdrops.forEach(backdrop => {
        if (backdrop && backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      });
    }, 100);
  };

  // Force black background in dark mode when drawer opens
  useEffect(() => {
    if (isOpen && colors.isDark) {
      const timer = setTimeout(() => {
        const drawerElements = [
          '.ant-drawer-content',
          '.ant-drawer-content-wrapper',
          '.ant-drawer-body',
          '.ant-drawer-header',
          '.ant-drawer-mask',
          '.ant-drawer-wrap'
        ];
        
        drawerElements.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            if (element) {
              element.style.backgroundColor = '#000000';
              element.style.background = '#000000';
              element.style.setProperty('background-color', '#000000', 'important');
              element.style.setProperty('background', '#000000', 'important');
            }
          });
        });
        
        // Also target any child elements that might have backgrounds
        const allDrawerElements = document.querySelectorAll('.ant-drawer *');
        allDrawerElements.forEach(element => {
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
              computedStyle.backgroundColor !== 'transparent') {
            element.style.backgroundColor = 'transparent';
            element.style.background = 'transparent';
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, colors.isDark]);

  // Convert direction to Ant Design placement
  const getPlacement = (direction) => {
    switch (direction) {
      case 'left': return 'left';
      case 'right': return 'right';
      case 'top': return 'top';
      case 'bottom': return 'bottom';
      default: return 'left';
    }
  };

  return (
    <>
      <div onClick={handleOpen}>
        {trigger}
      </div>
      <Drawer
        title={showTitle && title ? title : null}
        placement={getPlacement(direction)}
        width={width}
        open={isOpen}
        onClose={handleClose}
        closable={false}
        maskClosable={true}
        destroyOnClose={true}
        getContainer={false}
        styles={{
          body: {
            padding: 0,
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            margin: 0,
            border: 'none',
          },
          header: {
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: 'none',
            padding: 0,
            height: 0,
            display: 'none',
          },
          content: {
            backgroundColor: colors.isDark ? '#000000' : 'transparent',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            zIndex: 1401, // Higher than SideNav (1400)
            height: '100vh',
            width: width,
            margin: 0,
            padding: 0,
            border: 'none',
            boxShadow: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            background: colors.isDark ? '#000000' : 'transparent',
          },
          mask: {
            backgroundColor: BackdropProps?.style?.backgroundColor || (colors.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)'),
            backdropFilter: BackdropProps?.style?.backdropFilter || (colors.isDark ? 'blur(8px)' : 'blur(4px)'),
            WebkitBackdropFilter: BackdropProps?.style?.WebkitBackdropFilter || (colors.isDark ? 'blur(8px)' : 'blur(4px)'),
            zIndex: 1400, // Same as SideNav to ensure proper layering
          },
          wrapper: {
            zIndex: 1400, // Same as SideNav
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: width,
            border: 'none',
            boxShadow: 'none',
            backgroundColor: colors.isDark ? '#000000' : 'transparent',
            background: colors.isDark ? '#000000' : 'transparent',
          }
        }}
        className={`custom-drawer ${colors.isDark ? 'dark-drawer' : ''}`}
        style={{
          '--drawer-bg': colors.isDark ? '#000000' : 'transparent',
          ...style,
        }}
      >
        {/* Custom close button - always show */}
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: colors.isDark ? '#000000' : colors.text, // Black icon in dark mode, original color in light mode
            zIndex: 1002,
            backgroundColor: colors.isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)', // White background in both modes
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${colors.isDark ? 'rgba(0, 0, 0, 0.1)' : colors.border}`, // Subtle border in dark mode
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        />
        
        {/* Content area */}
        <div
          style={{
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            paddingTop: '0',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            position: 'relative',
            top: 0,
            left: 0,
            margin: 0,
            border: 'none',
          }}
        >
          {content}
        </div>
      </Drawer>
    </>
  );
};

export default CustomDrawer;
