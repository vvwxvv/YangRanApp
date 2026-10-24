"use client";

import React from "react";
import { bibliographyManagerConfig } from "@/components/pages/manager/config/collections/bibliographyManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/bibliography — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function BibliographyManagerPage() {
  return <EditorialManagerList config={bibliographyManagerConfig} />;
}
