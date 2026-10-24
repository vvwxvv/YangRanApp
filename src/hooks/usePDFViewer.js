import { useState, useCallback } from "react";

/**
 * Manages PDF iframe loading / error / retry state.
 *
 * @param {string} pdfUrl - URL to the PDF file
 */
const usePDFViewer = (pdfUrl) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setRetryKey((k) => k + 1);
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }, [pdfUrl]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop() || "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

  return {
    isLoading,
    hasError,
    retryKey,
    handleLoad,
    handleError,
    handleRetry,
    handleOpenInNewTab,
    handleDownload,
  };
};

export default usePDFViewer;