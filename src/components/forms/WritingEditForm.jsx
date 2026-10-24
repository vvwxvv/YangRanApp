"use client";
import React, { useContext } from "react";
import { Divider} from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import WritingFormSection from "@/components/forms/sections/WritingFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { writingSchema } from "@/schemas/writing_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

/* ---------- hard-coded replacements for writingConfig ---------- */
const API_ENDPOINT = "/api/writing";

/* ---------- labels ---------- */
const titles = { en: "Writing", cn: "文章" };

/* ---------- default-values factory ---------- */
const getDefaultValues = (item, isCn) => {
  console.log('WritingEditForm: Creating default values for item:', item);

  const defaultValues = {
    // Basic fields
    cover_img_url: item?.cover_img_url || "",
    author: item?.author || "",
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    summary: item?.summary || "",
    keywords: item?.keywords || "",
    category: item?.category || "",
    type: item?.type || "",
    year: item?.year || "",
    paragraphs: Array.isArray(item?.paragraphs) ? item.paragraphs : [],
    caption: item?.caption || "",
    status: item?.status || "",
    tag: item?.tag || [],
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('WritingEditForm: Default values created:', defaultValues);
  return defaultValues;
};

/* ---------- component ---------- */
export default function WritingEditForm({ item }) {
  // Get isCn from LanguageContext EXACTLY like EventEditForm does
  const { isCn } = useContext(LanguageContext);

  console.log('WritingEditForm: Rendering with item:', item, 'isCn:', isCn);

  // Memoize the default values function to prevent excessive re-renders
  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={writingSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('WritingEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('WritingEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        // Use isCn from LanguageContext, not from EditFormShell
        console.log('WritingEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('WritingEditForm: Form state:', {
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
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.writing?.title || "Cover Image"}
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

            <WritingFormSection
              form={form}
              disabled={disabled}
              colors={colors}
              getLabel={getLabel}
              onFieldChange={() => {}}
            />

            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </EditFormShell>
  );
}