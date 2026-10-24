// utils/mergeMenus.js
export const mergeMenuEntries = (enArray, cnArray) => {
    const maxLength = Math.max(enArray.length, cnArray.length);
    const merged = [];
  
    for (let i = 0; i < maxLength; i++) {
      const enItem = enArray[i] || {};
      const cnItem = cnArray[i] || {};
  
      // Combine top‑level label
      const combinedLabel = enItem.label && cnItem.label
        ? `${enItem.label} / ${cnItem.label}`
        : enItem.label || cnItem.label;
  
      // Combine dropdown items if both have dropdowns
      let combinedDropdown = null;
      if (enItem.dropdown || cnItem.dropdown) {
        const enDropdown = enItem.dropdown || [];
        const cnDropdown = cnItem.dropdown || [];
        const maxDropdownLen = Math.max(enDropdown.length, cnDropdown.length);
        combinedDropdown = [];
  
        for (let j = 0; j < maxDropdownLen; j++) {
          const enSub = enDropdown[j] || {};
          const cnSub = cnDropdown[j] || {};
          combinedDropdown.push({
            label: enSub.label && cnSub.label
              ? `${enSub.label} / ${cnSub.label}`
              : enSub.label || cnSub.label,
            href: enSub.href || cnSub.href, // assume same href or fallback
          });
        }
      }
  
      merged.push({
        label: combinedLabel,
        href: enItem.href || cnItem.href,
        dropdown: combinedDropdown,
      });
    }
  
    return merged;
  };