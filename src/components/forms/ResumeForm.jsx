"use client";

import React, { useContext } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { resumeSchema } from "@/schemas/resume_schema"; // 需确保该文件存在
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";
import ResumeFormSection from "@/components/forms/sections/ResumeFormSection";

export default function ResumeForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/resume?id=${id}`;
    return "/api/resume";
  };

  const ResumeFormConfig = {
    itemUrl: "resume",

    api: {
      endpoints: {
        create: "/api/resume",
        update: (id) => `/api/resume?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        uploadPath: "/uploads/resume/",
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // 默认值完全匹配 Prisma Resume 模型
  const defaultValues = {
    artist: "",
    year: "",
    start_date: "",
    end_date: "",
    type: "",
    description: "",
    introduction: [],
    language: isCn ? "CN" : "EN",
  };

  return (
    <FormShell
      schema={resumeSchema}
      defaultValues={defaultValues}
      config={ResumeFormConfig}
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
        return (
          <>
            <FormTitle schemaNameEn="Resume" schemaNameCn="履历" isCn={isCn} />

            <ResumeFormSection
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
