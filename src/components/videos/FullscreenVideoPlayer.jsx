import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically load ReactPlayer with SSR disabled
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const FullscreenVideoPlayer = ({ url, coverImage }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Only load the player after the component is mounted on the client
  useEffect(() => {
    setIsMounted(true);
    
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice || window.innerWidth <= 768);
    };

    // Check orientation
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkMobile();
    checkOrientation();

    // Add event listeners for responsive behavior
    window.addEventListener('resize', () => {
      checkMobile();
      checkOrientation();
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        checkMobile();
        checkOrientation();
      }, 100);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isMounted) {
    return null; // Don't render anything on the server-side
  }

  // Responsive styles based on device
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const videoContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  return (
    <div style={containerStyle}>
      <div style={videoContainerStyle}>
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          playing={true}
          controls={false}
          loop={true}
          muted={true}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
                fs: 1,
                playsinline: 1,
                mute: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : undefined
              }
            },
            vimeo: {
              playerOptions: {
                autoplay: true,
                muted: true,
                background: true
              }
            },
            file: {
              attributes: {
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: isMobile && isLandscape ? 'cover' : 'contain'
                },
                muted: true,
                autoPlay: true,
                playsInline: true
              }
            }
          }}
          style={{
            objectFit: isMobile && isLandscape ? 'cover' : 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default FullscreenVideoPlayer; 