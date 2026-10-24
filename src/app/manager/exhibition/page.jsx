"use client";

import React from "react";
import { exhibitionManagerConfig } from "@/components/pages/manager/config/collections/exhibitionManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/exhibition — shared editorial manager layout (Cards + List).
 */
export default function ExhibitionManagerPage() {
  return <EditorialManagerList config={exhibitionManagerConfig} />;
}
