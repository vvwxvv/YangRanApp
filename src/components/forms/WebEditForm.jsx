// WebEditForm.jsx - Using exact same label logic as AboutEditForm
"use client";
import React, { useContext } from "react";
import { Divider, Grid } from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import WebFormSection from "@/components/forms/sections/WebFormSection";
import OrderSelector from "@/components/forms/selectors/OrderSelector";
import { webSchema } from "@/schemas/web_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

/* ----------  hard-coded replacements for webConfig  ---------- */
const API_ENDPOINT = "/api/web";

/* ----------  labels  ---------- */
const titles = { en: "Web", cn: "网站" };

/* ----------  default-values factory  ---------- */
const getDefaultValues = (item, isCn) => {
  console.log('WebEditForm: Creating default values for item:', item);
  
  const defaultValues = {
    web_url: item?.web_url || "",
    tag_en: item?.tag_en || "",
    tag_cn: item?.tag_cn || "",
    type: item?.type || "",
    caption_en: item?.caption_en || "",
    caption_cn: item?.caption_cn || "",
    order: String(item?.order ?? ""),
  };
  
  console.log('WebEditForm: Default values created:', defaultValues);
  return defaultValues;
};

/* ----------  component  ---------- */
export default function WebEditForm({ item }) {
  // Get isCn from LanguageContext EXACTLY like AboutEditForm does
  const { isCn } = useContext(LanguageContext);
  
  console.log('WebEditForm: Rendering with item:', item, 'isCn:', isCn);
  
  // Memoize the default values function to prevent excessive re-renders
  const memoizedGetDefaultValues = React.useCallback(
    (currentItem, isCnValue) => getDefaultValues(currentItem, isCnValue),
    [item?.id || item?._id]
  );
  
  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={webSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log('WebEditForm: Submit success:', data);
      }}
      onSubmitError={(error) => {
        console.log('WebEditForm: Submit error:', error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        // Use isCn from LanguageContext, not from EditFormShell
        console.log('WebEditForm: Inside render, isCn:', isCn);
        
        const formErrors = form.formState.errors;
        console.log('WebEditForm: Form state:', {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
          errorDetails: Object.keys(formErrors).length > 0 ? 
            Object.entries(formErrors).map(([key, error]) => ({
              field: key,
              message: error.message,
              type: error.type,
              value: form.getValues(key)
            })) : 'No errors'
        });
        
        return (
          <>
            <WebFormSection 
              form={form} 
              disabled={disabled} 
              colors={colors}
              onFieldChange={() => {}}
            />

            <Divider sx={{ my: 3 }} />

            {/* Mark and Order selectors - Use direct Chinese labels like AboutEditForm */}
            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <OrderSelector
                  label={getLabel("order") || (isCn ? "排序" : "Order")}
                  form={form}
                  disabled={disabled}
                  getLabel={() => isCn ? "排序" : "Order"} // Direct Chinese labels like AboutEditForm
                  onFieldChange={() => {}}
                  colors={colors}
                  isCn={isCn}
                />
              </Grid>
            </Grid>

          </>
        );
      }}
    </EditFormShell>
  );
}