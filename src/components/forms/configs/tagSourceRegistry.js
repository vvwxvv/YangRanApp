// Add a new entry here whenever a new linkable schema (Series, Writing, etc.)
// should be selectable as a "Tag Source". Nothing else needs to change —
// ImageFormSection reads this list and reacts to whatever data is passed in.
export const TAG_SOURCE_REGISTRY = [
    { value: 0, key: 'none',    dataKey: null,     label: { en: 'None',    cn: '无' } },
    { value: 1, key: 'artwork', dataKey: 'artwork', label: { en: 'Artwork', cn: '艺术品' } },
    { value: 2, key: 'event',   dataKey: 'event',   label: { en: 'Event',   cn: '活动' } },
    { value: 3, key: 'about',   dataKey: 'about',   label: { en: 'About',   cn: '关于' } },
    { value: 4, key: 'series',  dataKey: 'series',  label: { en: 'Series',  cn: '系列' } },
    { value: 5, key: 'project', dataKey: 'project', label: { en: 'Project', cn: '项目' } },
  ];
  
  export const getTagSourceByValue = (value) =>
    TAG_SOURCE_REGISTRY.find((s) => s.value === Number(value)) || TAG_SOURCE_REGISTRY[0];
  
  export const getTagSourceLabel = (value, isCn) => {
    const src = getTagSourceByValue(value);
    return isCn ? src.label.cn : src.label.en;
  };