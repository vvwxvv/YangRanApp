"use client";

import { Box } from "@mui/material";
import LoadingLayer from "@/components/animations/LoadingLayer";

/**
 * Full-page centered loading spinner.
 * Reused by SeriesDetail, SeriesPageComponent, any detail page.
 */
export default function LoadingState() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingLayer isLoading={true} />
    </Box>
  );
}