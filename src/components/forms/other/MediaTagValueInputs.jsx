import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { useController } from 'react-hook-form';
import TagSelector from '@/components/forms/selectors/TagSelector';

/* ── plain free text bound to RHF ────────────────────────────────────────── */
const PlainTagInput = ({ name, label, control, disabled, placeholder, onFieldChange }) => {
  const { field } = useController({ name, control, defaultValue: '' });
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography sx={{
        fontSize: '13px',
        color: '#555',
        minWidth: '90px',
        flexShrink: 0,
      }}>
        {label}
      </Typography>
      <TextField
        {...field}
        disabled={disabled}
        placeholder={placeholder}
        size="small"
        fullWidth
        onChange={(e) => { field.onChange(e); onFieldChange?.(name, e.target.value); }}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '13px',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
            '& fieldset': { borderColor: '#ddd' },
            '&:hover fieldset': { borderColor: '#999' },
            '&.Mui-focused fieldset': { borderColor: '#000', borderWidth: '1.5px' },
          },
          '& input': { color: '#000', py: '8.5px' },
        }}
      />
    </Box>
  );
};

/* ── dropdown selector row ────────────────────────────────────────────────── */
const DropdownTagRow = ({
  name, label, control, options, disabled,
  placeholder, onChange, tagSource, isCn, typeLabels,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
    <Typography sx={{
      fontSize: '13px',
      color: '#555',
      minWidth: '90px',
      flexShrink: 0,
      pt: 1.2,
    }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1 }}>
      <TagSelector
        name={name}
        label=""
        control={control}
        options={options}
        disabled={disabled}
        allowCustomInput
        multiple={false}
        placeholder={placeholder}
        onChange={onChange}
        tagSource={tagSource}
        isCn={isCn}
        typeLabels={typeLabels}
      />
    </Box>
  </Box>
);

/* ── divider with label ───────────────────────────────────────────────────── */
const SectionDivider = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Box sx={{ flex: 1, height: '1px', background: '#ebebeb' }} />
    <Typography sx={{ fontSize: '11px', color: '#bbb', whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, height: '1px', background: '#ebebeb' }} />
  </Box>
);

/* ── hint text ────────────────────────────────────────────────────────────── */
const HintText = ({ text }) => (
  <Typography sx={{
    fontSize: '11px',
    color: '#bbb',
    fontStyle: 'italic',
    pl: '106px',
  }}>
    {text}
  </Typography>
);

/* ══════════════════════════════════════════════════════════════════════════
   TagValueInputs  — renders either free-text (None) or dropdowns (source)
═══════════════════════════════════════════════════════════════════════════ */
const MediaTagValueInputs = ({
  tagSource,
  control,
  disabled,
  isCn,
  tagOptionsEN,
  tagOptionsCN,
  sourceTypeLabel,
  typeLabels,
  onFieldChange,
}) => {
  const isNone = tagSource === 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

      <SectionDivider label={isCn ? '标签值' : 'Tag Values'} />

      {isNone ? (
        <>
          <PlainTagInput
            name="tag_en"
            label={isCn ? '英文标签' : 'English Tag'}
            control={control}
            disabled={disabled}
            placeholder={isCn ? '输入英文标签' : 'Type English tag'}
            onFieldChange={onFieldChange}
          />
          <PlainTagInput
            name="tag_cn"
            label={isCn ? '中文标签' : 'Chinese Tag'}
            control={control}
            disabled={disabled}
            placeholder={isCn ? '输入中文标签' : 'Type Chinese tag'}
            onFieldChange={onFieldChange}
          />
          <HintText text={
            isCn
              ? '当前为自定义标签模式 · 选择来源后可从列表选取'
              : 'Custom tag mode · Choose a source above to pick from a list'
          } />
        </>
      ) : (
        <>
          <DropdownTagRow
            name="tag_en"
            label={isCn ? '英文' : 'English'}
            control={control}
            options={tagOptionsEN}
            disabled={disabled}
            placeholder={
              tagOptionsEN.length === 0
                ? (isCn ? '暂无条目，可手动输入' : 'No items, type custom')
                : (isCn ? '选择或输入标签' : 'Select or type a tag')
            }
            onChange={(v) => onFieldChange?.('tag_en', v)}
            tagSource={sourceTypeLabel}
            isCn={isCn}
            typeLabels={typeLabels}
          />
          <DropdownTagRow
            name="tag_cn"
            label={isCn ? '中文' : 'Chinese'}
            control={control}
            options={tagOptionsCN}
            disabled={disabled}
            placeholder={
              tagOptionsCN.length === 0
                ? (isCn ? '暂无条目，可手动输入' : 'No items, type custom')
                : (isCn ? '选择或输入标签' : 'Select or type a tag')
            }
            onChange={(v) => onFieldChange?.('tag_cn', v)}
            tagSource={sourceTypeLabel}
            isCn={isCn}
            typeLabels={typeLabels}
          />
          <HintText text={
            isCn
              ? '可从列表选择，或直接输入自定义标签'
              : 'Pick from list or type a custom value'
          } />
        </>
      )}
    </Box>
  );
};

export default MediaTagValueInputs;