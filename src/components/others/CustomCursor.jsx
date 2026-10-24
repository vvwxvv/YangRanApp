import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateCursor);

    // Add hover listeners
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const hoverableElements = document.querySelectorAll("a, button, .hover-target");
    hoverableElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      hoverableElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: position.x , // Offset to center the cursor
        y: position.y ,
        scale: hovered ? 1.5 : 1, // Scale on hover
        opacity: hovered ? 0.8 : 1, // Change opacity on hover
        filter: hovered ? "blur(4px)" : "blur(10px)", // Blur effect on hover
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        position: "fixed",
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255, 233, 124,0.2) 50%,rgba(255, 228, 148, 0.3) 10%, transparent 60.01%)",
        boxShadow: "0 0 10px 10px rgb(255, 232, 158)",
        filter: "blur(20px)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    ></motion.div>
  );
}

export default CustomCursor;