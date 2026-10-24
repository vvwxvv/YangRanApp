// VideoEditForm.jsx - Using exact same label logic as WebEditForm
"use client";
import React, { useContext } from "react";
import { Divider, Grid, Box, Typography } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import VideoFormSection from "@/components/forms/sections/VideoFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import OrderSelector from "@/components/forms/selectors/OrderSelector";
import { videoSchema } from "@/schemas/video_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

/* ----------  hard-coded replacements for videoConfig  ---------- */
const API_ENDPOINT = "/api/video";

/* ----------  labels  ---------- */
const titles = { en: "Video", cn: "视频" };

/* ----------  default-values factory  ---------- */
const getDefaultValues = (item, isCn) => {
  console.log('VideoEditForm: Creating default values for item:', item);
  
  const defaultValues = {
    video_url: item?.video_url || "",
    cover_img_url: item?.cover_img_url || "",
    tag_en: item?.tag_en || "",
    tag_cn: item?.tag_cn || "",
    type: item?.type || "",
    caption_en: item?.caption_en || "",
    caption_cn: item?.caption_cn || "",
    order: String(item?.order ?? ""),
  };
  
  console.log('VideoEditForm: Default values created:', defaultValues);
  return defaultValues;
};

/* ----------  component  ---------- */
export default function VideoEditForm({ item }) {
  // Get isCn from LanguageContext EXACTLY like WebEditForm does
  const { isCn } = useContext(LanguageContext);
  
  console.log('VideoEditForm: Rendering with item:', item, 'isCn:', isCn);
  
  // Memoize the default values function to prevent excessive re-renders
  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );
  
  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={videoSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('VideoEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('VideoEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        // Use isCn from LanguageContext, not from EditFormShell
        console.log('VideoEditForm: Inside render, isCn:', isCn);
        
        const formErrors = form.formState.errors;
        console.log('VideoEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
          errorDetails: Object.keys(formErrors).length > 0 ? 
            Object.entries(formErrors).map(([key, error]) => ({
              field: key,
              message: error.message,
              type: error.type,
              value: form.getValues(key)
            })) : 'No errors'
        });
        
        return (
          <>
            {/* Video file upload - dashed box */}
            <Box
              sx={{
                border: '1px dashed #ddd',
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  color: '#666',
                }}
              >
                {isCn ? '视频文件' : 'Video File'}
              </Typography>
              <ImageUploadSection
                title={IMAGE_UPLOAD_CONFIGS.video?.title || (isCn ? "视频" : "Video")}
                imgUrl={form.watch("video_url")}
                onUploadSuccess={(url) => form.setValue("video_url", url)}
                onUploadError={(err) => console.log(err)}
                disabled={disabled}
                getLabel={getLabel}
                register={() => ({})}
                fieldName="video_url"
                form={form}
                colors={colors}
              />
            </Box>

            {/* Cover image upload - dashed box */}
            <Box
              sx={{
                border: '1px dashed #ddd',
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  color: '#666',
                }}
              >
                {isCn ? '封面图片' : 'Cover Image'}
              </Typography>
              <ImageUploadSection
                title={IMAGE_UPLOAD_CONFIGS.videoCover?.title || (isCn ? "封面图片" : "Cover Image")}
                imgUrl={form.watch("cover_img_url")}
                onUploadSuccess={(url) => form.setValue("cover_img_url", url)}
                onUploadError={(err) => console.log(err)}
                disabled={disabled}
                getLabel={getLabel}
                register={() => ({})}
                fieldName="cover_img_url"
                form={form}
                colors={colors}
              />
            </Box>

            <VideoFormSection 
              form={form} 
              disabled={disabled} 
              colors={colors}
              onFieldChange={() => {}}
            />

            <Divider sx={{ my: 3 }} />

            {/* Mark and Order selectors - Use direct Chinese labels like WebEditForm */}
            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <OrderSelector
                  label={getLabel("order") || (isCn ? "排序" : "Order")}
                  form={form}
                  disabled={disabled}
                  getLabel={() => isCn ? "排序" : "Order"} // Direct Chinese labels like WebEditForm
                  onFieldChange={() => {}}
                  colors={colors}
                  isCn={isCn}
                />
              </Grid>
            </Grid>

          </>
        );
      }}
    </EditFormShell>
  );
}
