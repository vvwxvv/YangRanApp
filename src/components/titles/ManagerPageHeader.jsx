import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export const ManagerPageHeader = ({ title, onGoBack, fontStyle, children }) => {
  return (
    <Paper elevation={0} sx={{ 
      mb: 3, 
      p: 2, 
      backgroundColor: 'var(--background-primary, #fff)', 
      borderRadius: '12px', 
      border: '1px solid var(--border-light, #eee)' 
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
        <IconButton onClick={onGoBack} sx={{ mr: 2, color: 'var(--text-primary, #000)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{
            fontFamily: titleFontFamily,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            mb: 2,
            fontSize: '1.25rem',
            lineHeight: '1.3',
            textAlign: 'center',
            color: themeColors.text,
            backgroundColor: 'transparent !important',
            background: 'transparent !important',
            boxShadow: 'none !important',
            border: 'none !important',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', height: '2px', backgroundColor: 'var(--text-primary, #000)', mt: 1, mb: '20px', borderRadius: 1 }} />
      {children}
    </Paper>
  );
};
