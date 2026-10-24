"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { artworkSchema } from "@/schemas/artwork_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import ArtworkFormSection from "@/components/forms/sections/ArtworkFormSection";

export default function ArtworkForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/artwork?id=${id}`;
    return "/api/artwork";
  };

  const ArtworkFormConfig = {
    itemUrl: "artwork",

    api: {
      endpoints: {
        create: "/api/artwork",
        update: (id) => `/api/artwork?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/artwork/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // Default values fully matching Prisma Artwork model
  const defaultValues = {
    cover_img_url:               "",
    related_exhibition: [],  // 新增，匹配 Prisma 模型
    artist:         "",
    title:          "",
    type:           "",
    medium:         "",
    year:           "",
    size:           "",
    series:         "",
    caption:        "",
    duration:       "",
    credits:        "",
    special_thanks: "",
    introduction:   [],
    video_url:      "",
    web_url:        "",
    work_value:     "",
    sold:           "",
    order:          { artist_page_order: "", exhibition_page_order: "", art_fair_page_order: "" },
    language:       isCn ? "CN" : "EN",
  };

  const coverConfig = IMAGE_UPLOAD_CONFIGS.artwork;

  return (
    <FormShell
      schema={artworkSchema}
      defaultValues={defaultValues}
      config={ArtworkFormConfig}
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
            formState.clearError();
          },
          [form, formState]
        );

        const handleUploadError = useCallback(
          (err) =>
            formState.setError(err.message || getLabel("uploadError")),
          [formState, getLabel]
        );

        return (
          <>
            <FormTitle schemaNameEn="Artwork" schemaNameCn="作品" isCn={isCn} />

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

            <ArtworkFormSection
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