// components/shared/EditFormShell.jsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Container, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { useFormState } from "@/hooks/useFormState";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import FormAlert from "@/components/alerts/FormAlert";
import FormTitle from "@/components/titles/FormTitle";
import SubmitButton from "@/components/buttons/SubmitButton";
import DataNotFound from "@/components/alerts/DataNotFound";
import { getSystemLabel } from "@/components/labels/system_labels";
import { useContext, useEffect, useMemo, useCallback } from "react";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import {
  createLabelResolver,
  createFormBoxStyles,
  createContainerStyles,
  containerVariants,
  createEditSubmitHandler,
  validateEditItem,
} from "@/components/forms/utils/formShellUtils";
import { FormSettingsProvider, useFormSettings } from "@/components/forms/settings/FormSettingsContext";
import { resolveFormKey } from "@/components/forms/settings/formKey";
import { applyRequired, requiredFieldsFromSettings } from "@/components/forms/settings/applyRequired";
import { useLiveZodResolver } from "@/components/forms/settings/useLiveZodResolver";

/* ------------------------------------------------------------------ */
/*  Reusable edit-form wrapper                                        */
/*  schema        : zod schema                                        */
/*  defaultValues : (item, isCn) => object                            */
/*  apiRoute      : "/api/about"  (no /:id)                           */
/*  item          : existing document                                 */
/*  children      : (form, getLabel, colors, disabled) => ReactNode   */
/* ------------------------------------------------------------------ */
export default function EditFormShell({ schema, defaultValues, apiRoute, item, children, titles, config }) {
  const formKey = resolveFormKey(config, apiRoute);
  return (
    <FormSettingsProvider formKey={formKey}>
      <EditFormShellInner
        formKey={formKey}
        schema={schema}
        defaultValues={defaultValues}
        apiRoute={apiRoute}
        item={item}
        titles={titles}
        config={config}
      >
        {children}
      </EditFormShellInner>
    </FormSettingsProvider>
  );
}

function EditFormShellInner({ formKey, schema, defaultValues, apiRoute, item, children, titles, config }) {
  const { isCn } = useContext(LanguageContext);
  const { isMoile } = useContext(DeviceContext);  
  const { colors } = useReverseTheme();
  const formState = useFormState();

  // Form box styles
  const formBoxStyles = useMemo(
    () => createFormBoxStyles(isMoile, colors),
    [isMoile, colors]
  );

  // Container styles
  const containerStyles = useMemo(
    () => createContainerStyles(isMoile, colors),
    [isMoile, colors]
  );

  /* ---------- form settings: admin-required fields ---------- */
  const { settings } = useFormSettings(formKey);
  const requiredNames = useMemo(
    () => requiredFieldsFromSettings(schema, settings),
    [schema, settings]
  );
  const effectiveSchema = useMemo(() => applyRequired(schema, requiredNames), [schema, requiredNames]);

  const form = useForm({
    resolver: zodResolver(effectiveSchema),
    defaultValues: item ? defaultValues(item, isCn) : {},
    mode: "onSubmit",
  });

  useLiveZodResolver(form, effectiveSchema);

  /* ---------- universal label helper ---------- */
  const getLabel = useCallback(
    (key) => createLabelResolver(config, isCn, getSystemLabel)(key),
    [config, isCn]
  );

  // Update form values when item changes
  useEffect(() => {
    if (item) {
      const newDefaultValues = defaultValues(item, isCn);
      form.reset(newDefaultValues);
    }
  }, [item, isCn, form, defaultValues]);

  const handleSubmit = useCallback(
    createEditSubmitHandler(formState, form, item, apiRoute),
    [formState, form, item, apiRoute]
  );

  if (!validateEditItem(item)) {
    return <DataNotFound />;
  }

  return (
    <Container sx={containerStyles}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={formBoxStyles}>
        <FormAlert {...formState.state} />
        <motion.div variants={containerVariants} initial="hidden" animate="visible" key={`edit-${isCn}`}>
          <FormTitle schemaNameEn={titles.en} schemaNameCn={titles.cn} isCn={isCn} colors={colors} />

          {/* ----------  schema-specific fields  ---------- */}
          {children({ form, getLabel, colors, disabled: formState.state.isSubmitting })}
          {/* ------------------------------------------------ */}

          <Divider sx={{ my: 3, borderColor: colors.border }} />

          <SubmitButton
            isSubmitting={formState.state.isSubmitting}
            submitText={getSystemLabel("submitButton", isCn)}
            submittingText={getSystemLabel("submittingButton", isCn)}
            isCn={isCn}
            colors={colors}
          />
        </motion.div>
      </Box>
    </Container>
  );
}