// ArtistContactForm.jsx — matches ArtistContactSchema
"use client";

import React, { useContext } from "react";
import { Divider } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { ArtistContactSchema } from "@/schemas/artist_contact_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";
import ArtistContactFormSection from "@/components/forms/sections/ArtistContactFormSection";

export default function ArtistContactForm() {
  const setValue = (form, field, value) =>
    form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});

  const getEndpoint = (mode, id) => {
    if (mode === "update" && id) return `/api/artist-contact?id=${id}`;
    return "/api/artist-contact";
  };

  const ArtistContactFormConfig = {
    itemUrl: "artist-contact",

    api: {
      endpoints: {
        create: "/api/artist-contact",
        update: (id) => `/api/artist-contact?id=${id}`,
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

  // Default values matching ArtistContactSchema
  const defaultValues = {
   artist_name: "",
    email: "",
    phone: "",
    address: [],                 // string[]
    social_media: [],            // { platform, account, url }[]
    web_url: "",
    order: "",
    language: isCn ? "CN" : "EN",
  };

  return (
    <FormShell
      schema={ArtistContactSchema}
      defaultValues={defaultValues}
      config={ArtistContactFormConfig}
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
            <FormTitle
              schemaNameEn="Artist Contact"
              schemaNameCn="联系方式"
              isCn={isCn}
            />

            <ArtistContactFormSection
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