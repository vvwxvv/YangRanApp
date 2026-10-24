"use client";

import React, { useContext, useEffect, useCallback, useRef } from "react";
import { Divider, Grid } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { imageSchema } from "@/schemas/image_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useAppTitle from "@/hooks/useAppTitle";
import { getFormArtistValue, shouldHideArtistField } from "@/utils/artistUtils";
import { IMAGE_UPLOAD_CONFIGS } from "@/components/forms/configs/image_upload_config";

import FormTitle from "@/components/titles/FormTitle";
import ImageUploadSection from "@/components/forms/images/ImageUploadSection";
import ImageFormSection from "@/components/forms/sections/ImageFormSection";
import OrderFieldsDisplay from "@/components/forms/selectors/OrderFieldsDisplay";
import { EMPTY_IMAGE_ORDER } from "@/utils/mediaOrder";

/**
 * @param {Object} relatedData  Keyed by schema dataKey, e.g.
 *                              { artwork: [...], project: [...], event: [...] }
 *                              Built by the page and passed straight in.
 */
export default function ImageForm({ relatedData = {} }) {
  const { isCn } = useContext(LanguageContext);
  const appPerson = useAppTitle(isCn ? "CN" : "EN");

  const setValue    = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
  const getValue    = (form, field)        => form.getValues(field);
  const clearErrors = (form, field)        => form.clearErrors(field);
  const reset       = (form, defaults)     => form.reset(defaults ?? {});
  const getEndpoint = (mode, id) =>
    mode === 'update' && id ? `/api/image/${id}` : '/api/image';

  const ImageFormConfig = {
    itemUrl: 'image',
    api: {
      endpoints: {
        create: '/api/image',
        update: (id) => `/api/image?id=${id}`,
      },
      methods: { create: 'POST', update: 'PUT' },
      headers: { 'Content-Type': 'application/json' },
    },
    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        uploadPath: '/uploads/image/',
      },
    },
    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const defaultValues = {
    img_url: "", tag_en: "", tag_cn: "", type: "",
    caption_en: "", caption_cn: "",
    order: { ...EMPTY_IMAGE_ORDER },
    tag_source: "0",
  };

  // The form instance only exists inside the <FormShell> render prop; keep a
  // ref so the artist auto-fill effect can reach it. (The old code called
  // config.setValue("artist", v) — one argument short — and crashed the page
  // with "form.setValue is not a function".)
  const formRef = useRef(null);

  useEffect(() => {
    if (shouldHideArtistField()) {
      const v = getFormArtistValue(appPerson.displayName, isCn ? "CN" : "EN");
      const form = formRef.current;
      if (v && form?.setValue) form.setValue("artist", v, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appPerson.displayName, isCn]);

  const imageConfig = IMAGE_UPLOAD_CONFIGS.image;

  return (
    <FormShell
      schema={imageSchema}
      defaultValues={defaultValues}
      config={ImageFormConfig}
    >
      {({ form, formState, isSubmitting, watchedValues, getLabel, onFieldChange, colors }) => {
        formRef.current = form;

        const handleUploadSuccess = useCallback(
          (url) => {
            console.log("[ImageForm] upload success:", url);
            imageConfig.createSetValue(form)(url);
          },
          [form]
        );

        const handleUploadError = useCallback(
          (err) => {
            console.log(
              "[ImageForm] upload error:",
              err?.message || err || getLabel("uploadError")
            );
          },
          [getLabel]
        );

        return (
          <>
            <FormTitle schemaNameEn="Image" schemaNameCn="图片" isCn={isCn} />

            <ImageUploadSection
              title={imageConfig?.title || getLabel("image")}
              imgUrl={watchedValues.img_url}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              disabled={isSubmitting}
              getLabel={getLabel}
              register={imageConfig.createRegister(form)}
              fieldName={imageConfig.fieldName}
              form={form}
              colors={colors}
            />

            {/* relatedData is passed straight from the page — no merging needed */}
            <ImageFormSection
              form={form}
              disabled={isSubmitting}
              getLabel={getLabel}
              onFieldChange={onFieldChange}
              colors={colors}
              relatedData={relatedData}
            />


            {/* Per-page ordering — order is a JSON object on Image */}
            <OrderFieldsDisplay
              entity="image"
              form={form}
              orderPagePath="/manager/image/order"
              colors={colors}
              isCn={isCn}
            />

            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </FormShell>
  );
}