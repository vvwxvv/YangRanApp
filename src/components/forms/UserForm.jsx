"use client";

import React, { useContext, useEffect } from "react";
import { Divider } from "@mui/material";

import FormShell from "@/components/forms/shells/FormShell";
import { usersSchema } from "@/schemas/users_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useAppTitle from "@/hooks/useAppTitle";
import { getFormArtistValue, shouldHideArtistField } from "@/utils/artistUtils";

import FormTitle from "@/components/titles/FormTitle";
import UserFormSection from "@/components/forms/sections/UserFormSection";

export default function UserForm() {
  const setValue = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
  const getValue = (form, field) => form.getValues(field);
  const clearErrors = (form, field) => form.clearErrors(field);
  const reset = (form, defaults) => form.reset(defaults || {});
  
  const getEndpoint = (mode, id) => {
    if (mode === 'update' && id) return `/api/users/${id}`;
    return '/api/users';
  };

  const UserFormConfig = {
    itemUrl: 'users',
    
    api: {
      endpoints: {
        create: '/api/users',
        update: (id) => `/api/users/${id}`,
      },
      methods: { create: 'POST', update: 'PUT' },
      headers: { 'Content-Type': 'application/json' },
    },

    settings: {
      upload: {
        maxFileSize: 10 * 1024 * 1024,
        acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        uploadPath: '/uploads/users/',
      },
    },

    setValue,
    getValue,
    reset,
    clearErrors,
    getEndpoint,
  };
  const { isCn } = useContext(LanguageContext);
  const appPerson = useAppTitle(isCn ? "CN" : "EN");

  const defaultValues = {
    username: "",
    email: "",
    password: "",
  };

  useEffect(() => {
    if (shouldHideArtistField()) {
      const v = getFormArtistValue(appPerson.displayName, isCn ? "CN" : "EN");
      if (v) UserFormConfig.setValue("artist", v);
    }
  }, [appPerson.displayName, isCn]);

  return (
    <FormShell
      schema={usersSchema}
      defaultValues={defaultValues}
      config={UserFormConfig}
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
            <FormTitle schemaNameEn="User" schemaNameCn="用户" isCn={isCn} />

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
