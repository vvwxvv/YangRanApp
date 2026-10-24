// filepath: d:\WebsiteBuildingStudio\WangXinApp\src\utils\animationVariants.js
export const ANIMATION_VARIANTS = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    },
    item: {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
      }
    },
    fadeIn: {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 }
      }
    },
    bar: {
      hidden: { width: 0 },
      visible: (percentage) => ({
        width: `${percentage}%`,
        transition: { duration: 1, ease: 'easeOut', delay: 0.3 }
      })
    }
  };