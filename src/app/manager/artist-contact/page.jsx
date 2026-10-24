"use client";

import React from "react";
import { artistContactManagerConfig } from "@/components/pages/manager/config/collections/artistContactManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/artist-contact — shared editorial manager layout (list only).
 */
export default function GalleryArtistContactManagerPage() {
  return <EditorialManagerList config={artistContactManagerConfig} />;
}
