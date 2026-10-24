"use client";
import React, { createContext, useContext } from "react";
import { useTheme as useNextTheme } from "next-themes";

/**
 * ThemeContext — thin wrapper over the app's REAL theme engine (next-themes,
 * mounted in app/layout.jsx). It only exposes `isDark` + `toggleTheme` so any
 * component can read/switch the theme without importing next-themes directly.
 *
 * Previously this file ran its own `prefers-color-scheme` listener, so it
 * disagreed with the actual light/dark switch. Now it is the single source of
 * truth: dark ⇒ `--text-primary` is white, light ⇒ black.
 */
const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
