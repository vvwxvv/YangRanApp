// SeriesEditForm.jsx — matches Prisma Series model
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import SeriesFormSection from "@/components/forms/sections/SeriesFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { seriesSchema } from "@/schemas/series_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/series";
const titles = { en: "Series Entry", cn: "系列条目" };

const getDefaultValues = (item, isCn) => {
  console.log('SeriesEditForm: Creating default values for item:', item);

  const defaultValues = {
    cover_img_url: item?.cover_img_url || "",
    artist: item?.artist || "",
    title: item?.title || "",
    type: item?.type || "",
    medium: item?.medium || "",
    year: item?.year || "",
    caption: item?.caption || "",
    credits: item?.credits || "",
    special_thanks: item?.special_thanks || "",
    introduction: Array.isArray(item?.introduction)
      ? item.introduction
      : [],
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('SeriesEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function SeriesEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('SeriesEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={seriesSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('SeriesEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('SeriesEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('SeriesEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('SeriesEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.series?.title || "Cover Image"}
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

            <SeriesFormSection
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
