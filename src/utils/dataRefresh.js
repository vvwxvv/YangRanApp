// utils/dataRefresh.js
export const triggerDataRefresh = (itemUrl) => {
    // Trigger storage event for cross-tab communication
    localStorage.setItem(`${itemUrl}_updated`, Date.now().toString());
    
    // Trigger custom event for same-tab communication
    window.dispatchEvent(new CustomEvent(`refresh_${itemUrl}`));
    
    console.log(`Triggered data refresh for ${itemUrl}`);
  };
  
  export const useDataRefreshTrigger = () => {
    return triggerDataRefresh;
  };