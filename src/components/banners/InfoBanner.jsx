import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Generic info banner for any situation.
 * @param {Object} props
 * @param {string|React.ReactNode} props.title - Main heading (can be plain text or JSX)
 * @param {string|React.ReactNode|Array<string|React.ReactNode>} props.description - Single or multiple paragraphs
 * @param {React.ReactNode} [props.icon] - Custom icon (defaults to InfoOutlinedIcon)
 * @param {object} [props.sx] - Additional MUI sx styles for the outer Box
 * @param {string} [props.ariaLabel] - Accessibility label (defaults to "Information banner")
 */
const InfoBanner = memo(({
  title,
  description,
  icon = <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#000', mt: '2px', flexShrink: 0 }} aria-hidden="true" />,
  sx = {},
  ariaLabel = 'Information banner',
}) => {
  // Convert description to an array for consistent rendering
  const descriptionArray = Array.isArray(description) ? description : [description];

  return (
    <Box
      sx={{
        border: '1.5px solid #000',
        borderRadius: '8px',
        p: 2,
        bgcolor: '#fafafa',
        display: 'flex',
        gap: 1.5,
        alignItems: 'flex-start',
        ...sx,
      }}
      role="note"
      aria-label={ariaLabel}
    >
      {icon}
      <Box>
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#000',
            mb: 0.3,
            lineHeight: 1.5,
          }}
        >
          {title}
        </Typography>
        {descriptionArray.map((paragraph, idx) => (
          <Typography
            key={idx}
            sx={{
              fontSize: '12px',
              color: '#444',
              lineHeight: 1.7,
              mb: idx === descriptionArray.length - 1 ? 0 : 1,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
});

InfoBanner.displayName = 'InfoBanner';

export default InfoBanner;