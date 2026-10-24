"use client";

import React from "react";
import { writingManagerConfig } from "@/components/pages/manager/config/collections/writingManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/writing — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function WritingManagerPage() {
  return <EditorialManagerList config={writingManagerConfig} />;
}
