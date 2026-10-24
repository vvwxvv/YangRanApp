import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveFontFamily } from '@/lib/typography';
import { useAsyncAction } from '@/hooks/useAsyncAction'; // 导入自定义 hook

/**
 * FilterBarDropdown
 * A reusable, flexible dropdown or horizontal bar for navigation/filtering.
 * Updated to match TitleTextNavSimpleStyle UI style with separate CN/EN font support.
 * Integrated with useAsyncAction for throttling option changes.
 */
const FilterBarDropdown = ({
  label = '',
  options = [],
  value = '',
  onChange,
  mode = 'dropdown',
  className = '',
  renderOption,
  highlightSelected = true,
  fullWidth = false,
  bgColor = '',
  fontColor = '',
  dropdownBgColor = '',
  dropdownFontColor = '',
  filters = [],
  dropdownFullWindow = false,
  throttleMs = 800, // 新增：节流时间，0 表示禁用
}) => {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [buttonRect, setButtonRect] = useState(null);
  const buttonRef = useRef(null);

  // Font families for CN and EN, read straight from the typography scale
  const fontFamilyCn = resolveFontFamily('bodyText', 'zh');
  const fontFamilyEn = resolveFontFamily('bodyText', 'en');

  // Use filters if provided, otherwise use single filter props
  const isMultiFilter = filters && filters.length > 0;
  const filterData = isMultiFilter ? filters : [{ label, options, value, onChange }];

  // Update button position when dropdown opens
  useEffect(() => {
    if (open && buttonRef.current && dropdownFullWindow) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [open, dropdownFullWindow]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
        setOpenIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation variants matching TitleTextNavSimpleStyle style
  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.1 }
    }
  };

  // Helper function to render label with separate fonts
  const renderLabelWithFonts = (opt) => {
    if (typeof opt === 'string') {
      return <span style={{ fontFamily: fontFamilyEn }}>{opt}</span>;
    }

    const labelCn = opt.label_cn || '';
    const labelEn = opt.label_en || opt.label || '';

    if (labelCn && labelEn) {
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: fontFamilyCn }}>{labelCn}</span>
          <span style={{ fontFamily: fontFamilyEn }}> | </span>
          <span style={{ fontFamily: fontFamilyEn }}>{labelEn}</span>
        </span>
      );
    }

    if (labelCn) {
      return <span style={{ fontFamily: fontFamilyCn }}>{labelCn}</span>;
    }

    return <span style={{ fontFamily: fontFamilyEn }}>{labelEn}</span>;
  };

  // ── 使用 useAsyncAction 包装 change 回调 ──
  // 注意：由于每个选项点击都可能触发 onChange，我们创建一个统一的异步执行函数，
  // 它会调用对应的 filter.onChange，并由 useAsyncAction 控制节流。
  // 为了支持多个过滤器，执行函数接收 filterIndex 和 value。
  const asyncChange = useCallback(async (filterIndex, newValue) => {
    const filter = filterData[filterIndex];
    if (filter && filter.onChange) {
      // 如果 onChange 是异步的，可以等待；否则直接调用
      const result = filter.onChange(newValue);
      // 如果返回 Promise，则等待（确保 onSuccess/onError 正确触发）
      if (result && typeof result.then === 'function') {
        await result;
      }
    }
  }, [filterData]);

  const { execute: executeChange, isExecuting } = useAsyncAction(asyncChange, {
    throttleMs: throttleMs > 0 ? throttleMs : 0, // 若 throttleMs 为 0，则不节流（直接执行）
    onSuccess: () => {
      // 可选的全局成功回调（留空）
    },
    onError: (err) => {
      console.warn('Filter change error:', err);
    },
  });

  // 处理选项点击：调用 executeChange
  const handleOptionClick = useCallback((filterIndex, value) => {
    if (throttleMs === 0) {
      // 无节流时直接调用
      asyncChange(filterIndex, value);
    } else {
      executeChange(filterIndex, value);
    }
    // 关闭下拉
    if (mode === 'dropdown') {
      if (isMultiFilter) {
        setOpenIndex(-1);
      } else {
        setOpen(false);
      }
    }
  }, [executeChange, asyncChange, throttleMs, mode, isMultiFilter]);

  // ── 原有渲染逻辑 ──

  // Single dropdown mode
  if (mode === 'dropdown' && !isMultiFilter) {
    const firstFilter = filterData[0] || {};
    const normalizedOptions = (firstFilter.options || []).map(opt =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === firstFilter.value);
    const defaultLabel = { label_cn: '全部', label_en: 'All' };

    return (
      <div className={`flex items-center ${fullWidth ? 'w-full' : ''} ${className}`}>
        <div className={`relative ${fullWidth ? 'flex-1' : 'min-w-0'}`} ref={buttonRef} style={{ minWidth: '180px' }}>
          <motion.button
            className="px-3 py-2 flex items-center gap-2 focus:outline-none w-full transition-colors duration-100"
            style={{
              backgroundColor: bgColor || 'transparent',
              color: fontColor || 'var(--text-primary, #000000)',
              border: 'none',
              fontSize: '12px',
              fontWeight: 'normal',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
            onClick={() => setOpen(v => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            type="button"
            whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
          >
            <span style={{ 
              color: fontColor || 'var(--text-primary, #000000)',
              fontSize: '12px',
            }}>
              {renderLabelWithFonts(selectedOption || defaultLabel)}
            </span>
            <motion.svg 
              className="w-3 h-3 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div 
                className="absolute left-0 mt-1 w-full rounded shadow-lg z-50 overflow-hidden"
                style={{
                  backgroundColor: dropdownBgColor || 'white',
                  color: dropdownFontColor || '#000000',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                }}
                variants={dropdownVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {normalizedOptions.map((opt, index) => {
                  const selected = firstFilter.value === opt.value;
                  const isHovered = hoveredOption === opt.value;
                  
                  return (
                    <motion.button
                      key={`${opt.value}-${index}`}
                      className="block w-full text-left transition-colors duration-100"
                      style={{
                        backgroundColor: selected && highlightSelected 
                          ? '#f0f0f0'
                          : isHovered ? '#f5f5f5' : (dropdownBgColor || 'white'),
                        color: dropdownFontColor || '#000000',
                        fontSize: '12px',
                        fontWeight: selected && highlightSelected ? 'bold' : 'normal',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                        letterSpacing: isHovered ? '1px' : 'normal',
                        textDecoration: isHovered && !selected ? 'underline' : 'none',
                        transition: 'all 0.1s ease',
                      }}
                      onClick={() => handleOptionClick(0, opt.value)}
                      onMouseEnter={() => setHoveredOption(opt.value)}
                      onMouseLeave={() => setHoveredOption(null)}
                      role="option"
                      aria-selected={selected}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                    >
                      <span style={{ 
                        color: dropdownFontColor || '#000000',
                        fontSize: '12px',
                      }}>
                        {renderOption ? renderOption(opt, selected) : renderLabelWithFonts(opt)}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Multi-dropdown mode
  if (mode === 'dropdown' && isMultiFilter) {
    return (
      <div className={`flex items-center ${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <span style={{ 
            color: fontColor || 'var(--text-primary, #000000)',
            fontSize: '12px',
            marginRight: '8px',
          }}>
            {label}:
          </span>
        )}
        
        <div className="flex items-center gap-2">
          {filterData.map((filter, idx) => {
            const normalizedOptions = (filter.options || []).map(opt => 
              typeof opt === 'string' ? { value: opt, label: opt } : opt
            );
            const selectedOption = normalizedOptions.find(opt => opt.value === filter.value);
            const defaultLabel = { label_cn: '全部', label_en: 'All' };
            
            return (
              <React.Fragment key={`multi-dropdown-${idx}`}>
                {idx > 0 && (
                  <span style={{ 
                    color: 'var(--text-primary, #000000)',
                    fontSize: '12px',
                    opacity: 0.5,
                  }}>
                    |
                  </span>
                )}
                <div className="relative" ref={idx === 0 ? buttonRef : null} style={{ minWidth: '180px' }}>
                  <motion.button
                    className="px-3 py-2 flex items-center gap-2 focus:outline-none w-full transition-colors duration-100"
                    style={{
                      backgroundColor: 'transparent',
                      color: fontColor || 'var(--text-primary, #000000)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 'normal',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                    aria-haspopup="listbox"
                    aria-expanded={openIndex === idx}
                    type="button"
                    whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                  >
                    {filter.label && <span style={{ fontSize: '12px' }}>{filter.label}:</span>}
                    <span style={{ fontSize: '12px' }}>
                      {renderLabelWithFonts(selectedOption || defaultLabel)}
                    </span>
                    <motion.svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ rotate: openIndex === idx ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        className="absolute left-0 mt-1 w-full min-w-max rounded shadow-lg z-50 overflow-hidden"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                          backgroundColor: dropdownBgColor || 'white',
                          color: dropdownFontColor || '#000000',
                          boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                        }}
                      >
                        {normalizedOptions.map((opt, optionIdx) => {
                          const selected = filter.value === opt.value;
                          const isHovered = hoveredOption === `dropdown-${idx}-${opt.value}`;
                          
                          return (
                            <motion.button
                              key={`${idx}-${opt.value}-${optionIdx}`}
                              className="block w-full text-left transition-colors duration-100"
                              style={{
                                backgroundColor: selected && highlightSelected 
                                  ? '#f0f0f0'
                                  : isHovered ? '#f5f5f5' : (dropdownBgColor || 'white'),
                                color: dropdownFontColor || '#000000',
                                fontSize: '12px',
                                fontWeight: selected && highlightSelected ? 'bold' : 'normal',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                                letterSpacing: isHovered ? '1px' : 'normal',
                                textDecoration: isHovered && !selected ? 'underline' : 'none',
                                transition: 'all 0.1s ease',
                              }}
                              onClick={() => handleOptionClick(idx, opt.value)}
                              onMouseEnter={() => setHoveredOption(`dropdown-${idx}-${opt.value}`)}
                              onMouseLeave={() => setHoveredOption(null)}
                              role="option"
                              aria-selected={selected}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                            >
                              <span style={{ fontSize: '12px' }}>
                                {renderOption ? renderOption(opt, selected) : renderLabelWithFonts(opt)}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Bar mode
  return (
    <div className={`flex flex-wrap gap-2 items-center ${fullWidth ? 'w-full' : ''} ${className}`} 
      style={{
        background: bgColor || undefined,
        color: fontColor || undefined,
        width: fullWidth ? '100%' : undefined,
      }}
    >
      {label && (
        <span style={{ 
          color: fontColor || 'var(--text-primary, #000000)',
          fontSize: '12px',
          marginRight: '8px',
        }}>
          {label}:
        </span>
      )}
      
      {filterData.map((filter, filterIndex) => {
        const normalizedOptions = (filter.options || []).map(opt =>
          typeof opt === 'string' ? { value: opt, label: opt } : opt
        );

        return (
          <React.Fragment key={`filter-${filterIndex}`}>
            {filterIndex > 0 && (
              <span style={{ 
                color: 'var(--text-primary, #000000)',
                fontSize: '12px',
                opacity: 0.5,
                margin: '0 8px',
              }}>
                |
              </span>
            )}

            {filter.label && (
              <span style={{ 
                color: fontColor || 'var(--text-primary, #000000)',
                fontSize: '12px',
                marginRight: '4px',
              }}>
                {filter.label}
              </span>
            )}

            {normalizedOptions.map((opt, optionIndex) => {
              const selected = filter.value === opt.value;
              const isHovered = hoveredOption === `${filterIndex}-${opt.value}`;
              
              return (
                <motion.button
                  key={`${filterIndex}-${opt.value}-${optionIndex}`}
                  className="relative px-3 py-1 transition-colors duration-100 focus:outline-none"
                  style={{
                    backgroundColor: 'transparent',
                    color: fontColor || 'var(--text-primary, #000000)',
                    fontSize: '12px',
                    fontWeight: selected && highlightSelected ? 'bold' : 'normal',
                    border: 'none',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    letterSpacing: isHovered ? '1px' : 'normal',
                    textDecoration: isHovered && !selected ? 'underline' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseEnter={() => setHoveredOption(`${filterIndex}-${opt.value}`)}
                  onMouseLeave={() => setHoveredOption(null)}
                  onClick={() => handleOptionClick(filterIndex, opt.value)}
                  whileTap={{ scale: 0.97, transition: { duration: 0.05 } }}
                >
                  {renderOption ? renderOption(opt, selected) : renderLabelWithFonts(opt)}
                  
                  {selected && (
                    <motion.span
                      className="absolute left-0 right-0 bottom-0 h-0.5"
                      style={{
                        background: fontColor || 'var(--text-primary, #000000)',
                      }}
                      layoutId="underline"
                    />
                  )}
                </motion.button>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FilterBarDropdown;