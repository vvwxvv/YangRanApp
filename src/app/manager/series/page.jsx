"use client";

import React from "react";
import { seriesManagerConfig } from "@/components/pages/manager/config/collections/seriesManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/series — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function SeriesManagerPage() {
  return <EditorialManagerList config={seriesManagerConfig} />;
}
