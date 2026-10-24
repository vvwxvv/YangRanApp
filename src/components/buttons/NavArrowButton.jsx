"use client";

import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const NavArrowButton = ({ direction, onClick, disabled, isMobile }) => (
  <IconButton
    onClick={onClick}
    disabled={disabled}
    sx={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      ...(direction === "left"
        ? { left: isMobile ? 4 : -52 }
        : { right: isMobile ? 4 : -52 }),
      zIndex: 10,
      width: { xs: 32, md: 40 },
      height: { xs: 32, md: 40 },
      backgroundColor: isMobile ? "rgba(255,255,255,0.9)" : "transparent",
      border: isMobile ? "1px solid rgba(0,0,0,0.08)" : "none",
      backdropFilter: isMobile ? "blur(6px)" : "none",
      color: "rgba(0,0,0,0.5)",
      opacity: disabled ? 0.2 : 1,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: disabled ? "transparent" : "rgba(0,0,0,0.05)",
        color: "rgba(0,0,0,0.8)",
      },
    }}
    aria-label={direction === "left" ? "Previous artwork" : "Next artwork"}
  >
    {direction === "left" ? (
      <ChevronLeftIcon sx={{ fontSize: { xs: 20, md: 28 } }} />
    ) : (
      <ChevronRightIcon sx={{ fontSize: { xs: 20, md: 28 } }} />
    )}
  </IconButton>
);

export default NavArrowButton;