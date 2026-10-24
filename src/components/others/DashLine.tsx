import React from "react";
import {Box} from "@mui/material";
import { useReverseTheme } from "@/hooks/useReverseTheme";

const DashLine: React.FC = () => {
  const { colors } = useReverseTheme();
  
  return (
    <Box 
      sx={{
        borderTop: `2px dashed ${colors.text}`,
        marginBottom: '1rem',
        opacity: 0.3
      }}
    />
  );
};

interface DashLineThinProps {
  color?: string;
}

export default DashLine;