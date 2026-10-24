const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
    const videoPatterns = [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /vimeo\.com\//,
      /dailymotion\.com\//,
      /wistia\.com\//,
      /streamable\.com\//
    ];
    
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           videoPatterns.some(pattern => pattern.test(url));
  };

  export default isVideoUrl;