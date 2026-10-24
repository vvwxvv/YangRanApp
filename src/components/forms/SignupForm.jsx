"use client";

import React, { useContext } from "react";
import { Divider } from "@mui/material";

import FormShell from "@/components/forms/shells/FormShell";
import { usersSchema } from "@/schemas/users_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";
import UserFormSection from "@/components/forms/sections/UserFormSection";

export default function SignupForm() {
  const setValue = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});
  
  const getEndpoint = (mode, id) => {
    if (mode === 'update' && id) return `/api/signup/${id}`;
    return '/api/signup';
  };

  const SignupFormConfig = {
    itemUrl: 'signup',
    
    api: {
      endpoints: {
        create: '/api/signup',
        update: (id) => `/api/signup/${id}`,
      },
      methods: { create: 'POST', update: 'PUT' },
      headers: { 'Content-Type': 'application/json' },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        uploadPath: '/uploads/signup/',
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };
  const { isCn } = useContext(LanguageContext);

  const defaultValues = {
    username: "",
    email: "",
    password: "",
  };

  return (
    <FormShell
      schema={usersSchema}
      defaultValues={defaultValues}
      config={SignupFormConfig}
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
            <FormTitle schemaNameEn="Sign Up" schemaNameCn="注册" isCn={isCn} />

            <UserFormSection
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
