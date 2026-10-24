"use client";

import { useContext} from "react";
import {
  Typography,
  Tooltip,
} from "@mui/material";
import { LanguageContext } from "@/components/contexts/LanguageContext";
const TitleWithTooltip = ({textContent, titleStyles, tooltipColors = {}}) => {

const {isCn} = useContext(LanguageContext);

  // Default colors if not provided
  const defaultColors = {
    tooltipBg: "var(--background-primary, rgba(255, 255, 255, 0.95))",
    tooltipBorder: "var(--border-light, rgba(0,0,0,0.1))"
  };

  const colors = { ...defaultColors, ...tooltipColors };

  if (isCn) {
    return (
      <Tooltip
        title={
          <Typography sx={{ 
            fontSize: "13px", 
            p: 1, 
            whiteSpace: "pre-wrap", 
            lineHeight: 1.5 
          }}>
            {textContent.tooltipTitle}
            {"\n"}
            {textContent.tooltipDescription}
          </Typography>
        }
        arrow
        placement="bottom-start"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: colors.tooltipBg,
              color: "var(--text-primary, #333)",
              maxWidth: 350,
              border: `1px solid ${colors.tooltipBorder}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              p: 1
            }
          },
          arrow: {
            sx: {
              color: colors.tooltipBg,
              "&::before": {
                border: `1px solid ${colors.tooltipBorder}`
              }
            }
          }
        }}
      >
        <Typography 
          sx={{ 
            ...titleStyles,
            mb: 2.5,
            textAlign: "left",
            cursor: "help"
          }}
        >
          &#x273A; {textContent.mainTitle}
        </Typography>
      </Tooltip>
    );
  }

  return (
    <Typography 
      sx={{ 
        ...titleStyles,
        mb: 2.5,
        textAlign: "left",
      }}
    >
      &#x273A; {textContent.mainTitle}
    </Typography>
  );
};

export default TitleWithTooltip;