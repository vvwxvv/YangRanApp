import React from 'react';
import CustomDrawer from '@/components/drawers/CustomDrawer';
import PatternLock from '@/components/lockers/PatternLock';

export default function PatternLockDrawer({ onSuccess }) {
  return (
    <CustomDrawer
      content={
        <PatternLock
          onSuccess={(pattern) => {
            onSuccess(pattern); // Pass the pattern to the parent
          }}
          onClose={() => {}} // Optional: Define behavior for closing if needed
        />
      }
      trigger={null} // No trigger inside the drawer
      direction="bottom" // Full-window drawer from the bottom
      width="100%" // Full width
      style={{
        position: 'fixed', // Ensure the drawer is fixed to the viewport
        top: 0, // Start at the top of the viewport
        left: 0, // Start at the left of the viewport
        width: '100%', // Full width
        height: '100%', // Full height
        backgroundColor: 'white', // Ensure the background is white
        zIndex: 12000, // Ensure it appears above all other elements
      }}
    />
  );
}