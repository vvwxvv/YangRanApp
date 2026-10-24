import React from 'react';

const DividerLine = ({ type = 'horizontal', style = {} }) => {
    if (type === 'vertical') {
      return (
        <div
          className="inline-block"
          style={{
            width: '1px',
            height: '36px',
            backgroundColor: '#000',
            margin: '0 8px',
            ...style
          }}
        />
      );
    }
  
    return (
      <div
        className="w-full"
        style={{
          height: '1px',
          backgroundColor: '#000',
          borderStyle: 'solid',
          borderWidth: '1px',
          margin: '0',
          ...style
        }}
      />
    );
  };
  
  export default DividerLine;