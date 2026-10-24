"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import useFont from '@/hooks/useFont';

/**
 * ArtworkInfoCard — card component for displaying artwork info on grid layout.
 * Used by FeatureArtworkSection on the home page.
 *
 * Props:
 *   item        — artwork object (Prisma Artwork model fields)
 *   fields      — card fields config
 *   imageKey    — field name for the image URL (default: "cover_img_url")
 *   isCn        — boolean for Chinese/English
 *   onCardClick — click handler
 *   style       — additional styles
 */
export default function ArtworkInfoCard({
  item = {},
  fields,
  imageKey = "cover_img_url",
  isCn,
  onCardClick,
  style = {},
}) {
  const { contentFontFamily, contentTitleFontFamily } = useFont();
  const imgUrl = item?.[imageKey] || item?.cover_img_url || "";
  const title = item?.title || (isCn ? "无标题" : "Untitled");
  const year = item?.year || "";
  const medium = item?.medium || "";
  const caption = item?.caption || "";

  return (
    <Box
      className="artwork-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        ...style,
      }}
      onClick={onCardClick}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "100%",
          overflow: "hidden",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {imgUrl ? (
          <Box
            component="img"
            src={imgUrl}
            alt={title}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: "0.875rem",
              fontFamily: contentFontFamily,
            }}
          >
            {isCn ? "暂无图片" : "No Image"}
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ mt: 1.5, px: 0.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.3,
            fontFamily: contentTitleFontFamily,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        {year && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              fontFamily: contentFontFamily,
              mt: 0.25,
            }}
          >
            {year}
          </Typography>
        )}
        {medium && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontFamily: contentFontFamily,
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {medium}
          </Typography>
        )}
        {caption && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              fontFamily: contentFontFamily,
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
