import { useEffect, useState } from 'react';

const normalize = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

const useAppType = () => {
  const [isArtistweb, setIsArtistweb] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const envValue = process.env.NEXT_PUBLIC_APP_TYPE;
    const normalizedValue = normalize(envValue);
    // Check for both "artist website" and "Artist Website" variations
    const isArtistWebsite = normalizedValue === 'artist website';
    setIsArtistweb(isArtistWebsite);
  }, []);

  return isArtistweb;
};

export default useAppType;


