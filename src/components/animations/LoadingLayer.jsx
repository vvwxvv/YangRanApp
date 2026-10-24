"use client";

import React from "react";
import LoadingAnimation from "@/components/animations/LoadingAnimation";

/**
 * Backwards-compatible manager loading layer.
 * All pages share the same full-screen LoadingAnimation.
 *
 * While it is visible it also holds the global page-loading gate: a page that
 * renders this (manager lists, edit pages waiting for their record) keeps the
 * shell hidden, so users never see a finished-looking nav/footer wrapped around
 * a page that is still loading.
 */
export default function LoadingLayer({ isLoading = true }) {
  return <LoadingAnimation isLoading={isLoading} />;
}
