"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { seriesSchema } from "@/schemas/series_schema"; // 需确保该文件存在
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import SeriesFormSection from "@/components/forms/sections/SeriesFormSection";

export default function SeriesForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/series?id=${id}`;
    return "/api/series";
  };

  const SeriesFormConfig = {
    itemUrl: "series",

    api: {
      endpoints: {
        create: "/api/series",
        update: (id) => `/api/series?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/series/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // 默认值完全匹配 Prisma Series 模型
  const defaultValues = {
    cover_img_url: "",
    artist: "",
    title: "",
    type: "",
    medium: "",
    year: "",
    caption: "",
    credits: "",
    special_thanks: "",
    introduction: [],
    order: "",
    language: isCn ? "CN" : "EN",
  };

  const coverConfig = IMAGE_UPLOAD_CONFIGS.series; // 确保配置存在

  return (
    <FormShell
      schema={seriesSchema}
      defaultValues={defaultValues}
      config={SeriesFormConfig}
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
            <FormTitle schemaNameEn="Series" schemaNameCn="系列" isCn={isCn} />

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

            <SeriesFormSection
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
