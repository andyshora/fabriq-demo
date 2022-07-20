import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const TOOLTIP_DEFAULT_X = 40
const TOOLTIP_DEFAULT_Y = 30
const TOOLTIP_WIDTH = 240

const TooltipWrap = styled.aside`
    padding: 0.5rem 0.8rem;
    user-select: none;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5));
    border-radius: 3px;
    width: ${TOOLTIP_WIDTH}px;
`

export default function Tooltip({
    tooltip_x = 0,
    tooltip_y = 0,
    tooltip_title = "Title",
    tooltip_desc = "",
    tooltip_offset_x = TOOLTIP_DEFAULT_X,
    tooltip_offset_y = TOOLTIP_DEFAULT_Y,
    tooltip_dir = "",
    isActive = false
}) {
const onLeft = tooltip_dir === "bl" || tooltip_dir === "tl"
const offset_x = onLeft ? -TOOLTIP_WIDTH : 0
  return (
    <TooltipWrap style={{
        left: tooltip_x + offset_x,
        top: tooltip_y,
        position: "absolute",
        border: isActive ? "4px solid lime" : "none" 
    }}>
      <Typography variant="h5">{tooltip_title}</Typography>
      {tooltip_desc ? <Typography>{tooltip_desc}</Typography> : ""}
    </TooltipWrap>
  )
}