

/**
 * Filter images that have valid language content and img_url
 */
export const filterImagesByLanguage = (images, isCn) => {
  if (!images?.length) return [];
  // Use existing filterByLanguage if it handles tag/caption fields,
  // otherwise fall back to manual filter
  return images.filter((img) => {
    const hasLang = isCn
      ? img.tag_cn || img.caption_cn
      : img.tag_en || img.caption_en;
    return hasLang && img.img_url;
  });
};

