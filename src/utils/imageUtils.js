export const imageUtils = {
    isValidImage: (img) => {
      return img && 
             typeof img === 'string' && 
             img.trim() !== '' && 
             !img.includes('/error.png') && 
             !img.includes('placeholder');
    },

    isValidImageUrl: (url) => {
      if (!url || typeof url !== 'string') return false;
      if (url === '/no-image.png') return false;
      if (url.includes('404') || url.includes('error') || url.includes('undefined') || url.includes('null')) return false;
      if (url.trim() === '') return false;
      if (url.startsWith('data:')) return false; // Skip data URLs
      if (url === 'undefined' || url === 'null') return false;
      if (url.length < 5) return false; // Skip very short URLs that are likely invalid
      return true;
    },
  
    isGif: (src) => {
      if (!src || typeof src !== 'string') return false;
      const lowerSrc = src.toLowerCase();
      return lowerSrc.includes('.gif') || 
             lowerSrc.includes('gif') || 
             lowerSrc.includes('image/gif') ||
             lowerSrc.endsWith('.gif');
    },
  
    addTimestampToGif: (src, timestamp) => {
      const separator = src.includes('?') ? '&' : '?';
      return `${src}${separator}_t=${timestamp}`;
    },
  
    preloadImage: (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    }
  };