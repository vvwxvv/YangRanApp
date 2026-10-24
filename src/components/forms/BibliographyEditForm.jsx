// BibliographyEditForm.jsx — matches Prisma Bibliography model
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import BibliographyFormSection from "@/components/forms/sections/BibliographyFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { bibliographySchema } from "@/schemas/bibliography_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/bibliography";
const titles = { en: "Bibliography Entry", cn: "书目条目" };

const getDefaultValues = (item, isCn) => {
  console.log('BibliographyEditForm: Creating default values for item:', item);

  const defaultValues = {
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    cover_img_url: item?.cover_img_url || "",
    author: item?.author || "",
    type: item?.type || "",
    year: item?.year || "",
    date: item?.date || "",
    published_at: item?.published_at || "",
    pdf_url: item?.pdf_url || "",
    web_url: item?.web_url || "",
    video_url: item?.video_url || "",
    related_exhibition: Array.isArray(item?.related_exhibition) 
      ? item.related_exhibition 
      : [],
    related_artist: Array.isArray(item?.related_artist)
      ? item.related_artist
      : [],
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('BibliographyEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function BibliographyEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('BibliographyEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={bibliographySchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('BibliographyEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('BibliographyEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('BibliographyEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('BibliographyEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.bibliography?.title || "Cover Image"}
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

            <BibliographyFormSection
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