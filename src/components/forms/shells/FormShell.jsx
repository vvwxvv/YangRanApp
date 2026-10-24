"use client";

import React, { useContext, useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { useReverseTheme } from "@/hooks/useReverseTheme";
import { useFormState } from "@/hooks/useFormState";
import { useFormSubmission } from "@/hooks/useFormSubmission";
import { getSystemLabel } from "@/components/labels/system_labels";
import FormAlert from "@/components/alerts/FormAlert";
import SubmitButton from "@/components/buttons/SubmitButton";
import {
  createLabelResolver,
  createFormBoxStyles,
  createContainerStyles,
  createWrapperBoxStyles,
  containerVariants,
} from "@/components/forms/utils/formShellUtils";
import { FormSettingsProvider, useFormSettings } from "@/components/forms/settings/FormSettingsContext";
import { resolveFormKey } from "@/components/forms/settings/formKey";
import { applyRequired, requiredFieldsFromSettings } from "@/components/forms/settings/applyRequired";
import { useLiveZodResolver } from "@/components/forms/settings/useLiveZodResolver";


const DEBUG_SHELL = {
  log: (section, message, data) => {
    const timestamp = new Date().toISOString().split('T')[1];
    console.log(`[${timestamp}] [FormShell:${section}]  ${message}`, data || "");
  },
  error: (section, message, error) => {
    const timestamp = new Date().toISOString().split('T')[1];
    console.log(`[${timestamp}] [FormShell:${section}]  ERROR: ${message}`, error);
  },
};

export default function FormShell({ schema, defaultValues, config, children }) {
  const formKey = resolveFormKey(config, config?.api?.endpoints?.create || config?.apiRoute);
  return (
    <FormSettingsProvider formKey={formKey}>
      <FormShellInner
        formKey={formKey}
        schema={schema}
        defaultValues={defaultValues}
        config={config}
      >
        {children}
      </FormShellInner>
    </FormSettingsProvider>
  );
}

function FormShellInner({ formKey, schema, defaultValues, config, children }) {
  const { isCn } = useContext(LanguageContext);
  const { isMoile } = useContext(DeviceContext);
  const { colors } = useReverseTheme();
  const appFormState = useFormState();

  DEBUG_SHELL.log("INIT", "FormShell component mounted", {
    hasSchema: !!schema,
    hasDefaultValues: !!defaultValues,
    isMobile: isMoile,
    defaultValuesKeys: defaultValues ? Object.keys(defaultValues) : [],
    appFormStateKeys: appFormState ? Object.keys(appFormState) : [],
  });

  // Memoized styles
  const wrapperBoxStyles = useMemo(
    () => createWrapperBoxStyles(colors),
    [colors]
  );

  const containerStyles = useMemo(
    () => createContainerStyles(isMoile, colors),
    [isMoile, colors]
  );

  const formBoxStyles = useMemo(
    () => createFormBoxStyles(isMoile, colors),
    [isMoile, colors]
  );

  /* ---------- form setup ---------- */
  // Required fields are a *setting*, not part of the entity's zod schema (which
  // keeps everything optional for legacy rows). Layer them on at runtime.
  const { settings } = useFormSettings(formKey);
  const requiredNames = useMemo(() => requiredFieldsFromSettings(schema, settings), [schema, settings]);
  const effectiveSchema = useMemo(() => applyRequired(schema, requiredNames), [schema, requiredNames]);

  const form = useForm({
    resolver: zodResolver(effectiveSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // UI language toggle → default the record language to match (create forms),
  // unless the editor already picked something else or an existing record
  // carries its own language. The dropdown stays usable afterwards.
  const prevUiLangRef = useRef(isCn ? "CN" : "EN");
  useEffect(() => {
    const next = isCn ? "CN" : "EN";
    const prev = prevUiLangRef.current;
    if (prev === next) return;
    prevUiLangRef.current = next;
    if (typeof form?.getValues !== "function" || typeof form?.setValue !== "function") return;
    const current = String(form.getValues("language") ?? "").toUpperCase();
    if (!current || current === prev) {
      form.setValue("language", next, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [isCn, form]);

  useLiveZodResolver(form, effectiveSchema);

  const formState = form.formState;

  DEBUG_SHELL.log("FORM_SETUP", "Form initialized with React Hook Form state", {
    hasForm: !!form,
    formStateKeys: formState ? Object.keys(formState) : [],
    isDirty: formState?.isDirty,
    isValid: formState?.isValid,
    errors: formState?.errors ? Object.keys(formState.errors) : [],
  });

 // FIX: Trigger validation after mount to update isValid state
  useEffect(() => {
    const validateForm = async () => {
      const isValid = await form.trigger();
      DEBUG_SHELL.log("INITIAL_VALIDATION", "Form validated on mount", {
        isValid,
        errors: Object.keys(form.formState.errors || {}),
      });
    };
    validateForm();
  }, [form]);

  /* ---------- universal label helper ---------- */
  const getLabel = React.useCallback(
    (key) => createLabelResolver(config, isCn, getSystemLabel)(key),
    [config, isCn]
  );

  const { handleSubmit, isSubmitting } = useFormSubmission(
    form,
    appFormState,
    getLabel,
    config
  );

  DEBUG_SHELL.log("SUBMISSION", "useFormSubmission hook initialized", {
    hasHandleSubmit: !!handleSubmit,
    isSubmitting,
    formStateRHF: {
      isDirty: formState?.isDirty,
      isValid: formState?.isValid,
      isSubmitting: formState?.isSubmitting,
    },
  });

  /* ---------- language switch reset ---------- */
  useEffect(() => {
    if (isSubmitting) return;
    const raw = form.getValues();
    
    const resetValues = {
      ...defaultValues,
      ...raw,
    };
    
    form.reset(resetValues);
    DEBUG_SHELL.log("LANGUAGE_RESET", "Form reset on language change", {
      isCn,
      resetValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCn, isSubmitting]);

  /* ---------- watched values ---------- */
  const watchedValues = useMemo(() => form.watch(), [form]);

  /* ---------- field change helper ---------- */
  const onFieldChange = (fieldName) => {
    appFormState.clearError?.();
    DEBUG_SHELL.log("FIELD_CHANGE_HELPER", `Field changed: ${fieldName}`);
  };

  /* ---------- dynamic array field handler ---------- */
  const getFieldArray = React.useCallback((fieldName) => {
    try {
      const fieldArray = useFieldArray({
        control: form.control,
        name: fieldName,
      });
      DEBUG_SHELL.log("GET_FIELD_ARRAY", `Created array for: ${fieldName}`);
      return fieldArray;
    } catch (err) {
      DEBUG_SHELL.error("GET_FIELD_ARRAY", `Failed for ${fieldName}`, err);
      return { fields: [], append: () => {}, remove: () => {} };
    }
  }, [form.control]);

  DEBUG_SHELL.log("RENDER_SHELL", "About to render children", {
    hasChildren: !!children,
    isMobile: isMoile,
    formStateRHF: {
      isDirty: formState?.isDirty,
      isValid: formState?.isValid,
      isSubmitting: formState?.isSubmitting,
      errors: formState?.errors ? Object.keys(formState.errors) : [],
    },
  });

  return (
    <Box sx={wrapperBoxStyles}>
      <Container maxWidth="lg" sx={containerStyles}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={formBoxStyles}
        >
          <FormAlert
            successMessage={appFormState.state?.successMessage}
            errorMessage={appFormState.state?.errorMessage}
            showSuccessPopup={appFormState.state?.showSuccessPopup}
            getLabel={getLabel}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`form-container-${isCn ? "CN" : "EN"}`}
          >
            {children({
              form,
              formState,
              isSubmitting,
              getFieldArray,
              watchedValues,
              getLabel,
              onFieldChange,
              colors,
            })}

            <SubmitButton
              isSubmitting={isSubmitting}
              submitText={getSystemLabel("submitButton", isCn)}
              submittingText={getSystemLabel("submittingButton", isCn)}
              isCn={isCn}
              colors={colors}
            />
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}

