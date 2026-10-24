// Utility functions for working with the entity "type" option lists
// (defaults live in @/utils/siteMetaDefaults; meta.formTypes mirrors the
// artwork / exhibition / fair lists for the manager).
// This file provides type-specific utilities and re-exports from formOptionsUtils

import { FORM_TYPE_OPTIONS as formTypesData } from '@/utils/siteMetaDefaults';
import {
  getFormTypes,
  getFormTypeByValue,
  getTypeOptions,
  languageOptions,
  webTypes
} from '@/components/forms/utils/formOptionsUtils';

// Export constants and functions
export const artworkTypes = formTypesData.artwork || [];
export const imageTypes = formTypesData.image || [];
export const videoTypes = formTypesData.video || [];
export const eventTypes = formTypesData.event || [];
export const aboutTypes = formTypesData.about || [];
export const formTypes = {
  artwork: artworkTypes,
  image: imageTypes,
  video: videoTypes,
  event: eventTypes,
  about: aboutTypes,
  web: webTypes,
  writing: formTypesData.writing || []
};

export const getSortedArtworkTypes = (language = 'en') => {
  const types = [...artworkTypes];
  types.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  return types.map(type => ({
    id: type.id,
    value: type.value || type.label_en,
    label: language === 'cn' ? (type.label_cn || type.label_en) : type.label_en,
    priority: type.priority
  }));
};

export const getFormTypeOptions = (entityType, language = 'en') => {
  return getTypeOptions(entityType, language);
};

// Re-export from formOptionsUtils
export {
  getFormTypes,
  getFormTypeByValue,
  getTypeOptions,
  languageOptions,
  webTypes
};

export default {
  artworkTypes,
  imageTypes,
  videoTypes,
  eventTypes,
  aboutTypes,
  formTypes,
  getSortedArtworkTypes,
  getFormTypeOptions,
  getFormTypes,
  getFormTypeByValue,
  getTypeOptions,
  languageOptions,
  webTypes
};