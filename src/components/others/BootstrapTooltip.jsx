import React from "react";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import useFont from '@/hooks/useFont';


// Styling for the tooltip
const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const BootstrapTooltipComponent = ({ title, children }) => {
  const { style: labelFontStyle, labelFontFamily } = useFont();
  return (
    <Tooltip title={<span style={{ ...labelFontStyle, fontFamily: labelFontFamily }}>{title}</span>}>
      {children}
    </Tooltip>
  );
};

export default BootstrapTooltipComponent;