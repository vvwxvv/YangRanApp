
import { getRandomSample } from '@/utils/getRandomSample';


/**
 * Get random images using existing getRandomSample util
 */
export const getRandomImages = (filteredImages, max) =>
  getRandomSample(filteredImages, max);

