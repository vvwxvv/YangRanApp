"use client";

import React from "react";
import { resumeManagerConfig } from "@/components/pages/manager/config/collections/resumeManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/resume — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function ResumeManagerPage() {
  return <EditorialManagerList config={resumeManagerConfig} />;
}
