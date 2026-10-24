"use client";

import React from "react";
import { eventManagerConfig } from "@/components/pages/manager/config/collections/eventManagerConfig";
import EditorialManagerList from "@/components/pages/manager/layouts/EditorialManagerList";

/**
 * /manager/event — shared editorial manager layout.
 * Collection specifics live in the config, not in the page.
 */
export default function EventManagerPage() {
  return <EditorialManagerList config={eventManagerConfig} />;
}
