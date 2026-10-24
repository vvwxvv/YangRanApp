import { styled, alpha } from "@mui/material/styles";
import { Paper, Button, TableContainer, TableCell, TableSortLabel, Box, Dialog, DialogTitle } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "16px",
  backgroundColor: "var(--background-primary, #fff)",
  border: "1px solid var(--border-light, #e0e0e0)",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
  }
}));

export const StyledButton = styled(Button)(({ theme, variant, color }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 20px",
  transition: "all 0.3s ease",
  ...(variant === "contained" && {
    backgroundColor: "var(--background-primary, #000)",
    color: "var(--text-primary, #fff)",
    "&:hover": {
      backgroundColor: "var(--interactive-background-hover, #333)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    "&:disabled": {
      backgroundColor: "var(--interactive-background-hover, #ccc)",
      color: "var(--text-primary, #fff)",
    }
  }),
  ...(variant === "outlined" && {
    borderColor: color === "error" ? "#d32f2f" : "var(--border-light, #000)",
    color: color === "error" ? "#d32f2f" : "var(--text-primary, #000)",
    "&:hover": {
      borderColor: color === "error" ? "#f44336" : "var(--border-light, #333)",
      backgroundColor: color === "error" ? alpha("#d32f2f", 0.04) : alpha("#000", 0.04),
      transform: "translateY(-2px)",
    }
  })
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 350px)",
  minHeight: "500px",
  borderRadius: "12px",
  border: "1px solid var(--border-light, #e0e0e0)",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--background-primary, #fff)",
  "& .MuiTable-root": {
    height: "100%",
  },
  "& .MuiTableBody-root": {
    flex: 1,
  },
  "&::-webkit-scrollbar": {
    width: "10px",
    height: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "var(--background-secondary, #f5f5f5)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "var(--border-medium, #bbb)",
    borderRadius: "10px",
    "&:hover": {
      background: "var(--text-secondary, #888)",
    }
  }
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid var(--border-light, #f0f0f0)",
  color: "var(--text-primary, #000)",
  "&.MuiTableCell-head": {
    backgroundColor: "var(--background-secondary, #fafafa)",
    fontWeight: 700,
    color: "var(--text-primary, #000000)", // Header text should always be black for contrast
    borderBottom: "2px solid var(--border-light, #e0e0e0)",
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: "var(--interactive-background-hover, #f0f0f0)",
    }
  }
}));

export const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  "&.MuiTableSortLabel-root": {
    color: "var(--text-primary, #000000)", // Header sort label should always be black
    "&:hover": {
      color: "var(--text-primary, #000000)",
    },
    "&.Mui-active": {
      color: "var(--text-primary, #000000)",
      "& .MuiTableSortLabel-icon": {
        color: "var(--text-primary, #000000)",
      }
    }
  }
}));

export const AnimatedBox = styled(Box)(({ theme }) => ({
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" }
  },
  animation: "fadeIn 0.5s ease-out",
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
  }
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  borderBottom: "1px solid var(--border-light, #e0e0e0)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  fontWeight: 600,
  color: "var(--text-primary, #000)",
})); 