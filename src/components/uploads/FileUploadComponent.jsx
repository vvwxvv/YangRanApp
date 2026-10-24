import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Copy, RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';
import { getSystemLabel } from '@/components/labels/system_labels';
import { useReverseTheme } from '@/hooks/useReverseTheme';


// Constants for better maintainability
const DEFAULT_CONFIG = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_TIMEOUT: 30000, // 30 seconds
  PROGRESS_INTERVAL: 300, // 300ms
  ANIMATION_DELAY: 1500, // 1.5s
};

// Function to get validation messages using system labels
const getValidationMessages = (isCn) => ({
  typeNotAllowed: getSystemLabel('typeNotAllowed', isCn),
  sizeExceeded: getSystemLabel('sizeExceeded', isCn),
  emptyFile: getSystemLabel('emptyFile', isCn),
  uploadFailed: getSystemLabel('uploadFailed', isCn),
  uploadTimeout: getSystemLabel('uploadTimeout', isCn),
  uploading: getSystemLabel('uploading', isCn),
  uploadSuccessful: getSystemLabel('uploadSuccessful', isCn),
  uploadFailedStatus: getSystemLabel('uploadFailedStatus', isCn),
  dropOrClick: getSystemLabel('dropOrClick', isCn),
  chooseFile: getSystemLabel('chooseFile', isCn),
  uploadAnother: getSystemLabel('uploadAnother', isCn),
  tryAgain: getSystemLabel('tryAgain', isCn),
  requirements: getSystemLabel('requirements', isCn),
  maxSize: getSystemLabel('maxSize', isCn),
  allowedFormats: getSystemLabel('allowedFormats', isCn),
  secureUpload: getSystemLabel('secureUpload', isCn),
  dragAndDrop: getSystemLabel('dragAndDrop', isCn),
  file: getSystemLabel('file', isCn),
  size: getSystemLabel('size', isCn),
  type: getSystemLabel('type', isCn),
  date: getSystemLabel('date', isCn),
  fileUrl: getSystemLabel('fileUrl', isCn),
  clickToCopy: getSystemLabel('clickToCopy', isCn),
  copied: getSystemLabel('copied', isCn),
  startUpload: getSystemLabel('startUpload', isCn),
  cancelSelection: getSystemLabel('cancelSelection', isCn),
  readyToUpload: getSystemLabel('readyToUpload', isCn),
  clickUploadButton: getSystemLabel('clickUploadButton', isCn),
  multipleFilesSupported: getSystemLabel('multipleFilesSupported', isCn),
});

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatMessage = (template, variables = {}) => {
  return template.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
};

// Custom hooks
const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.log('Failed to copy text:', err);
      return false;
    }
  }, []);

  return { copyToClipboard, copied };
};

const useUploadProgress = () => {
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  const startProgress = useCallback(() => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        return Math.min(next, 85);
      });
    }, DEFAULT_CONFIG.PROGRESS_INTERVAL);
  }, []);

  const completeProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(100);
  }, []);

  const resetProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return { progress, startProgress, completeProgress, resetProgress };
};

