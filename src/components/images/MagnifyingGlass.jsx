import React, { useState } from 'react';

const MagnifyingGlass = ({ 
  imageUrl, 
  children, 
  zoomLevel = 2, 
  lensSize = 150, 
  borderColor = '#333',
  shadowColor = 'rgba(0,0,0,0.3)',
  cursor = 'crosshair'
}) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPosition({ x, y });
  };

  const lensRadius = lensSize / 2;
  const backgroundSize = `${window.innerWidth * zoomLevel}px auto`;
  const backgroundPositionX = -(magnifierPosition.x * zoomLevel - lensRadius);
  const backgroundPositionY = -(magnifierPosition.y * zoomLevel - lensRadius);

  return (
    <div 
      style={{ 
        position: 'relative',
        display: 'inline-block',
        cursor: cursor
      }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {/* Magnifying Glass */}
      {showMagnifier && (
        <div
          style={{
            position: 'absolute',
            left: magnifierPosition.x - lensRadius,
            top: magnifierPosition.y - lensRadius,
            width: lensSize,
            height: lensSize,
            borderRadius: '50%',
            border: `2px solid ${borderColor}`,
            backgroundColor: 'white',
            pointerEvents: 'none',
            zIndex: 10,
            overflow: 'hidden',
            boxShadow: `0 4px 20px ${shadowColor}`,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: backgroundSize,
            backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
    </div>
  );
};

export default MagnifyingGlass; 