// ResumeEditForm.jsx — matches Prisma Resume model
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import ResumeFormSection from "@/components/forms/sections/ResumeFormSection";
import { resumeSchema } from "@/schemas/resume_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/resume";
const titles = { en: "Resume Entry", cn: "履历条目" };

const getDefaultValues = (item, isCn) => {
  console.log('ResumeEditForm: Creating default values for item:', item);

  const defaultValues = {
    artist: item?.artist || "",
    year: String(item?.year ?? ""),
    start_date: item?.start_date || "",
    end_date: item?.end_date || "",
    type: item?.type || "",
    description: item?.description || "",
    introduction: Array.isArray(item?.introduction)
      ? item.introduction
      : [],
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('ResumeEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function ResumeEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('ResumeEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={resumeSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('ResumeEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('ResumeEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('ResumeEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('ResumeEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ResumeFormSection
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
