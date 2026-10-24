"use client";

import React, { useState, useCallback } from "react";

const ShowMoreButton = ({
  onClick,
  fontFamily,
  className = "flex justify-center mt-8 mb-8",
  buttonClassName = "flex items-center justify-center w-16 h-16 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 rounded-full group border-2 border-current",
  iconClassName = "transition-transform duration-200 group-hover:scale-125",
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback(() => setPressed(true), []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp = useCallback(
    (e) => {
      setPressed(false);
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick]
  );
  // Keyboard fallback only
  const handleClick = useCallback(
    (e) => {
      if (e.pointerType === "") onClick?.(e);
    },
    [onClick]
  );

  return (
    <div className={className} style={{ backgroundColor: "transparent" }}>
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className={`${buttonClassName} touch-manipulation`}
        style={{
          fontFamily,
          backgroundColor: "transparent",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
          userSelect: "none",
          WebkitUserSelect: "none",
          transform: pressed ? "scale(0.88)" : "scale(1)",
          opacity: pressed ? 0.6 : 1,
          transition: pressed
            ? "transform 0.05s ease-out, opacity 0.05s ease-out"
            : "transform 0.18s ease-out, opacity 0.18s ease-out",
        }}
      >
        <svg
          className={iconClassName}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 512.02 319.26"
          width="24"
          height="15"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.9 48.96 48.97 5.89c7.86-7.86 20.73-7.84 28.56 0l178.48 178.48L434.5 5.89c7.86-7.86 20.74-7.82 28.56 0l43.07 43.07c7.83 7.84 7.83 20.72 0 28.56l-192.41 192.4-.36.37-43.07 43.07c-7.83 7.82-20.7 7.86-28.56 0l-43.07-43.07-.36-.37L5.9 77.52c-7.87-7.86-7.87-20.7 0-28.56z" />
        </svg>
      </button>
    </div>
  );
};

export default ShowMoreButton;