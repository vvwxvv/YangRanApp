"use client";
import React, { createContext, useMemo } from "react";
import { usePathname } from "next/navigation";

export const ManagerContext = createContext({ isManager: false });

export const ManagerProvider = ({ children }) => {
  const pathname = usePathname();

  // Recalculates automatically on every client-side navigation
  const isManager = useMemo(() => {
    if (!pathname) return false;
    // Exact match OR any sub-route under /manager/
    return pathname === "/manager" || pathname.startsWith("/manager/");
  }, [pathname]);

  return (
    <ManagerContext.Provider value={{ isManager }}>
      {children}
    </ManagerContext.Provider>
  );
};