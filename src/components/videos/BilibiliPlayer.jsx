import React from 'react';

const BilibiliPlayer = ({ videoId, startTime = 0 }) => {
  // Extract video ID from Bilibili URL if needed
  const getVideoId = (url) => {
    if (url.includes('BV')) {
      const match = url.match(/BV\w+/);
      return match ? match[0] : videoId;
    }
    return videoId;
  };

  const bvId = getVideoId(videoId);
  const iframeSrc = `https://player.bilibili.com/player.html?bvid=${bvId}&autoplay=1&muted=1&start=${startTime}`;

  return (
    <div style={{
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
    }}>
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        style={{
          border: 'none',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default BilibiliPlayer; 