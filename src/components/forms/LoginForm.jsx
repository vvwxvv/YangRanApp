"use client";

import React, { useContext } from "react";
import { Divider } from "@mui/material";

import FormShell from "@/components/forms/shells/FormShell";
import { loginUsersSchema } from "@/schemas/users_schema";
import { LanguageContext } from "@/components/contexts/LanguageContext";

import FormTitle from "@/components/titles/FormTitle";

/* ----------  thin wrappers that FormShell expects ---------- */
const setValue    = (form, field, value) => form.setValue(field, value, { shouldDirty: true });
const getValue    = (form, field) => form.getValues(field);
const clearErrors = (form, field) => form.clearErrors(field);
const reset       = (form, defaults) => form.reset(defaults || {});

/* ----------  helper: return the correct endpoint ---------- */
const getEndpoint = (mode, id) => {
  if (mode === 'update' && id) return LoginFormConfig.api.endpoints.update(id);
  return LoginFormConfig.api.endpoints.create;
};

export const LoginFormConfig = {
  itemUrl: 'login',
  
  api: {
    endpoints: {
      create: '/api/login',
      update: (id) => `/api/login/${id}`,
    },
    methods: { create: 'POST', update: 'PUT' },
    headers: { 'Content-Type': 'application/json' },
  },

  settings: {
    upload: {
      maxFileSize: 10 * 1024 * 1024,
      acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      uploadPath: '/uploads/login/',
    },
  },

  setValue,
  getValue,
  reset,
  clearErrors,
  getEndpoint,
};

export default function LoginForm() {
  const { isCn } = useContext(LanguageContext);

  const defaultValues = {
    email: "",
    password: "",
  };

  return (
    <FormShell
      schema={loginUsersSchema}
      defaultValues={defaultValues}
      config={LoginFormConfig}
    >
      {({
        form,
        isSubmitting,
        onFieldChange,
        colors,
      }) => {
        return (
          <>
            <FormTitle schemaNameEn="Login" schemaNameCn="登录" isCn={isCn} />
            
            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </FormShell>
  );
}
