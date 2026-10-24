import { useMemo, useState, useCallback, useEffect } from 'react';

/**
 * Helper function to decode Base64 strings safely
 */
const decodeBase64 = (str) => {
  try {
    if (typeof window !== 'undefined') {
      return atob(str);
    } else {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
  } catch (error) {
    console.warn('Failed to decode Base64 string:', str);
    return str;
  }
};

/**
 * Helper function to decode Unicode escape sequences
 */
const decodeUnicode = (str) => {
  try {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  } catch (error) {
    console.warn('Failed to decode Unicode string:', str);
    return str;
  }
};

/**
 * Helper function to safely decode environment variables
 */
const safeDecodeEnvVar = (envVar, fallback = '') => {
  if (!envVar) return fallback;
  
  try {
    // First, try to decode if it's URL encoded
    if (envVar.includes('%')) {
      const decoded = decodeURIComponent(envVar);
      if (decoded && decoded !== envVar) {
        return decoded;
      }
    }
    
    // Check if it's Base64 encoded (for Vercel safety)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (base64Regex.test(envVar) && envVar.length % 4 === 0 && envVar.length > 4) {
      try {
        const decoded = decodeBase64(envVar);
        // Validate that decoded string contains valid Chinese characters
        if (decoded && /[\u4e00-\u9fff]/.test(decoded)) {
          return decoded;
        }
      } catch (e) {
        // If Base64 decode fails, continue to other methods
      }
    }
    
    // Check if it contains Unicode escape sequences
    if (envVar.includes('\\u')) {
      const decoded = decodeUnicode(envVar);
      return decoded;
    }
    
    // If the string looks like it has Chinese characters, return as-is
    if (/[\u4e00-\u9fff]/.test(envVar)) {
      return envVar;
    }
    
    // Check for garbled characters and provide fallback
    const hasGarbledChars = /[^\x00-\x7F\u4e00-\u9fff\s]/.test(envVar);
    if (hasGarbledChars) {
      return fallback;
    }
    
    return envVar;
  } catch (error) {
    return fallback;
  }
};

const useAppTitle = (language = 'both') => {
  const [personData, setPersonData] = useState({
    chinese: '', // Set default fallback here
    english: '',
    email: '',
    instagram: '',
    web: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get environment variables
      const rawChinese = process.env.NEXT_PUBLIC_APP_PERSON_CN;
      const rawEnglish = process.env.NEXT_PUBLIC_APP_PERSON_EN;
      
      
      // Decode environment variables with better fallbacks
      const decodedChinese = safeDecodeEnvVar(rawChinese, '');
      const decodedEnglish = safeDecodeEnvVar(rawEnglish, '');
      
      
      setPersonData({
        chinese: decodedChinese,
        english: decodedEnglish,
        email: process.env.NEXT_PUBLIC_APP_PERSON_EMAIL || '',
        instagram: process.env.NEXT_PUBLIC_APP_PERSON_INS || '',
        web: process.env.NEXT_PUBLIC_APP_PERSON_web || '',
      });
    }
  }, []);

  const appPerson = useMemo(() => {
    const { chinese, english, email, instagram, web } = personData;
    const currentYear = new Date().getFullYear();
    
    const baseData = {
      name: chinese,
      englishName: english,
      fullName: `${chinese} ${english}`,
      fullNameChinese: chinese,
      fullNameEnglish: english,
      displayName: `${chinese} ${english}`,
      shortName: chinese,
      appName: `${chinese}`,
      appNameEnglish: `${english}`,
      appTitle: `${chinese} ${english}`,
      email: email,
      web: web,
      social: {
        instagram: instagram
      },
      copyright: `© ${currentYear} ${chinese} ${english}. All rights reserved.`,
      copyrightChinese: `© ${currentYear} ${chinese}. 保留所有权利。`,
    };

    switch (language) {
      case 'en':
        return {
          ...baseData,
          displayName: english,
          shortName: english,
          appName: `${english}`,
          appTitle: `${english}`,
          copyright: `© ${currentYear} ${english}. All rights reserved.`
        };
      case 'cn':
        return {
          ...baseData,
          displayName: chinese,
          shortName: chinese,
          appName: `${chinese}`,
          appTitle: `${chinese}`,
          copyright: `© ${currentYear} ${chinese}. 保留所有权利。`
        };
      default:
        return baseData;
    }
  }, [personData, language]);

  const getNameByLanguage = useCallback((lang) => {
    const { chinese, english } = personData;
    
    switch (lang) {
      case 'en':
        return english;
      case 'cn':
        return chinese;
      default:
        return `${chinese} ${english}`;
    }
  }, [personData]);

  const getAppNameByLanguage = useCallback((lang) => {
    const { chinese, english } = personData;
    
    switch (lang) {
      case 'en':
        return `${english} App`;
      case 'cn':
        return `${chinese} App`;
      default:
        return `${chinese} ${english}`;
    }
  }, [personData]);

  return {
    ...appPerson,
    getNameByLanguage,
    getAppNameByLanguage,
    raw: personData
  };
};


export default useAppTitle;
