// EventEditForm.jsx — matches updated Prisma Event model
"use client";
import React, { useContext } from "react";
import { Divider } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import EventFormSection from "@/components/forms/sections/EventFormSection";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import { eventSchema } from "@/schemas/event_schema";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/event";
const titles = { en: "Event", cn: "活动" };

const getDefaultValues = (item, isCn) => {
  console.log('EventEditForm: Creating default values for item:', item);
  
  const defaultValues = {
    cover_img_url: item?.cover_img_url || "",
    title: item?.title || "",
    subtitle: item?.subtitle || "",
    year: item?.year || "",
    date_time: item?.date_time || "",
    type: item?.type || "",
    host: item?.host || "",
    support: item?.support || "",
    special_thanks: item?.special_thanks || "",
    venue: item?.venue || "",
    address: item?.address || "",
    caption: item?.caption || "",
    introduction: Array.isArray(item?.introduction) ? item.introduction : [],
    related_artist: Array.isArray(item?.related_artist) ? item.related_artist : [],
    web_url: item?.web_url || "",
    video_url: item?.video_url || "",
    order: String(item?.order ?? ""),
    language: item?.language || (isCn ? "CN" : "EN"),
  };
  
  console.log('EventEditForm: Default values created:', defaultValues);
  return defaultValues;
};

export default function EventEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);
  
  console.log('EventEditForm: Rendering with item:', item, 'isCn:', isCn);
  
  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );
  
  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={eventSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('EventEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('EventEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log('EventEditForm: Inside render, isCn:', isCn);
        
        const formErrors = form.formState.errors;
        console.log('EventEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });
        
        return (
          <>
            <ImageUploadSection
              title={IMAGE_UPLOAD_CONFIGS.event?.title || "Cover Image"}
              imgUrl={form.watch("cover_img_url")}
              onUploadSuccess={(url) => form.setValue("cover_img_url", url)}
              onUploadError={(err) => console.log(err)}
              disabled={disabled}
              getLabel={getLabel}
              register={() => ({})}
              fieldName="cover_img_url"
              form={form}
              colors={colors}
            />

            <EventFormSection
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