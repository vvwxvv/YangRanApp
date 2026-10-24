"use client";

import React, { useContext, useCallback } from "react";
import { Divider, Grid, TextField } from "@mui/material";
import FormShell from "@/components/forms/shells/FormShell";
import { webSchema } from "@/schemas/web_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";
import WebFormSection from "@/components/forms/sections/WebFormSection";
import OrderSelector from "@/components/forms/selectors/OrderSelector";

/**
 * @param {Object} relatedData  Keyed by schema dataKey, e.g.
 *                              { artwork: [...], project: [...], event: [...] }
 */
export default function WebForm({ relatedData = {} }) {
  const { isCn } = useContext(LanguageContext);

  const setValue    = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
  const getValue    = (form, field)        => form.getValues(field);
  const clearErrors = (form, field)        => form.clearErrors(field);
  const reset       = (form, defaults)     => form.reset(defaults ?? {});
  const getEndpoint = (mode, id) =>
    mode === 'update' && id ? `/api/web/${id}` : '/api/web';

  const WebFormConfig = {
    itemUrl: 'web',
    api: {
      endpoints: {
        create: '/api/web',
        update: (id) => `/api/web?id=${id}`,
      },
      methods: { create: 'POST', update: 'PUT' },
      headers: { 'Content-Type': 'application/json' },
    },
    settings: {
      // No upload needed for web – URL is entered manually
    },
    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };

  const defaultValues = {
    web_url: "", tag_en: "", tag_cn: "", type: "",
    caption_en: "", caption_cn: "", order: "", tag_source: "0",
  };


  return (
    <FormShell
      schema={webSchema}
      defaultValues={defaultValues}
      config={WebFormConfig}
    >
      {({ form, formState, isSubmitting, watchedValues, getLabel, onFieldChange, colors }) => {
        // Handle URL field changes
        const handleUrlChange = useCallback((e) => {
          form.setValue('web_url', e.target.value, { shouldDirty: true });
          onFieldChange?.('web_url');
        }, [form, onFieldChange]);

        return (
          <>
            <FormTitle schemaNameEn="Web" schemaNameCn="网页" isCn={isCn} />

            {/* URL input section (replaces image upload) */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={getLabel("web_url") || (isCn ? "网页链接" : "Web URL")}
                  value={watchedValues.web_url || ""}
                  onChange={handleUrlChange}
                  disabled={isSubmitting}
                  error={!!formState.errors?.web_url}
                  helperText={formState.errors?.web_url?.message}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: colors?.background || '#fff',
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Tag source & value section (reuses WebFormSection) */}
            <WebFormSection
              form={form}
              disabled={isSubmitting}
              getLabel={getLabel}
              onFieldChange={onFieldChange}
              colors={colors}
              relatedData={relatedData}
            />

            {/* Mark & Order selectors (same as image form) */}
            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <OrderSelector
                  label={getLabel("order") || (isCn ? "排序" : "Order")}
                  form={form} disabled={isSubmitting}
                  getLabel={() => (isCn ? "排序" : "Order")}
                  onFieldChange={onFieldChange} colors={colors} isCn={isCn}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </FormShell>
  );
}