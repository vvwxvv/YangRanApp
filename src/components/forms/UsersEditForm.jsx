// UsersEditForm.jsx — matches Prisma Users model
"use client";
import React from "react";
import EditFormShell from "@/components/forms/shells/EditFormShell";
import UserFormSection from "@/components/forms/sections/UserFormSection";
import { usersSchema } from "@/schemas/users_schema";

const API_ENDPOINT = "/api/users";
const titles = { en: "User", cn: "用户" };

const getDefaultValues = (item, isCn) => {
  const defaultValues = {
    username: item?.username || "",
    email: item?.email || "",
    password: item?.password || "",
  };
  
  return defaultValues;
};

export default function UsersEditForm({ item }) {
  return (
    <EditFormShell
      key={item?.id || item?._id || 'new'}
      schema={usersSchema}
      defaultValues={getDefaultValues}
      apiRoute={API_ENDPOINT}
      item={item}
      titles={titles}
    >
      {({ form, colors, disabled }) => (
        <>
          <UserFormSection form={form} disabled={disabled} colors={colors} />
        </>
      )}
    </EditFormShell>
  );
}
