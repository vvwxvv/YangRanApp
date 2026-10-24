"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { aboutSchema } from "@/schemas/about_schema";                  // About schema
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import AboutFormSection from "@/components/forms/sections/AboutFormSection"; // About form section

export default function AboutForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/about?id=${id}`;
    return "/api/about";
  };

  const AboutFormConfig = {
    itemUrl: "about",

    api: {
      endpoints: {
        create: "/api/about",
        update: (id) => `/api/about?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/about/",                               // About upload path
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // Default values matching Prisma About model
  const defaultValues = {
    portrait_image_url: "",
    artist: "",
    caption: "",
    introductions: [],               // About array field
    pdf_url: "",
    web_url: "",
    status: "",
    order: "",
    language: isCn ? "CN" : "EN",
  };

  const portraitConfig = IMAGE_UPLOAD_CONFIGS.about;  // Ensure this exists in your config

  return (
    <FormShell
      schema={aboutSchema}
      defaultValues={defaultValues}
      config={AboutFormConfig}
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
            portraitConfig.createSetValue(form)(url);
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
            <FormTitle
              schemaNameEn="About"
              schemaNameCn="关于"
              isCn={isCn}
            />

            <ImageUploadSection
              title={portraitConfig?.title || getLabel("portraitImage")}
              imgUrl={watchedValues.portrait_image_url}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              disabled={isSubmitting}
              getLabel={getLabel}
              register={portraitConfig.createRegister(form)}
              fieldName={portraitConfig.fieldName}
              form={form}
              colors={colors}
            />

            <AboutFormSection
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