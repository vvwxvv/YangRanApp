"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import ExhibitionFormSection from "@/components/forms/sections/ExhibitionFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { exhibitionSchema } from "@/schemas/exhibition_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/exhibition";
const titles = { en: "Exhibition", cn: "展览" };

/**
 * `related_artwork` is a string[] of artwork titles. Legacy rows stored
 * `[{ title, order, mark }]` — collapse those to their title so the picker
 * shows the current selection.
 */
const toTitles = (value) =>
  (Array.isArray(value) ? value : [])
    .map((v) => (v && typeof v === "object" ? v.title : v))
    .map((t) => String(t ?? "").trim())
    .filter(Boolean);

const getDefaultValues = (item, isCn) => {
  console.log('ExhibitionEditForm: Creating default values for item:', item);

  const defaultValues = {
    cover_img_url: item?.cover_img_url || "",
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    type: item?.type || "",
    date_start: item?.date_start || "",
    date_end: item?.date_end || "",
    opening_date: item?.opening_date || "",
    year: item?.year || "",
    venue: item?.venue || "",
    location: item?.location || "",
    curator: item?.curator || "",
    organiser: item?.organiser || "",
    participating_artists: item?.participating_artists || "",
    caption: item?.caption || "",
    description: item?.description || "",
    introduction: Array.isArray(item?.introduction) ? item.introduction : [],
    press_release: Array.isArray(item?.press_release) ? item.press_release : [],
    related_artwork: toTitles(item?.related_artwork),
    related_artwork_title: Array.isArray(item?.related_artwork_title) ? item.related_artwork_title : [],
    related_artist: Array.isArray(item?.related_artist) ? item.related_artist : [],
    web_url: item?.web_url || "",
    video_url: item?.video_url || "",
    status: item?.status || "",
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('ExhibitionEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function ExhibitionEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('ExhibitionEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={exhibitionSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('ExhibitionEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('ExhibitionEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('ExhibitionEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('ExhibitionEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.exhibition?.title || "Cover Image"}
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

            <ExhibitionFormSection
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