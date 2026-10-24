"use client";

import React from "react";
import { aboutManagerConfig } from "@/components/pages/manager/config/collections/aboutManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/about — shared editorial manager layout (list only).
 */
export default function AboutManagerPage() {
  return <EditorialManagerList config={aboutManagerConfig} />;
}
