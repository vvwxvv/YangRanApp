"use client";

import React from "react";
import { videoManagerConfig } from "@/components/pages/manager/config/collections/videoManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/video — shared editorial manager layout (Cards + List).
 */
export default function VideoManagerPage() {
  return <EditorialManagerList config={videoManagerConfig} />;
}
