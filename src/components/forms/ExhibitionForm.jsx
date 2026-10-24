"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { exhibitionSchema } from "@/schemas/exhibition_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import ExhibitionFormSection from "@/components/forms/sections/ExhibitionFormSection";

/**
 * ExhibitionForm — CREATE form (route /manager/exhibition/create).
 *
 * Previously this file rendered the EDIT shell without an item, so the create
 * page showed "Data not found". It now uses the CREATE `FormShell`, matching
 * ArtworkForm / FairForm.
 */
export default function ExhibitionForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/exhibition?id=${id}`;
    return "/api/exhibition";
  };

  const ExhibitionFormConfig = {
    itemUrl: "exhibition",

    api: {
      endpoints: {
        create: "/api/exhibition",
        update: (id) => `/api/exhibition?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    // Array fields the submission hook should send as-is.
    fields: {
      arrayFields: ["introduction", "press_release", "related_artist"],
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/exhibitions/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // Default values fully matching the Prisma Exhibition model.
  const defaultValues = {
    cover_img_url: "",
    title: "",
    subtitle: "",
    type: "",
    date_start: "",
    date_end: "",
    opening_date: "",
    year: "",
    venue: "",
    location: "",
    curator: "",
    organiser: "",
    participating_artists: "",
    caption: "",
    description: "",
    introduction: [],
    press_release: [],
    // related_artwork: [{ title, order, mark }] JSON array.
    related_artwork: [],
    related_artist: [],
    web_url: "",
    video_url: "",
    language: isCn ? "CN" : "EN",
    order: "",
    status: "",
  };

  const coverConfig = IMAGE_UPLOAD_CONFIGS.exhibition;

  return (
    <FormShell
      schema={exhibitionSchema}
      defaultValues={defaultValues}
      config={ExhibitionFormConfig}
    >
      {({
        form,
        formState,
        isSubmitting,
        watchedValues,
        getLabel,
        onFieldChange,
        colors,
      }) => {
        const handleUploadSuccess = useCallback(
          (url) => {
            coverConfig.createSetValue(form)(url);
            formState.clearError?.();
          },
          [form, formState]
        );

        const handleUploadError = useCallback(
          (err) =>
            formState.setError?.(err?.message || getLabel("uploadError")),
          [formState, getLabel]
        );

        return (
          <>
            <FormTitle schemaNameEn="Exhibition" schemaNameCn="展览" isCn={isCn} />

            <ImageUploadSection
              title={coverConfig?.title || getLabel("coverImage")}
              imgUrl={watchedValues.cover_img_url}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              disabled={isSubmitting}
              getLabel={getLabel}
              register={coverConfig.createRegister(form)}
              fieldName={coverConfig.fieldName}
              form={form}
              colors={colors}
            />

            <ExhibitionFormSection
              form={form}
              disabled={isSubmitting}
              getLabel={getLabel}
              onFieldChange={onFieldChange}
              colors={colors}
            />

            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </FormShell>
  );
}
