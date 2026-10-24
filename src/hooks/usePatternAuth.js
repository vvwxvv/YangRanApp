"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PatternAuth } from "@/utils/patternAuth";

/**
 * Custom hook for pattern-based authentication
 * @param {Object} options - Hook options
 * @param {boolean} options.redirectOnFail - Redirect to login if not authenticated
 * @param {string} options.redirectPath - Path to redirect to (default: "/")
 * @returns {Object} Auth state and methods
 */
export function usePatternAuth(options = {}) {
  const { redirectOnFail = false, redirectPath = "/" } = options;
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isValid = PatternAuth.isSessionValid();
      setIsAuthenticated(isValid);
      setIsChecking(false);

      if (!isValid && redirectOnFail) {
        router.push(redirectPath);
      }
    };

    checkAuth();
  }, [redirectOnFail, redirectPath, router]);

  // Validate pattern and set session
  const authenticate = useCallback((pattern) => {
    setError(null);

    const isValid = PatternAuth.validatePattern(pattern);

    if (isValid) {
      PatternAuth.setSession();
      setIsAuthenticated(true);
      return { success: true };
    } else {
      setError("Invalid pattern");
      return { success: false, error: "Invalid pattern" };
    }
  }, []);

  // Logout and optionally redirect
  const logout = useCallback(
    (redirect = true) => {
      PatternAuth.clearSession();
      setIsAuthenticated(false);

      if (redirect) {
        router.push(redirectPath);
      }
    },
    [router, redirectPath]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get session info
  const getSessionInfo = useCallback(() => {
    return PatternAuth.getSessionInfo();
  }, []);

  // Extend session
  const extendSession = useCallback(() => {
    PatternAuth.extendSession();
  }, []);

  return {
    isAuthenticated,
    isChecking,
    error,
    authenticate,
    logout,
    clearError,
    getSessionInfo,
    extendSession,
  };
}

export default usePatternAuth;