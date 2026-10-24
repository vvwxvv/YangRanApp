/**
 * AlphabetPaginationBar Component
 * Reusable alphabet letter navigation bar for filtering data
 * Added throttling via useAsyncAction to prevent rapid letter changes.
 */
import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  buildLetterList,
  ALPHABET_FILTER_VALUES,
} from '../../utils/alphabetPaginationUtils';
import { useAsyncAction } from '@/hooks/useAsyncAction'; // 导入自定义 hook

const AlphabetPaginationBar = ({
  data = [],
  field = 'tag_en',
  selectedLetter = ALPHABET_FILTER_VALUES.ALL,
  onLetterChange,
  isCn = false,
  labelFontStyle = {},
  showCounts = true,
  disabled = false,
  compact = false,
  throttleMs = 300, // 新增：节流时间（毫秒），0 表示禁用节流
}) => {
  // Build letter list with counts
  const letterList = useMemo(() => buildLetterList(data, field), [data, field]);

  // ── 使用 useAsyncAction 包装 onLetterChange ──
  const performChange = useCallback(
    async (letter) => {
      // 如果 disabled，不执行
      if (disabled) return;
      // 调用父组件传入的回调
      if (onLetterChange) {
        await onLetterChange(letter);
      }
    },
    [onLetterChange, disabled]
  );

  const { execute, isExecuting } = useAsyncAction(performChange, {
    throttleMs: throttleMs > 0 ? throttleMs : 0,
    onError: (err) => console.warn('AlphabetPaginationBar change error:', err),
  });

  // Handle letter click
  const handleClick = useCallback(
    (letter) => {
      if (disabled || isExecuting) return;
      // 如果有节流则使用 execute，否则直接调用（但 execute 本身内部也会根据 throttleMs 判断）
      execute(letter);
    },
    [disabled, isExecuting, execute]
  );

  // ── Styles ──
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: compact ? '4px' : '6px',
    alignItems: 'center',
    padding: compact ? '4px 0' : '6px 0',
    marginBottom: 0,
  };

  const buttonBaseStyle = {
    minWidth: compact ? '28px' : '32px',
    height: compact ? '28px' : '32px',
    padding: compact ? '2px 4px' : '4px 8px',
    fontSize: compact ? '12px' : '13px',
    fontWeight: 500,
    borderRadius: '8px',
    textTransform: 'none',
    ...labelFontStyle,
  };

  return (
    <Accordion
      disableGutters
      square
      elevation={0}
      sx={{
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, opacity: 0.55 }} />}
        aria-controls="alphabet-pagination-content"
        id="alphabet-pagination-header"
        sx={{
          minHeight: 0,
          padding: '2px 2px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '& .MuiAccordionSummary-content': { margin: '4px 0' },
        }}
      >
        <Typography
          sx={{
            marginLeft: '2px',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {isCn ? '按字母排序' : 'Order by Alphabet'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Typography sx={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginRight: '6px' }}>
            {selectedLetter !== ALPHABET_FILTER_VALUES.ALL
              ? `${isCn ? '已选' : 'Selected'}: ${
                  selectedLetter === ALPHABET_FILTER_VALUES.OTHER
                    ? isCn ? '其他' : 'Other'
                    : selectedLetter
                } (${letterList.find((item) => item.value === selectedLetter)?.count || 0})`
              : `${isCn ? '全部' : 'All'} (${data.length})`}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: '10px 2px 2px' }}>
        <Box sx={containerStyle}>
          {letterList.map((letterItem) => {
            const isSelected = selectedLetter === letterItem.value;
            const isAvailable = letterItem.available;
            const isAll = letterItem.value === ALPHABET_FILTER_VALUES.ALL;
            // 如果组件被禁用 或 (非全部且不可用) 则禁用按钮
            const isButtonDisabled =
              disabled || (!isAvailable && !isAll) || isExecuting;

            // 按钮样式
            const variant = isSelected ? 'contained' : 'outlined';
            const color = isSelected ? 'primary' : 'inherit';

            const buttonElement = (
              <Button
                variant={variant}
                color={color}
                onClick={() => handleClick(letterItem.value)}
                disabled={isButtonDisabled}
                sx={{
                  ...buttonBaseStyle,
                  opacity: (!isAvailable && !isAll) || isExecuting ? 0.35 : 1,
                  backgroundColor: isSelected ? 'rgba(0,0,0,0.06)' : 'transparent',
                  color: isSelected
                    ? '#000'
                    : isAvailable || isAll
                    ? '#000'
                    : '#ccc',
                  border: '1px solid',
                  borderColor: isSelected
                    ? '#000'
                    : isAvailable || isAll
                    ? 'rgba(0,0,0,0.14)'
                    : 'rgba(0,0,0,0.06)',
                  fontWeight: isSelected ? 700 : 500,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderColor: '#000',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'transparent',
                    color: '#ccc',
                    borderColor: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                {isCn ? letterItem.labelCn : letterItem.label}
                {showCounts && letterItem.count > 0 && !isAll && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.5,
                      fontSize: '10px',
                      opacity: 0.7,
                    }}
                  >
                    ({letterItem.count})
                  </Typography>
                )}
              </Button>
            );

            // Tooltip 包装（如果计数 > 0）
            if (showCounts && letterItem.count > 0) {
              return (
                <Tooltip
                  key={letterItem.value}
                  title={`${letterItem.count} ${isCn ? '条记录' : 'items'}`}
                  arrow
                  placement="top"
                >
                  <span style={{ display: 'inline-block' }}>
                    {buttonElement}
                  </span>
                </Tooltip>
              );
            }

            return <React.Fragment key={letterItem.value}>{buttonElement}</React.Fragment>;
          })}

          {/* Selected letter indicator */}
          {selectedLetter !== ALPHABET_FILTER_VALUES.ALL && (
            <Chip
              label={
                isCn
                  ? `已选: ${
                      selectedLetter === ALPHABET_FILTER_VALUES.OTHER
                        ? '其他'
                        : selectedLetter
                    }`
                  : `Selected: ${selectedLetter}`
              }
              onDelete={
                disabled || isExecuting
                  ? undefined
                  : () => handleClick(ALPHABET_FILTER_VALUES.ALL)
              }
              size="small"
              sx={{
                ml: 1,
                backgroundColor: '#f5f5f5',
                '& .MuiChip-label': labelFontStyle,
              }}
            />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AlphabetPaginationBar;