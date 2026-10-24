import React from 'react';

// Custom Tooltip component to replace Material-UI Tooltip
const CustomTooltip = ({ title, children, placement = 'top' }) => {
  const [show, setShow] = React.useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div 
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-black rounded shadow-lg whitespace-nowrap ${
            placement === 'top' ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-1' :
            placement === 'bottom' ? 'top-full left-1/2 transform -translate-x-1/2 mt-1' :
            placement === 'left' ? 'right-full top-1/2 transform -translate-y-1/2 mr-1' :
            'left-full top-1/2 transform -translate-y-1/2 ml-1'
          }`}
        >
          {title}
          <div 
            className={`absolute w-0 h-0 border-4 border-transparent ${
              placement === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 border-t-black' :
              placement === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 border-b-black' :
              placement === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 border-l-black' :
              'right-full top-1/2 transform -translate-y-1/2 border-r-black'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;