"use client";

// ListPaginationBar.jsx
// Reusable pagination footer: rows-per-page selector + range text + page buttons.
// Rows-per-page uses a custom dropdown (same AnimatePresence pattern as MobileDropdown)
// so it fully respects tok.bg / tok.text — no MUI Portal / Paper blowout.

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence }                         from "framer-motion";
import { Box, Pagination, Typography }                     from "@mui/material";
import useBatchEditTokens                                  from "@/components/pages/manager/hooks/useBatchEditTokens";

const ROWS_OPTIONS = [10, 25, 50, 100, 500];

// ─── animation presets (mirrors MobileDropdown) ──────────────────────────────
const dropdownVariants = {
  hidden:  { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut", staggerChildren: 0.03 },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.16, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit:    { opacity: 0, x: -8, transition: { duration: 0.1 } },
};

// ─── RowsDropdown ─────────────────────────────────────────────────────────────
function RowsDropdown({ value, options, onChange, tok }) {
  const [open,        setOpen]        = useState(false);
  const [hoveredOpt,  setHoveredOpt]  = useState(null);
  const [pressedOpt,  setPressedOpt]  = useState(null);
  const [trigHovered, setTrigHovered] = useState(false);
  const [trigPressed, setTrigPressed] = useState(false);
  const containerRef                  = useRef(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((p) => !p), []);

  const handleSelect = useCallback(
    (opt) => {
      onChange({ target: { value: opt } });
      setOpen(false);
    },
    [onChange]
  );

  return (
    <Box
      ref={containerRef}
      sx={{ position: "relative", display: "inline-block", minWidth: 72 }}
    >
      {/* Trigger button — same style logic as MobileDropdown parent row */}
      <button
        onClick={toggle}
        onMouseEnter={() => setTrigHovered(true)}
        onMouseLeave={() => { setTrigHovered(false); setTrigPressed(false); }}
        onMouseDown={() => setTrigPressed(true)}
        onMouseUp={() => setTrigPressed(false)}
        onTouchStart={() => setTrigPressed(true)}
        onTouchEnd={() => setTrigPressed(false)}
        style={{
          display:                  "flex",
          alignItems:               "center",
          justifyContent:           "space-between",
          gap:                      "6px",
          padding:                  "4px 10px",
          background:               trigPressed
            ? `${tok.text}18`
            : trigHovered
            ? `${tok.text}0e`
            : tok.bg,
          border:                   `1px solid ${tok.borderSoft}`,
          borderRadius:             "6px",
          cursor:                   "pointer",
          outline:                  "none",
          WebkitTapHighlightColor:  "transparent",
          userSelect:               "none",
          transition:               "background 0.15s ease, transform 0.12s ease",
          transform:                trigPressed ? "scale(0.97)" : "scale(1)",
          minWidth:                 72,
        }}
      >
        <span style={{ fontSize: "10px", color: tok.text, fontWeight: 500 }}>
          {value}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            display:    "inline-flex",
            alignItems: "center",
            color:      tok.text,
            fontSize: "9px",
            opacity:    trigPressed ? 0.4 : 0.6,
            transition: "opacity 0.12s ease",
          }}
        >
          ▾
        </motion.span>
      </button>

      {/* Dropdown — absolutely positioned, no Portal */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position:     "absolute",
              bottom:       "calc(100% + 4px)",  // opens upward (above trigger)
              left:         0,
              minWidth:     "100%",
              overflow:     "hidden",
              backgroundColor: tok.bg,
              border:       `1px solid ${tok.borderSoft}`,
              borderRadius: "6px",
              boxShadow:    `0 4px 16px ${tok.text}18`,
              zIndex:       999,
            }}
          >
            {options.map((opt) => (
              <motion.div
                key={opt}
                variants={itemVariants}
                onMouseEnter={() => setHoveredOpt(opt)}
                onMouseLeave={() => { setHoveredOpt(null); setPressedOpt(null); }}
                onMouseDown={() => setPressedOpt(opt)}
                onMouseUp={() => setPressedOpt(null)}
                onTouchStart={() => setPressedOpt(opt)}
                onTouchEnd={() => setPressedOpt(null)}
                onClick={() => handleSelect(opt)}
                style={{
                  padding:         "8px 14px",
                  cursor:          "pointer",
                  fontSize: "10px",
                  color:           tok.text,
                  backgroundColor:
                    opt === value
                      ? `${tok.text}14`
                      : pressedOpt === opt
                      ? `${tok.text}18`
                      : hoveredOpt === opt
                      ? `${tok.text}0c`
                      : "transparent",
                  fontWeight:      opt === value ? 600 : 400,
                  transition:      "background-color 0.12s ease",
                  whiteSpace:      "nowrap",
                }}
              >
                {opt}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ─── ListPaginationBar ────────────────────────────────────────────────────────

/**
 * @param {number}   page                – 0-based current page index
 * @param {number}   rowsPerPage         – Rows shown per page
 * @param {number}   count               – Total record count
 * @param {function} onPageChange        – (event, newPage0Based) => void
 * @param {function} onRowsPerPageChange – (event) => void  (event.target.value = new rowsPerPage)
 * @param {number[]} rowsOptions         – Override the page-size options
 * @param {object}   labelFontStyle      – Optional MUI sx font overrides
 * @param {object}   sx                  – Container sx overrides
 */
export default function ListPaginationBar({
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  rowsOptions    = ROWS_OPTIONS,
  labelFontStyle = {},
  sx             = {},
}) {
  const tok = useBatchEditTokens();

  const rangeStart = page * rowsPerPage + 1;
  const rangeEnd   = Math.min((page + 1) * rowsPerPage, count);

  return (
    <Box
      sx={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        padding:        "16px 0",
        borderTop:      `1px solid ${tok.borderSoft}`,
        marginTop:      "16px",
        flexWrap:       "wrap",
        gap:            "8px",
        ...sx,
      }}
    >
      {/* Rows-per-page — custom dropdown, no MUI Portal */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Typography sx={{ fontSize: "10px", color: tok.muted, ...labelFontStyle }}>
          Rows per page:
        </Typography>
        <RowsDropdown
          value={rowsPerPage}
          options={rowsOptions}
          onChange={onRowsPerPageChange}
          tok={tok}
        />
      </Box>

      {/* Range label */}
      <Typography sx={{ fontSize: "10px", color: tok.muted, ...labelFontStyle }}>
        {rangeStart}–{rangeEnd} of {count}
      </Typography>

      {/* Page buttons — MUI Pagination is fine (no Portal) */}
      <Pagination
        count={Math.ceil(count / rowsPerPage)}
        page={page + 1}
        onChange={(_, p) => onPageChange(null, p - 1)}
        size="small"
        siblingCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            color:        tok.text,
            border:       `1px solid ${tok.borderSoft}`,
            borderRadius: "6px",
            fontSize: "10px",
            "&.Mui-selected": {
              backgroundColor: tok.text,
              color:           tok.bg,
              "&:hover":       { backgroundColor: tok.text },
            },
            "&:hover": { backgroundColor: tok.bgHover },
          },
        }}
      />
    </Box>
  );
}