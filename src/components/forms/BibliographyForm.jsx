"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { bibliographySchema } from "@/schemas/bibliography_schema"; // 需确保该文件存在
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import BibliographyFormSection from "@/components/forms/sections/BibliographyFormSection";

export default function BibliographyForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/bibliography?id=${id}`;
    return "/api/bibliography";
  };

  const BibliographyFormConfig = {
    itemUrl: "bibliography",

    api: {
      endpoints: {
        create: "/api/bibliography",
        update: (id) => `/api/bibliography?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/bibliography/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // 默认值完全匹配 Prisma Bibliography 模型
  const defaultValues = {
    title: "",
    subtitle: "",
    cover_img_url: "",
    author: "",
    type: "",
    year: "",
    date: "",
    published_at: "",
    pdf_url: "",
    web_url: "",
    video_url: "",
    related_exhibition: [],
    related_artist: [],
    order: "",
    language: isCn ? "CN" : "EN",
  };

  const coverConfig = IMAGE_UPLOAD_CONFIGS.bibliography; // 确保配置存在

  return (
    <FormShell
      schema={bibliographySchema}
      defaultValues={defaultValues}
      config={BibliographyFormConfig}
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
            <FormTitle schemaNameEn="Bibliography" schemaNameCn="书目" isCn={isCn} />

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

            <BibliographyFormSection
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