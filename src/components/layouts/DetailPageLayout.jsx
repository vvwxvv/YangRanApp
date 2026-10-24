"use client";
import { useContext } from "react";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import { Box, Container } from "@mui/material";
import LoadingLayer from "@/components/animations/LoadingLayer";
import NoDataInfo from "@/components/alerts/NoDataInfo";

/**
 * Reusable layout component for detail pages (reading, writing, etc.)
 * @param {Object} props
 * @param {boolean} props.loading - Loading state
 * @param {Error|null} props.error - Error object
 * @param {Object} props.data - Data object to display
 * @param {string} props.title_cn - Chinese page title
 * @param {string} props.title_en - English page title
 * @param {string} props.schemaName - Schema name for NoDataInfo component
 * @param {React.ReactNode} props.children - Detail component content
 */
export default function DetailPageLayout({
  loading,
  error,
  data,
  schemaName,
  children,
}) {
  const { isMobile } = useContext(DeviceContext);
  
  if (loading) {
    return (
      <Box
        sx={{
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

  if (error || !data) {
    return (
      <Box sx={{ mt: 3 }}>
        <NoDataInfo schemaName={schemaName} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        width: "100%",
        marginLeft: '0px',
        marginRight:'0px',
        marginTop: isMobile ? '20px' : '-30px',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          maxWidth: "100%",
          background: "transparent",
        }}
      >

        <Box sx={{ background: "transparent" }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
}