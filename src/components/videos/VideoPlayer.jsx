import React, { useMemo, useState } from 'react';

/**
 * VideoPlayer Component
 * Handles various video URL formats including:
 * - Cloudflare Stream (/iframe, /watch)
 * - Direct video files (.mp4, .webm, .ogg, .mov)
 * - YouTube URLs
 * - Vimeo URLs
 *
 * Props:
 *  onError — called when video fails to load; parent can use this
 *            to hide the player entirely (e.g. setVideoError(true))
 */
const VideoPlayer = ({
  videoUrl,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  style = {},
  onError,          // ← new: notify parent on load failure
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.();     // ← notify parent if callback provided
  };

  const videoConfig = useMemo(() => {
    if (!videoUrl) return null;

    const url = videoUrl.trim();

    // Cloudflare Stream - iframe format
    if (url.includes('cloudflarestream.com') && url.includes('/iframe')) {
      return { type: 'iframe', src: url };
    }

    // Cloudflare Stream - /watch format (convert to iframe)
    if (url.includes('cloudflarestream.com') && url.includes('/watch')) {
      return { type: 'iframe', src: url.replace('/watch', '/iframe') };
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      if (videoId) {
        return {
          type: 'iframe',
          src: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return {
          type: 'iframe',
          src: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    // Direct video file formats
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.m3u8'];
    const isDirectVideo = videoExtensions.some(ext =>
      url.toLowerCase().includes(ext)
    );

    if (isDirectVideo) {
      return { type: 'video', src: url };
    }

    // Default to iframe for unknown formats
    return { type: 'iframe', src: url };
  }, [videoUrl]);

  // ── No URL provided ──────────────────────────────────────────────
  if (!videoConfig) return null;

  // ── Error occurred — render nothing (parent also hides wrapper) ──
  if (hasError) return null;

  // ── iframe (Cloudflare Stream, YouTube, Vimeo, etc.) ────────────
  if (videoConfig.type === 'iframe') {
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ paddingTop: '56.25%', ...style }}
      >
        <iframe
          src={videoConfig.src}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          style={{ border: 'none' }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          loading="lazy"
          onError={handleError}   // ← fires on network-level iframe errors
        />
      </div>
    );
  }

  // ── HTML5 video (direct video files) ────────────────────────────
  if (videoConfig.type === 'video') {
    return (
      <video
        src={videoConfig.src}
        className={`w-full h-full rounded-lg ${className}`}
        style={style}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        onError={handleError}    // ← fires reliably for direct video files
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return null;
};

export default VideoPlayer;