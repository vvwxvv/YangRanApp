import React from 'react';
import { Box, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

/* ── single source button ─────────────────────────────────────────────────── */
const SourceButton = ({ label, active, onClick, disabled }) => (
  <Box
    component="button"
    type="button"
    disabled={disabled}
    onClick={() => !disabled && onClick()}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2.2,
      py: 0.8,
      border: '1.5px solid',
      borderColor: active ? '#000' : '#d0d0d0',
      borderRadius: '6px',
      background: '#fff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      outline: 'none',
      userSelect: 'none',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease',
      '&:hover': !disabled ? {
        borderColor: '#000',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        transform: 'translateY(-1px)',
      } : {},
      '&:active': !disabled ? {
        transform: 'translateY(0)',
        boxShadow: 'none',
      } : {},
    }}
  >
    <Typography sx={{
      fontSize: '12px',
      fontWeight: active ? 600 : 400,
      color: '#000',
      letterSpacing: '0.2px',
      lineHeight: 1,
      textDecoration: active ? 'underline' : 'none',
      textUnderlineOffset: '3px',
      textDecorationThickness: '1.5px',
      transition: 'text-decoration 0.15s, font-weight 0.15s',
    }}>
      {label}
    </Typography>
  </Box>
);

/* ── step flow strip ──────────────────────────────────────────────────────── */
const StepStrip = ({ isCn, tagSource }) => {
  const steps = isCn
    ? ['① 选择来源类型', '② 选择具体条目', '③ 图片自动归入该条目']
    : ['① Pick a source type', '② Choose the item', '③ Image appears in that item'];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      <ImageOutlinedIcon sx={{ fontSize: '13px', color: '#aaa' }} />
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <Typography sx={{
            fontSize: '11px',
            color: i === 1 && tagSource > 0 ? '#000' : '#aaa',
            fontWeight: i === 1 && tagSource > 0 ? 600 : 400,
            transition: 'color 0.2s, font-weight 0.2s',
          }}>
            {step}
          </Typography>
          {i < steps.length - 1 && (
            <Box sx={{ width: 14, height: '1px', background: '#d0d0d0', flexShrink: 0 }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

/* ── main export ──────────────────────────────────────────────────────────── */
const MediaTagSourceSelector = ({
  tagSource,
  availableSources,
  onChange,
  disabled,
  isCn,
}) => (
  <Box sx={{
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    p: 2.5,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }}>

    {/* Label + buttons row */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography sx={{
        fontSize: '13px',
        fontWeight: 500,
        color: '#000',
        minWidth: '90px',
        flexShrink: 0,
        letterSpacing: '0.1px',
      }}>
        {isCn ? '标签来源' : 'Tag Source'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {availableSources.map((src) => (
          <SourceButton
            key={src.value}
            label={src.label}
            active={tagSource === src.value}
            disabled={disabled}
            onClick={() => onChange(src.value)}
          />
        ))}
      </Box>
    </Box>

    {/* Click hint sentence */}
    <Typography sx={{
      fontSize: '11px',
      color: '#bbb',
      pl: '106px',
      fontStyle: 'italic',
    }}>
      {isCn
        ? '点击按钮切换来源类型，选中后从下方选择具体条目'
        : 'Click a button to switch source type, then select the item below'}
    </Typography>

    {/* Step strip */}
    <Box sx={{ pl: '106px' }}>
      <StepStrip isCn={isCn} tagSource={tagSource} />
    </Box>
  </Box>
);

export default MediaTagSourceSelector;