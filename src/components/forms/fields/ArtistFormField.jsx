// ArtistField.jsx
import { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from 'lucide-react';          // lucide-react icon
import { Box, Typography } from '@mui/material';
import { getFormArtistValue, shouldHideArtistField } from '@/utils/artistUtils';

// ---------- component ----------
export const ArtistFormField = ({ language = 'EN' }) => {
  const { control, setValue } = useFormContext();
  const hideArtist = shouldHideArtistField();

  // Artist sites: fill `artist` from APP_PERSON_EN / APP_PERSON_CN.
  useEffect(() => {
    if (!hideArtist) return;
    const defaultVal = getFormArtistValue('', language);
    if (defaultVal) setValue('artist', defaultVal, { shouldDirty: false });
  }, [hideArtist, language, setValue]);

  // Hide the input completely on Artist sites.
  if (hideArtist) return null;

  // normal input otherwise
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" mb={1}>
        Artist
      </Typography>
      <Controller
        name="artist"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Enter artist name"
            className="w-full"
          />
        )}
      />
    </Box>
  );
};