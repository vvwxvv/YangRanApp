"use client";

import React, { useState, useCallback, useContext } from "react";
import Link from "next/link";
import { Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { TableRows as TableRowsIcon } from "@mui/icons-material";
import useFont from '@/hooks/useFont';
import useButtonStyle from "@/hooks/useButtonStyle";
import { DeviceContext } from "@/components/contexts/DeviceContext";

export default function BatchEditButton({ buttonLabel, route, labelFontStyle }) {
  const { style: fontStyle }                               = useFont();
  const { batchedEditButtonStyle, batchedEditButtonHover } = useButtonStyle();
  const { isMobile }                                       = useContext(DeviceContext);
  const [pressed, setPressed]                              = useState(false);

  const appliedStyle = labelFontStyle || fontStyle;

  const handlePointerDown  = useCallback(() => setPressed(true),  []);
  const handlePointerLeave = useCallback(() => setPressed(false), []);
  const handlePointerUp    = useCallback(() => setPressed(false), []);

  // ── Early return AFTER all hooks ──────────────────────────────────────
  // Rules of Hooks: hooks must be called unconditionally on every render.
  // Returning null before useState/useCallback violates the rules and
  // causes a React warning in strict mode.
  if (isMobile || !route) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Link href={route} style={{ textDecoration: "none" }} draggable={false}>
        <motion.div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          whileHover={pressed ? undefined : batchedEditButtonHover}
          animate={{
            scale:   pressed ? 0.95 : 1,
            opacity: pressed ? 0.7  : 1,
          }}
          transition={
            pressed
              ? { duration: 0.05 }
              : { duration: 0.18, ease: "easeOut" }
          }
          style={{
            display:                 "inline-block",
            WebkitTapHighlightColor: "transparent",
            touchAction:             "manipulation",
            userSelect:              "none",
            WebkitUserSelect:        "none",
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <TableRowsIcon
                sx={{ color: "var(--text-primary, #000)", pointerEvents: "none" }}
              />
            }
            size="small"
            tabIndex={-1}
            style={{ ...batchedEditButtonStyle, ...appliedStyle }}
          >
            {buttonLabel}
          </Button>
        </motion.div>
      </Link>
    </Box>
  );
}