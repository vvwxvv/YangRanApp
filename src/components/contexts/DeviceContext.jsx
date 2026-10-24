import React, { createContext } from "react";
import { useMediaQuery } from "@mui/material";

export const DeviceContext = createContext({
  isMobile: false,
  isTablet: false,
  isMiddleSizeDevice: false,
  isDesktop: false,
});

export const DeviceProvider = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:600px)", { noSsr: true });
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:1024px)", { noSsr: true });
  const isMiddleSizeDevice = useMediaQuery("(min-width:1025px) and (max-width:1300px)", { noSsr: true });
  const isDesktop = useMediaQuery("(min-width:1301px)", { noSsr: true });

  return (
    <DeviceContext.Provider value={{ isMobile, isTablet, isMiddleSizeDevice, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};