// ArtistContactEditForm.jsx — matches ArtistContactSchema
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import ArtistContactFormSection from "@/components/forms/sections/ArtistContactFormSection";
import { ArtistContactSchema } from "@/schemas/artist_contact_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/artist-contact";
const titles = { en: "Artist Contact", cn: "联系方式" };

const getDefaultValues = (item, isCn) => {
  console.log('ArtistContactEditForm: Creating default values for item:', item);

  const defaultValues = {
   artist_name: item?.artist_name || "",
    email: item?.email || "",
    phone: item?.phone || "",
    address: Array.isArray(item?.address) ? item.address : [],
    social_media: Array.isArray(item?.social_media) ? item.social_media : [],
    web_url: item?.web_url || "",
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('ArtistContactEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function ArtistContactEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('ArtistContactEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={ArtistContactSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('ArtistContactEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('ArtistContactEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('ArtistContactEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('ArtistContactEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ArtistContactFormSection
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