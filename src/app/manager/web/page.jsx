"use client";

import React from "react";
import { webManagerConfig } from "@/components/pages/manager/config/collections/webManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/web — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function WebManagerPage() {
  return <EditorialManagerList config={webManagerConfig} />;
}
