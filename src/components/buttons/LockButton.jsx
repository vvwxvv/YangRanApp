import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function LockButton({ onClick }) {
  return (
    <Tooltip title="Lock">
      <IconButton onClick={onClick} color="primary" aria-label="lock">
        <LockIcon />
      </IconButton>
    </Tooltip>
  );
}