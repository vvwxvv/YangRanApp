import React from 'react';
import { useReverseTheme } from '@/hooks/useReverseTheme';

export default function LoadingSpinner({ size = 100, className = "" }) {
  const { colors } = useReverseTheme();
  
  // Allow any size, no clamping
  const spinnerSize = size;
  
  return (
    <div className={`flex items-center justify-center bg-transparent ${className}`}
      style={{backgroundColor: 'transparent'}}
      >
      <svg
        width={spinnerSize}
        height={spinnerSize}
        viewBox="0 0 100 100"
        className="animate-spin bg-transparent"
        style={{
          animation: 'spin 1s linear infinite',
          backgroundColor: 'transparent'
        }}
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.text} stopOpacity="0.1" />
            <stop offset="70%" stopColor={colors.text} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.text} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.text} stopOpacity="0.2" />
            <stop offset="60%" stopColor={colors.text} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.text} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.text} stopOpacity="0.3" />
            <stop offset="50%" stopColor={colors.text} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.text} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.text} stopOpacity="0.4" />
            <stop offset="40%" stopColor={colors.text} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colors.text} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer circle - full circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Second circle - full circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Third circle - full circle */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="url(#gradient3)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Fourth circle - full circle */}
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke="url(#gradient4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Inner circle - full circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="none"
          stroke="url(#gradient4)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
