import * as React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const TOOLTIP_DEFAULT_X = 40
const TOOLTIP_DEFAULT_Y = 30
const TOOLTIP_WIDTH = 240

const TooltipWrap = styled.div`
    padding: 0.5rem 0.8rem;
    user-select: none;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5));
    border-radius: 3px;
    width: ${TOOLTIP_WIDTH}px;
    transition: opacity .4s ease;
    position: relative;
    z-index:2;

    > div {
        
    }

    &::before {
        content: "";
        display: block;
        position: absolute;
        z-index:1;
        background: white;
        right: 0px;
        bottom: -60px;
        width: 60px;
        height: 60px;
        clip-path: polygon(60% 0, 0 0, 100% 100%);
        display: none;
    }
`

const handleRotations = {
    "br": 0,
    "bl": 90,
    "tl": 180,
    "tr": 270
}

export default function Tooltip({
    tooltip_x = 0,
    tooltip_y = 0,
    tooltip_title = "Title",
    tooltip_desc = "",
    tooltip_offset_x = TOOLTIP_DEFAULT_X,
    tooltip_offset_y = TOOLTIP_DEFAULT_Y,
    tooltip_handle = "",
    isActive = false
}) {

  return (
    <TooltipWrap style={{
        left: tooltip_x,
        top: tooltip_y,
        position: "absolute",
        opacity: isActive ? 1 : 0
    }}>
      <Typography variant="h5">{tooltip_title}</Typography>
      {tooltip_desc ? <Typography>{tooltip_desc}</Typography> : ""}
    </TooltipWrap>
  )
}