// Main component
const FileUploadComponent = ({ 
  onSuccess = null,
  onError = null,
  title = "Image Upload",
  disabled = false,
  allowedTypes = DEFAULT_CONFIG.ALLOWED_TYPES,
  maxSize = DEFAULT_CONFIG.MAX_SIZE,
  className = "",
  'aria-label': ariaLabel = "File upload area",
  language = 'en',
  isCn = false,
  apiEndpoint = '/api/upload',
  uploadTimeout = DEFAULT_CONFIG.UPLOAD_TIMEOUT,
  showPreview = true,
  showFileDetails = true,
  allowMultiple = false,
  customValidation = null,
  onUploadStart = null,
  onUploadProgress = null,
}) => {
  const { isDark } = useReverseTheme();
  
  // State management
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]); // For thumbnail previews
  
  // Refs
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);
  const abortControllerRef = useRef(null);
  
  // Custom hooks
  const { copyToClipboard, copied } = useClipboard();
  const { progress, startProgress, completeProgress, resetProgress } = useUploadProgress();

  // Create thumbnail preview for image files
  const createThumbnail = useCallback((file) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set thumbnail size
          const maxSize = 120;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Determine language: isCn prop takes precedence, then language prop
  const useChinese = useMemo(() => isCn || language === 'cn', [isCn, language]);

  // Memoized values
  const messages = useMemo(() => getValidationMessages(useChinese), [useChinese]);
  const allowedTypesString = useMemo(() => allowedTypes.join(','), [allowedTypes]);
  const maxSizeMB = useMemo(() => (maxSize / 1024 / 1024).toFixed(0), [maxSize]);
  const allowedFormats = useMemo(() => 
    allowedTypes.map(type => type.split('/')[1]?.toUpperCase() || type).join(', '), 
    [allowedTypes]
  );

  // Validation function
  const validateFile = useCallback((file) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return formatMessage(messages.typeNotAllowed) + ' ' + allowedFormats;
    }
    
    // Check file size
    if (file.size > maxSize) {
      return formatMessage(messages.sizeExceeded, {
        maxSize: maxSizeMB,
        fileSize: (file.size / 1024 / 1024).toFixed(2)
      });
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return messages.emptyFile;
    }
    
    // Custom validation
    if (customValidation && typeof customValidation === 'function') {
      const customError = customValidation(file);
      if (customError) return customError;
    }
    
    return null;
  }, [allowedTypes, maxSize, allowedFormats, maxSizeMB, messages, customValidation]);

  // Upload function with retry logic
  const uploadFile = useCallback(async (file, retryAttempt = 0) => {
    const validationError = validateFile(file);
    if (validationError) {
      const error = new Error(validationError);
      setError(validationError);
      onError?.(error);
      return;
    }

    setIsUploading(true);
    setError(null);
    startProgress();
    onUploadStart?.(file);

    const formData = new FormData();
    formData.append(allowMultiple ? 'files' : 'image', file);
    formData.append('originalName', file.name);
    formData.append('retryAttempt', retryAttempt.toString());

    try {
      // Create abort controller for this upload
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, uploadTimeout);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-Upload-Retry': retryAttempt.toString(),
        },
      });

      clearTimeout(timeoutId);
      completeProgress();

      if (!response.ok) {
        // Try to parse the error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If we can't parse the response, use the status text
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        // Check if this is a duplicate file error
        if (errorData.error === 'DUPLICATE_FILE_NAME' || errorData.message?.includes('already exists')) {
          const errorMessage = useChinese 
            ? `图片 "${file.name}" 已存在。请重命名图片文件后重新上传。`
            : `An image with the name "${file.name}" already exists. Please rename your image file and try uploading again.`;
          throw new Error(errorMessage);
        }
        
        // For other API errors, use the message from the response
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.url) {
        throw new Error('Invalid response: missing URL');
      }

      const uploadedFileData = {
        id: Date.now() + Math.random(), // Simple ID generation
        url: result.url,
        originalName: result.originalName || file.name,
        size: result.size || file.size,
        type: result.type || file.type,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles(prev => allowMultiple ? [...prev, uploadedFileData] : [uploadedFileData]);
      setRetryCount(0);
      
      // Reset progress after animation
      setTimeout(() => resetProgress(), DEFAULT_CONFIG.ANIMATION_DELAY);
      
      onSuccess?.(result.url, uploadedFileData);
      onUploadProgress?.(100, uploadedFileData);
      
    } catch (err) {
      let errorMessage = messages.uploadFailedStatus;
      let isDuplicateError = false;
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = messages.uploadTimeout;
        } else if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          errorMessage = messages.uploadTimeout;
        } else {
          // Check if this is a duplicate file name error from our API
          if (err.message.includes('DUPLICATE_FILE_NAME') || err.message.includes('already exists')) {
            isDuplicateError = true;
            errorMessage = useChinese 
              ? `图片 "${file.name}" 已存在。请重命名图片文件后重新上传。`
              : `An image with the name "${file.name}" already exists. Please rename your image file and try uploading again.`;
          } else {
            errorMessage = err.message;
          }
        }
      }

      // Don't retry for duplicate file errors
      if (isDuplicateError) {
        setError(errorMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
        resetProgress();
        return;
      }

      // Retry logic for network errors
      if (retryAttempt < 2 && (err.name === 'AbortError' || err.message.includes('NetworkError'))) {
        console.warn(`Upload attempt ${retryAttempt + 1} failed, retrying...`);
        setRetryCount(retryAttempt + 1);
        setTimeout(() => {
          uploadFile(file, retryAttempt + 1);
        }, 1000 * (retryAttempt + 1)); // Exponential backoff
        return;
      }
      
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      resetProgress();
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  }, [
    validateFile, onSuccess, onError, messages, startProgress, completeProgress, 
    resetProgress, apiEndpoint, uploadTimeout, allowMultiple, onUploadStart, onUploadProgress, useChinese
  ]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    
    if (disabled || isUploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create thumbnails for dropped files
      const thumbnails = await Promise.all(
        files.map(async (file) => {
          const thumbnail = await createThumbnail(file);
          return {
            file,
            thumbnail,
            id: Date.now() + Math.random()
          };
        })
      );
      
      setSelectedFiles(thumbnails);
      
      if (allowMultiple) {
        files.forEach(file => uploadFile(file));
      } else {
        uploadFile(files[0]);
      }
    }
  }, [disabled, isUploading, uploadFile, allowMultiple, createThumbnail]);

  // File selection handler
  const handleFileSelect = useCallback(async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      // Create thumbnails for selected files
      const thumbnails = await Promise.all(
        fileArray.map(async (file) => {
          const thumbnail = await createThumbnail(file);
          return {
            file,
            thumbnail,
            id: Date.now() + Math.random()
          };
        })
      );
      
      setSelectedFiles(thumbnails);
      
      if (allowMultiple) {
        fileArray.forEach(file => uploadFile(file));
      } else {
        uploadFile(fileArray[0]);
      }
    }
  }, [uploadFile, allowMultiple, createThumbnail]);

  // Click handler
  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  // Reset handler
  const resetUpload = useCallback(() => {
    // Cancel ongoing uploads
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setUploadedFiles([]);
    setSelectedFiles([]); // Clear thumbnails
    setError(null);
    setRetryCount(0);
    resetProgress();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resetProgress]);

  // Remove single file (for multiple uploads)
  const removeFile = useCallback((fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isUploading) {
      e.preventDefault();
      handleClick();
    }
  }, [disabled, isUploading, handleClick]);

  const currentFile = uploadedFiles[0]; // For single file mode
  const hasFiles = uploadedFiles.length > 0;

  return (
    <div className={`w-full ${className}`} role="region" aria-label="File upload">
      <div 
        className="rounded-lg shadow-sm border overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderColor: isDark ? '#444' : '#e5e7eb',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isDragging 
            ? (isDark 
                ? '0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)' 
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)')
            : undefined
        }}
      >
        <div className="p-6">
          <h3 
            className="text-lg font-semibold mb-6" 
            style={{ color: isDark ? '#ffffff' : '#1f2937' }}
          >
            {useChinese ? (title === "Image Upload" ? getSystemLabel('imageUpload', true) : title) : title}
          </h3>
          
          {/* Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-out
              ${!isUploading && !hasFiles && !disabled ? 'cursor-pointer hover:scale-102' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{
              borderColor: isDragging 
                ? '#3b82f6' 
                : hasFiles
                ? '#10b981'
                : error
                ? '#ef4444'
                : isDark ? '#666' : '#d1d5db',
              backgroundColor: isDragging 
                ? (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
                : hasFiles
                ? (isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)')
                : error
                ? (isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
                : isDark ? '#2a2a2a' : '#f9fafb',
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
            onKeyDown={handleKeyDown}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={allowedTypesString}
              multiple={allowMultiple}
              className="sr-only"
              disabled={isUploading || disabled}
              aria-describedby="file-requirements"
            />

            {isUploading ? (
              <div className="space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="w-12 h-12 mx-auto text-blue-500" style={{ animation: 'spin 1s linear infinite' }}>
                  <Loader2 className="w-full h-full" />
                </div>
                <div 
                  className="text-lg font-medium"
                  style={{ color: isDark ? '#ffffff' : '#374151' }}
                >
                  {messages.uploading}
                </div>
                <div 
                  className="w-full rounded-full h-3 overflow-hidden"
                  style={{ backgroundColor: isDark ? '#444' : '#e5e7eb' }}
                >
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div 
                  className="text-sm font-medium"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {Math.round(progress)}%
                  {retryCount > 0 && (
                    <span className="ml-2 text-orange-500">
                      (Retry {retryCount}/2)
                    </span>
                  )}
                </div>
              </div>
            ) : hasFiles ? (
              <div className="space-y-4" style={{ animation: 'slideUp 0.5s ease-out' }}>
                <div className="w-12 h-12 mx-auto text-green-500" style={{ animation: 'checkmark 0.6s ease-out' }}>
                  <CheckCircle className="w-full h-full" />
                </div>
                <div 
                  className="text-lg font-medium"
                  style={{ color: '#10b981' }}
                >
                  {messages.uploadSuccessful}
                </div>
                
                {/* File Details */}
                {showFileDetails && (
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div 
                        key={file.id} 
                        className="rounded-xl p-4 border shadow-sm"
                        style={{
                          backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                          borderColor: isDark ? '#10b981' : '#bbf7d0'
                        }}
                      >
                        {allowMultiple && (
                          <div className="flex justify-between items-start mb-3">
                            <h4 
                              className="font-medium truncate"
                              style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                            >
                              {file.originalName}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                              className="transition-colors p-1"
                              style={{ 
                                color: isDark ? '#9ca3af' : '#9ca3af',
                                '&:hover': { color: '#ef4444' }
                              }}
                              aria-label="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        <div 
                          className="text-sm space-y-3"
                          style={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                        >
                          <div className="grid grid-cols-2 gap-4 text-left">
                            <div><span className="font-medium">{messages.file}</span> {file.originalName}</div>
                            <div><span className="font-medium">{messages.size}</span> {formatFileSize(file.size)}</div>
                            <div><span className="font-medium">{messages.type}</span> {file.type}</div>
                            <div><span className="font-medium">{messages.date}</span> {file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          
                          {/* Image Preview */}
                          {showPreview && file.type.startsWith('image/') && (
                            <div className="mt-4">
                              <img 
                                src={file.url} 
                                alt="Uploaded file preview"
                                className="w-full max-w-sm mx-auto rounded-lg border shadow-sm"
                                style={{ 
                                  maxHeight: '200px', 
                                  objectFit: 'contain',
                                  animation: 'fadeIn 0.5s ease-out',
                                  borderColor: isDark ? '#444' : '#e5e7eb'
                                }}
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* URL Display */}
                          <div className="mt-4">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="p-3 rounded-lg text-xs break-all border cursor-pointer transition-colors flex-1"
                                style={{
                                  backgroundColor: isDark ? '#444' : '#f9fafb',
                                  borderColor: isDark ? '#666' : '#e5e7eb'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(file.url);
                                }}
                                title={messages.clickToCopy}
                              >
                                {file.url}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(file.url);
                                }}
                                className="p-2 transition-colors rounded-lg"
                                style={{
                                  color: isDark ? '#9ca3af' : '#6b7280',
                                  '&:hover': { 
                                    color: '#3b82f6',
                                    backgroundColor: isDark ? '#444' : '#f3f4f6'
                                  }
                                }}
                                title={messages.clickToCopy}
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            {copied && (
                              <div className="text-xs text-green-600 mt-1 font-medium">
                                {messages.copied}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedFiles.length > 0 && !isUploading ? (
              <div className="space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div 
                  className="text-lg font-medium"
                  style={{ color: '#3b82f6' }}
                >
                  {messages.readyToUpload}
                </div>
                
                {/* Thumbnail Preview */}
                <div className="space-y-3">
                  {selectedFiles.map((item) => (
                    <div 
                      key={item.id} 
                      className="rounded-xl p-4 border shadow-sm"
                      style={{
                        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                        borderColor: isDark ? '#3b82f6' : '#bfdbfe'
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        {item.thumbnail && (
                          <div className="flex-shrink-0">
                            <img 
                              src={item.thumbnail} 
                              alt="File preview"
                              className="w-16 h-16 rounded-lg border object-cover"
                              style={{ 
                                animation: 'fadeIn 0.5s ease-out',
                                borderColor: isDark ? '#444' : '#e5e7eb'
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div 
                            className="text-sm font-medium truncate"
                            style={{ color: isDark ? '#ffffff' : '#1f2937' }}
                          >
                            {item.file.name}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                          >
                            {formatFileSize(item.file.size)} • {item.file.type}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFiles(prev => prev.filter(f => f.id !== item.id));
                          }}
                          className="transition-colors p-1"
                          style={{ 
                            color: isDark ? '#9ca3af' : '#9ca3af',
                            '&:hover': { color: '#ef4444' }
                          }}
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div 
                  className="text-sm"
                  style={{ color: '#3b82f6' }}
                >
                  {messages.clickUploadButton}
                </div>
              </div>
            ) : error ? (
              <div className="space-y-4" style={{ animation: 'shake 0.5s ease-out' }}>
                <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
                <div 
                  className="text-lg font-medium"
                  style={{ color: '#ef4444' }}
                >
                  {messages.uploadFailedStatus}
                </div>
                <div 
                  className="text-sm rounded-xl p-4 border"
                  style={{
                    color: '#ef4444',
                    backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                    borderColor: isDark ? '#ef4444' : '#fecaca'
                  }}
                >
                  {error}
                </div>
              </div>
            ) : (
              <div className="space-y-4" style={{ animation: isDragging ? 'pulse 0.5s ease-out' : undefined }}>
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div 
                  className="text-lg font-medium"
                  style={{ color: isDark ? '#ffffff' : '#374151' }}
                >
                  {messages.dropOrClick}
                </div>
                <div 
                  className="text-sm"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {formatMessage(messages.allowedFormats + ' files up to ' + messages.maxSize.toLowerCase(), {
                    formats: allowedFormats,
                    maxSize: maxSizeMB
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {!isUploading && !hasFiles && !error && selectedFiles.length === 0 && (
              <button
                onClick={handleClick}
                disabled={disabled}
                className={`
                  w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                  flex items-center justify-center space-x-2
                `}
                aria-label="Choose file to upload"
              >
                <Upload className="w-5 h-5" />
                <span>{messages.chooseFile}</span>
              </button>
            )}

            {selectedFiles.length > 0 && !isUploading && !hasFiles && !error && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    selectedFiles.forEach(item => uploadFile(item.file));
                    setSelectedFiles([]);
                  }}
                  disabled={disabled}
                  className={`
                    w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                    flex items-center justify-center space-x-2
                  `}
                  aria-label="Upload selected files"
                >
                  <Upload className="w-5 h-5" />
                  <span>{messages.startUpload}</span>
                </button>
                
                <button
                  onClick={resetUpload}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>{messages.cancelSelection}</span>
                </button>
              </div>
            )}

            {(hasFiles || error) && (
              <button
                onClick={resetUpload}
                className={`
                  w-full px-6 py-3 rounded-xl transition-all duration-200 font-medium
                  flex items-center justify-center space-x-2
                  ${hasFiles 
                    ? 'bg-gray-900 hover:bg-black text-white hover:scale-105 active:scale-95' 
                    : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95'
                  }
                `}
              >
                {hasFiles ? <Upload className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                <span>{hasFiles ? messages.uploadAnother : messages.tryAgain}</span>
              </button>
            )}
          </div>

          {/* File Requirements */}
          <div 
            className="mt-6 text-xs" 
            id="file-requirements"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <div className="font-medium mb-2">
              {messages.requirements}
            </div>
            <div 
              className="rounded-lg p-3 space-y-1"
              style={{ backgroundColor: isDark ? '#2a2a2a' : '#f9fafb' }}
            >
              <div>• {messages.maxSize} {maxSizeMB}MB</div>
              <div>• {messages.allowedFormats} {allowedFormats}</div>
              <div>• {messages.secureUpload}</div>
              <div>• {messages.dragAndDrop}</div>
              {allowMultiple && <div>• {messages.multipleFilesSupported}</div>}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes checkmark {
          0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-15deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// PropTypes for type checking
FileUploadComponent.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  maxSize: PropTypes.number,
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  language: PropTypes.oneOf(['en', 'cn']),
  apiEndpoint: PropTypes.string,
  uploadTimeout: PropTypes.number,
  showPreview: PropTypes.bool,
  showFileDetails: PropTypes.bool,
  allowMultiple: PropTypes.bool,
  customValidation: PropTypes.func,
  onUploadStart: PropTypes.func,
  onUploadProgress: PropTypes.func,
};

export default FileUploadComponent;