"use client";

import React from "react";
import { enquireManagerConfig } from "@/components/pages/manager/config/collections/enquireManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/enquire — shared editorial manager layout (list only).
 */
export default function EnquireManagerPage() {
  return <EditorialManagerList config={enquireManagerConfig} />;
}
