import * as React from 'react';
import styled, { css } from 'styled-components';
import { Typography } from '@mui/material';

const TOOLTIP_DEFAULT_X = 40
const TOOLTIP_DEFAULT_Y = 30
const TOOLTIP_WIDTH = 240

const HANDLE_LENGTH = 80;

const handles = {
  tl: `
    &::before {
      content: '';
      height: 3px;
      width: 80px;
      background: white;
      position: absolute;
      top: 0;
      left: 2px;
      z-index: 5;
      display: block;
      transform: rotate(-135deg);
      transform-origin: left;
    }
  `,
  tr: `
    &::before {
      content: '';
      height: 3px;
      width: 80px;
      background: white;
      position: absolute;
      top: 0;
      right: -${HANDLE_LENGTH - 2}px;
      z-index: 5;
      display: block;
      transform: rotate(-45deg);
      transform-origin: left;
    }
  `,
  br: `
    &::before {
      content: '';
      height: 3px;
      width: 80px;
      background: white;
      position: absolute;
      bottom: 0;
      right: -${HANDLE_LENGTH - 2}px;
      z-index: 5;
      display: block;
      transform: rotate(45deg);
      transform-origin: left;
    }
  `,
  bl: `
    &::before {
      content: '';
      height: 3px;
      width: 80px;
      background: white;
      position: absolute;
      bottom: 0;
      left: 2px;
      z-index: 5;
      display: block;
      transform: rotate(135deg);
      transform-origin: left;
    }
  `
}

const TooltipWrap = styled.div`
    padding: 0.5rem 0.8rem;
    user-select: none;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7));
    border-radius: 3px;
    width: ${TOOLTIP_WIDTH}px;
    transition: opacity .4s ease;
    position: relative;
    z-index:2;

    > div {
        
    }

    ${({ handleDir }) => Object.keys(handles).includes(handleDir) ? css`${handles[handleDir]}` : ''}
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
    }} handleDir={tooltip_handle}>
      <Typography variant="h5">{tooltip_title}</Typography>
      {tooltip_desc ? <Typography>{tooltip_desc}</Typography> : ""}
    </TooltipWrap>
  )
}