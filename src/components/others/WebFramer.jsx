import React, { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const WebFramer = ({ url, width = "100%", height = "600px", title = "web Frame", isMuted = true, onMuteToggle }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const iframeRef = useRef(null);
  const muteCheckIntervalRef = useRef(null);
  const mutationObserverRef = useRef(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
      setIsLoading(true);
      setHasError(false);
    }
  }, [url]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (muteCheckIntervalRef.current) {
        clearInterval(muteCheckIntervalRef.current);
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    
    // Apply mute immediately after load
    if (iframeRef.current) {
      setTimeout(() => {
        applyMuteToIframe(isMuted);
        setupMutationObserver(isMuted);
      }, 100);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (url) => {
    if (!url) return '';
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  };

  const refreshFrame = () => {
    setIsLoading(true);
    setHasError(false);
    const separator = currentUrl.includes('?') ? '&' : '?';
    setCurrentUrl(`${currentUrl}${separator}_t=${Date.now()}`);
  };

  const handleMuteToggle = () => {
    if (onMuteToggle) {
      onMuteToggle();
    }
  };

  // Apply mute to all media elements in the iframe
  const applyMuteToMediaElements = (doc, muted) => {
    if (!doc) return;

    try {
      const mediaElements = doc.querySelectorAll('audio, video');
      mediaElements.forEach(element => {
        element.muted = muted;
        element.volume = muted ? 0 : 1;
        
        // Add event listener to prevent unmuting
        if (muted) {
          element.addEventListener('volumechange', function forceMute() {
            if (!element.muted) {
              element.muted = true;
              element.volume = 0;
            }
          });
          
          // Pause autoplay videos when muted
          if (element.tagName === 'VIDEO' && !element.paused) {
            element.pause();
          }
        }
      });

      // Handle nested iframes
      const nestedIframes = doc.querySelectorAll('iframe');
      nestedIframes.forEach(nestedIframe => {
        try {
          const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow?.document;
          if (nestedDoc) {
            applyMuteToMediaElements(nestedDoc, muted);
          }
        } catch (e) {
          // Cross-origin iframe
        }
      });
    } catch (error) {
      // CORS restrictions
    }
  };

  // Setup mutation observer to catch dynamically added media
  const setupMutationObserver = (muted) => {
    if (!iframeRef.current) return;

    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDoc || !iframeDoc.body) return;

      // Disconnect existing observer
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
                node.muted = muted;
                node.volume = muted ? 0 : 1;
                
                if (muted) {
                  node.addEventListener('volumechange', function forceResetMute() {
                    if (!node.muted) {
                      node.muted = true;
                      node.volume = 0;
                    }
                  });
                }
              }
              
              const mediaElements = node.querySelectorAll?.('audio, video');
              mediaElements?.forEach(element => {
                element.muted = muted;
                element.volume = muted ? 0 : 1;
                
                if (muted) {
                  element.addEventListener('volumechange', function forceResetMute() {
                    if (!element.muted) {
                      element.muted = true;
                      element.volume = 0;
                    }
                  });
                }
              });
            }
          });
        });
      });

      observer.observe(iframeDoc.body, {
        childList: true,
        subtree: true
      });

      mutationObserverRef.current = observer;
    } catch (e) {
      // CORS restriction
    }
  };

  // Apply mute to iframe
  const applyMuteToIframe = (muted) => {
    if (!iframeRef.current) return;

    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        applyMuteToMediaElements(iframeDoc, muted);
      }
    } catch (error) {
      // CORS restrictions
    }
  };

  // Apply mute when isMuted prop changes
  useEffect(() => {
    if (!isLoading && !hasError && iframeRef.current) {
      applyMuteToIframe(isMuted);
      setupMutationObserver(isMuted);
    }
  }, [isMuted, isLoading, hasError]);

  // Continuous mute enforcement (more aggressive)
  useEffect(() => {
    if (isMuted && iframeRef.current && !isLoading && !hasError) {
      if (muteCheckIntervalRef.current) {
        clearInterval(muteCheckIntervalRef.current);
      }

      muteCheckIntervalRef.current = setInterval(() => {
        if (iframeRef.current) {
          try {
            const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
            if (iframeDoc) {
              const mediaElements = iframeDoc.querySelectorAll('audio, video');
              mediaElements.forEach(element => {
                if (!element.muted || element.volume > 0) {
                  element.muted = true;
                  element.volume = 0;
                }
              });

              // Check nested iframes
              const nestedIframes = iframeDoc.querySelectorAll('iframe');
              nestedIframes.forEach(nestedIframe => {
                try {
                  const nestedDoc = nestedIframe.contentDocument || nestedIframe.contentWindow?.document;
                  if (nestedDoc) {
                    const nestedMedia = nestedDoc.querySelectorAll('audio, video');
                    nestedMedia.forEach(element => {
                      if (!element.muted || element.volume > 0) {
                        element.muted = true;
                        element.volume = 0;
                      }
                    });
                  }
                } catch (e) {
                  // Cross-origin
                }
              });
            }
          } catch (e) {
            // CORS restrictions
          }
        }
      }, 300); // Check every 300ms for aggressive enforcement
    } else {
      if (muteCheckIntervalRef.current) {
        clearInterval(muteCheckIntervalRef.current);
        muteCheckIntervalRef.current = null;
      }
    }

    return () => {
      if (muteCheckIntervalRef.current) {
        clearInterval(muteCheckIntervalRef.current);
      }
    };
  }, [isMuted, isLoading, hasError]);

  if (!url) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No URL provided</p>
      </div>
    );
  }

  if (!isValidUrl(formatUrl(url))) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
        <p className="text-red-500">Invalid URL format</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4">
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="w-full px-3 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter web URL"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMuteToggle}
            className={`px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
              isMuted 
                ? 'bg-black text-white hover:bg-gray-800 border border-gray-300' 
                : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={refreshFrame}
            className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 border border-gray-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-b-lg" style={{ height: height }}>
            <LoadingSpinner size={60} />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10 rounded-b-lg" style={{ height: height }}>
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <p className="text-red-600 mb-4">Failed to load web</p>
              <button
                onClick={refreshFrame}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={formatUrl(currentUrl)}
          width={width}
          height={height}
          title={title}
          className="border-0 rounded-b-lg"
          style={{ 
            minHeight: height,
            maxHeight: height,
            overflow: 'hidden'
          }}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          loading="lazy"
        />
      </div>

      <div className="p-2 bg-gray-50 border border-gray-300 border-t-0 rounded-b-lg text-xs text-gray-600">
        <p>Displaying: {formatUrl(currentUrl)}</p>
        <p className="text-gray-400">
          Note: Some webs may not load due to X-Frame-Options or CORS policies
        </p>
      </div>
    </div>
  );
};

export default WebFramer;