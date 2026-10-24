"use client";

import React from "react";
import { artworkManagerConfig } from "@/components/pages/manager/config/collections/artworkManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/artwork — editorial manager layout (bibliography UI) with two
 * view modes: the manager cards (unchanged, grouped by year) and the
 * editorial list rows.
 */
export default function ArtworkManagerPage() {
  return <EditorialManagerList config={artworkManagerConfig} />;
}
