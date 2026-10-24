import React, { useState, useEffect } from "react";
import useFont from '@/hooks/useFont';

const TopScrollBanner = () => {
  const { style: labelFontStyle } = useFont();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if the user is at the bottom (with a small buffer)
      if (scrollY + windowHeight >= documentHeight - 10) {
        setShowBanner(true); // Show banner when at the bottom
      } else {
        setShowBanner(false); // Hide banner when not at the bottom
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {showBanner && (
        <div
          style={{
            position: "fixed",
            top: 0, // Position at the top
            left: 0,
            width: "100%",
            height: "200px",
            backgroundColor: "rgba(248, 232, 207, 0.83)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <p style={labelFontStyle}>This is a pop-up div at the top!</p>
        </div>
      )}
    </div>
  );
};

export default TopScrollBanner;