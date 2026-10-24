"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import AboutFormSection from "@/components/forms/sections/AboutFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { aboutSchema } from "@/schemas/about_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/about";
const titles = { en: "About", cn: "关于" };

const getDefaultValues = (item, isCn) => {
  console.log('AboutEditForm: Creating default values for item:', item);

  const defaultValues = {
    portrait_image_url: item?.portrait_image_url || "",
    artist: item?.artist || "",
    caption: item?.caption || "",
    introductions: Array.isArray(item?.introductions) ? item.introductions : [],
    pdf_url: item?.pdf_url || "",
    web_url: item?.web_url || "",
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };

  console.log('AboutEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function AboutEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log('AboutEditForm: Rendering with item:', item, 'isCn:', isCn);

  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={aboutSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('AboutEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('AboutEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('AboutEditForm: Inside render, isCn:', isCn);

        const formErrors = form.formState.errors;
        console.log('AboutEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.about?.title || "Portrait Image"}
              imgUrl={form.watch("portrait_image_url")}
              onUploadSuccess={(url) => form.setValue("portrait_image_url", url)}
              onUploadError={(err) => console.log(err)}
              disabled={disabled}
              getLabel={getLabel}
              register={() => ({})}
              fieldName="portrait_image_url"
              form={form}
              colors={colors}
            />

            <AboutFormSection
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