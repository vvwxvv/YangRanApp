"use client";

import LoadingAnimation from "@/components/animations/LoadingAnimation";
import React, { useContext, useMemo } from "react";
import { Box, Container, Grid } from "@mui/material";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ArtworkInfoCard from "./ArtworkInfoCard";
import AlertInfo from "@/components/alerts/AlertInfo";
import useArtworkData from "./hooks/useArtworkData";

/**
 * ArtworkListPageComponent — public gallery page listing all artworks.
 * Matches Prisma Artwork model fields.
 */
export default function ArtworkListPageComponent({ onArtworkClick }) {
  const { isCn } = useContext(LanguageContext);
  const { artworks, isLoading, error, handleRetry } = useArtworkData();

  // Filter by language
  const filteredArtworks = useMemo(() => {
    if (!artworks?.length) return [];
    return artworks.filter((item) =>
      isCn ? item?.language === "CN" : item?.language === "EN"
    );
  }, [artworks, isCn]);

  if (isLoading) return <LoadingAnimation isLoading />;

  if (error) {
    return (
      <AlertInfo
        message={error}
        severity="error"
        actionLabel={isCn ? "重试" : "Retry"}
        onAction={handleRetry}
      />
    );
  }

  if (!filteredArtworks.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <AlertInfo
          message={isCn ? "暂无作品" : "No artworks available"}
          severity="info"
        />
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {filteredArtworks.map((artwork, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={artwork?.id || index}>
              <ArtworkInfoCard
                item={artwork}
                imageKey="cover_img_url"
                isCn={isCn}
                onCardClick={() => onArtworkClick?.(artwork)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
