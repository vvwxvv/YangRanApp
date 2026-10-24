import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: () => void;
  autoHideDuration?: number;
  children?: React.ReactNode;
  sx?: object;
  snackbarSx?: object;
  closeLabel?: string;
  anchorOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
  alertProps?: object;
}

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 4000,
  children,
  sx = {},
  snackbarSx = {},
  closeLabel,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  alertProps = {},
}) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    sx={snackbarSx}
  >
    <Alert
      onClose={onClose}
      severity={severity}
      sx={{ borderRadius: "8px", ...sx }}
      {...alertProps}
    >
      {message}
      {children}
    </Alert>
  </Snackbar>
);

export default AppSnackbar; 