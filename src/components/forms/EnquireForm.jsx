"use client";

import React, { useContext } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { enquireSchema } from "@/schemas/enquire_schema"; // Ensure you save the generated schema here
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";
import EnquireFormSection from "@/components/forms/sections/EnquireFormSection"; // Ensure you save the generated section here

export default function EnquireForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/enquire?id=${id}`;
    return "/api/enquire";
  };

  const EnquireFormConfig = {
    itemUrl: "enquire",

    api: {
      endpoints: {
        create: "/api/enquire",
        update: (id) => `/api/enquire?id=${id}`,
      },
      methods: { create: "POST", update: "PUT" },
      headers: { "Content-Type": "application/json" },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const { isCn } = useContext(LanguageContext);

  // Default values matching Prisma Enquire model
  const defaultValues = {
    name:                   "",
    email:                  "",
    message:                "",
    status:                 "Pending",
  };

  return (
    <FormShell
      schema={enquireSchema}
      defaultValues={defaultValues}
      config={EnquireFormConfig}
    >
      {({
        form,
        isSubmitting,
        getLabel,
        onFieldChange,
        colors,
      }) => {

        return (
          <>
            <FormTitle schemaNameEn="Enquiry" schemaNameCn="咨询" isCn={isCn} />

            {/* Note: ImageUploadSection was removed as Enquire doesn't have an image field */}
            <EnquireFormSection
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