"use client";

// ================================
// UI CONSTANTS FOR INDEX PAGES
// ================================

export const UI_CONSTANTS = {
  TYPOGRAPHY: {
    fontSize: {
      xs: '10px',
      sm: '12px',
      base: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '20px'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      bolder: '800',
      heavy: '900'
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  LAYOUT: {
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '10px',
      lg: '16px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px'
    },
    margin: {
      section: '-30px',
      filter: '10px',
      filterLeft: '-20px',
      group: '20px'
    },
    container: 'max-w-7xl mx-auto',
    padding: {
      section: 'py-8 px-4 sm:px-6',
      sectionBottom: 'pb-8 px-4 sm:px-6'
    }
  },
  ANIMATIONS: {
    pageHeader: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 }
    }
  }
};

export const COMPONENT_STYLES = {
  filterBar: {
    bgColor: '#ffffff',
    fontColor: '#000000',
    dropdownBgColor: '#ffffff',
    dropdownFontColor: '#000000',
    labelStyle: { 
      marginLeft: UI_CONSTANTS.LAYOUT.margin.filterLeft, 
      fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.base,
      color: '#000000'
    }
  },
  groupLabel: {
    fontWeight: UI_CONSTANTS.TYPOGRAPHY.fontWeight.bolder,
    color: '#ffffff', // Changed from var(--text-primary, #000000) to white for night mode
    fontSize: UI_CONSTANTS.TYPOGRAPHY.fontSize.base
  },
  divider: {
    height: '1px',
    backgroundColor: '#ffffff', // Changed from var(--text-primary, #000000) to white for night mode
    margin: `${UI_CONSTANTS.LAYOUT.spacing.sm} 0`,
    width: '100%'
  },
  groupDivider: {
    height: '1px',
    backgroundColor: '#ffffff', // Changed from var(--text-primary, #000000) to white for night mode
    margin: `${UI_CONSTANTS.LAYOUT.margin.group} 0`,
    width: '100%'
  }
}; 