import React from "react";
import PropTypes from "prop-types";
import { Stack, Button } from "@mui/material";
import {
  Save,
  Plus,
  Trash2,
  Download,
} from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

export function BatchEditActions({
  hasChanges,
  isSaving,
  selectedRows = [],
  onSave,
  onAdd,
  onDelete,
  onDownloadCSV, // New prop for CSV download
  getLabel,
  labelFontStyle = {},
}) {
  const isDark = useDarkMode();
  const borderColor = isDark ? "var(--border-light, #ffffff)" : "var(--border-light, #000000)";
  const textColor = isDark ? "var(--text-primary, #ffffff)" : "var(--text-primary, #000000)";
  const backgroundColor = isDark ? "var(--background-primary, #000000)" : "var(--background-primary, #000000)";
  const hoverTextColor = isDark ? "var(--text-primary, #ffffff)" : "var(--text-primary, #000000)";
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
      <Button
        variant="outlined"
        startIcon={<Save size={18} />}
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        style={{
          ...labelFontStyle,
          backgroundColor: "transparent",
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          fontSize: "11px"
        }}
        sx={{
          '&:hover': {
            backgroundColor: "transparent",
            color: hoverTextColor,
            borderTop: `1px solid ${borderColor}`,
            borderLeft: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            borderBottom: `3px solid ${borderColor}`
          }
        }}
      >
        {isSaving ? getLabel("saving") : getLabel("save")}
      </Button>
      <Button
        variant="outlined"
        startIcon={<Plus size={18} />}
        onClick={onAdd}
        style={{
          ...labelFontStyle,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "3px 10px",
          fontSize: "11px"
        }}
        sx={{
          '&:hover': {
            backgroundColor: isDark ? 'var(--interactive-background-hover, rgba(255, 255, 255, 0.1))' : 'var(--interactive-background-hover, rgba(0, 0, 0, 0.1))',
            color: hoverTextColor,
            border: `1px solid ${borderColor}`
          }
        }}
      >
        {getLabel("addRow")}
      </Button>
      <Button
        variant="outlined"
        startIcon={<Trash2 size={18} />}
        onClick={onDelete}
        disabled={selectedRows.length === 0}
        style={{
          ...labelFontStyle,
          color: "#d32f2f",
          border: "1px solid #d32f2f",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          fontSize: "11px"
        }}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            color: "#d32f2f",
            border: "1px solid #d32f2f"
          }
        }}
      >
        {getLabel("deleteSelected")} {selectedRows.length > 0 && `(${selectedRows.length})`}
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download size={18} />}
        onClick={onDownloadCSV} // Call the CSV download handler
        style={{
          ...labelFontStyle,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          fontSize: "11px"
        }}
        sx={{
          '&:hover': {
            backgroundColor: isDark ? 'var(--interactive-background-hover, rgba(255, 255, 255, 0.1))' : 'var(--interactive-background-hover, rgba(0, 0, 0, 0.1))',
            color: hoverTextColor,
            border: `1px solid ${borderColor}`
          }
        }}
      >
        {getLabel("exportData")}
      </Button>
    </Stack>
  );
}

BatchEditActions.propTypes = {
  hasChanges: PropTypes.bool,
  isSaving: PropTypes.bool,
  selectedRows: PropTypes.array,
  processedData: PropTypes.array,
  onSave: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onDownloadCSV: PropTypes.func, // New prop type
  getLabel: PropTypes.func.isRequired,
  labelFontStyle: PropTypes.object,
};

export default BatchEditActions;