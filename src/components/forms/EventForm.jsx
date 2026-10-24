// EventForm.jsx — matches updated Prisma Event model
"use client";

import React, { useContext, useCallback } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { eventSchema } from "@/schemas/event_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import EventFormSection from "@/components/forms/sections/EventFormSection";

export default function EventForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/event?id=${id}`;
    return "/api/event";
  };

  const EventFormConfig = {
    itemUrl: "event",

    api: {
      endpoints: {
        create: "/api/event",
        update: (id) => `/api/event?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/event/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // Default values matching updated Prisma Event model
  const defaultValues = {
    cover_img_url: "",
    title: "",
    subtitle: "",
    year: "",
    date_time: "",
    type: "",
    host: "",
    support: "",
    special_thanks: "",
    venue: "",
    address: "",
    caption: "",
    introduction: [],
    related_artist: [],
    web_url: "",
    video_url: "",
    order: "",
    language: isCn ? "CN" : "EN",
  };

  const coverConfig = IMAGE_UPLOAD_CONFIGS.event;

  return (
    <FormShell
      schema={eventSchema}
      defaultValues={defaultValues}
      config={EventFormConfig}
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
            <FormTitle schemaNameEn="Event" schemaNameCn="活动" isCn={isCn} />

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

            <EventFormSection
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