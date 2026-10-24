// EnquireEditForm.jsx — matches Prisma Enquire model
"use client";

import React, { useContext, useCallback } from "react";
import {
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
} from "@mui/material";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import { enquireSchema } from "@/schemas/enquire_schema"; // Ensure correct path
import { LanguageContext } from "@/components/contexts/LanguageContext";

const API_ENDPOINT = "/api/enquire";
const titles = { en: "Enquiry", cn: "咨询" };

// 从 item 数据生成表单默认值
const getDefaultValues = (item) => {
  console.log("EnquireEditForm: Creating default values for item:", item);

  const defaultValues = {
    name: item?.name || "",
    email: item?.email || "",
    message: item?.message || "",
    status: item?.status || "Pending",
  };

  console.log("EnquireEditForm: Default values created:", defaultValues);
  return defaultValues;
};

export default function EnquireEditForm({ item }) {
  const { isCn } = useContext(LanguageContext);

  console.log("EnquireEditForm: Rendering with item:", item, "isCn:", isCn);

  // 缓存默认值生成函数，依赖 item 的 id 以避免不必要的重新生成
  const memoizedGetDefaultValues = useCallback(
    (currentItem) => getDefaultValues(currentItem),
    [item?.id || item?._id]
  );

  return (
    <EditFormShell
      key={item?.id || item?._id || "new"}
      schema={enquireSchema}
      defaultValues={memoizedGetDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
      onSubmitSuccess={(data) => {
        console.log("EnquireEditForm: Submit success:", data);
      }}
      onSubmitError={(error) => {
        console.log("EnquireEditForm: Submit error:", error);
      }}
    >
      {({ form, colors, disabled, getLabel }) => {
        console.log("EnquireEditForm: Inside render, isCn:", isCn);

        const { register } = form;
        const formErrors = form.formState.errors;
        console.log("EnquireEditForm: Form state:", {
          isValid: form.formState.isValid,
          errors: formErrors,
          isSubmitting: form.formState.isSubmitting,
          isDirty: form.formState.isDirty,
        });

        return (
          <>
            {/* 所有表单字段 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              
              {/* Contact Information */}
              <TextField
                label={getLabel("name")}
                {...register("name")}
                disabled={disabled}
                fullWidth
                size="small"
                error={!!formErrors.name}
                helperText={formErrors.name?.message}
                required
              />
              <TextField
                label={getLabel("email")}
                {...register("email")}
                disabled={disabled}
                fullWidth
                size="small"
                error={!!formErrors.email}
                helperText={formErrors.email?.message}
                required
              />
              
              {/* Message */}
              <TextField
                label={getLabel("message")}
                {...register("message")}
                disabled={disabled}
                fullWidth
                size="small"
                multiline
                rows={4}
                error={!!formErrors.message}
                helperText={formErrors.message?.message}
              />

              {/* Status */}
              <FormControl fullWidth size="small" error={!!formErrors.status}>
                <InputLabel>{getLabel("status")}</InputLabel>
                <Select
                  {...register("status")}
                  disabled={disabled}
                  label={getLabel("status")}
                  defaultValue="Pending"
                >
                  <MenuItem value="Pending">Pending / 待处理</MenuItem>
                  <MenuItem value="Responded">Responded / 已回复</MenuItem>
                  <MenuItem value="Closed">Closed / 已关闭</MenuItem>
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status.message}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />
          </>
        );
      }}
    </EditFormShell>
  );
}