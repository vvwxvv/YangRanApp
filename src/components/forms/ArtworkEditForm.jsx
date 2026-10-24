// ArtworkEditForm.jsx — matches Prisma Artwork model
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import ArtworkFormSection from "@/components/forms/sections/ArtworkFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { artworkSchema } from "@/schemas/artwork_schema";
import { normalizeArtworkOrder } from "@/utils/artworkOrder";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/artwork";
const titles = { en: "Artwork", cn: "作品" };

const getDefaultValues = (item, isCn) => {
  console.log('ArtworkEditForm: Creating default values for item:', item);

  const defaultValues = {
    cover_img_url: item?.cover_img_url || "",
    related_exhibition: Array.isArray(item?.related_exhibition) 
      ? item.related_exhibition 
      : [],
    artist: item?.artist || "",
    title: item?.title || "",
    type: item?.type || "",
    medium: item?.medium || "",
    year: item?.year || "",
    size: item?.size || "",
    series: item?.series || "",
    caption: item?.caption || "",
    duration: item?.duration || "",
    credits: item?.credits || "",
    special_thanks: item?.special_thanks || "",
    introduction: Array.isArray(item?.introduction) ? item.introduction : [],
    video_url: item?.video_url || "",
    web_url: item?.web_url || "",
    work_value: item?.work_value || "",
    sold: item?.sold || "",
    // `order` is a JSON object now — normalise legacy string values too.
    order: normalizeArtworkOrder(item?.order),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('ArtworkEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function ArtworkEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('ArtworkEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={artworkSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('ArtworkEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('ArtworkEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('ArtworkEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('ArtworkEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.artwork?.title || "Cover Image"}
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

            <ArtworkFormSection
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