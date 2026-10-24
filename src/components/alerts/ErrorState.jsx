"use client";

import { Box } from "@mui/material";
import NoDataInfo from "@/components/alerts/NoDataInfo";

/**
 * Error / no-data fallback.
 *
 * @param {{ isCn: boolean, schemaName?: string }} props
 */
export default function ErrorState({ isCn, schemaName = "series" }) {
  return (
    <Box style={{ marginTop: "24px" }}>
      <NoDataInfo schemaName={schemaName} isCn={isCn} />
    </Box>
  );
}