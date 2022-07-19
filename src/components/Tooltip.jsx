import * as React from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const TOOLTIP_DEFAULT_X = 40
const TOOLTIP_DEFAULT_Y = 30

export default function Tooltip({
    tooltip_x = 0,
    tooltip_y = 0,
    tooltip_title = "Title",
    tooltip_desc = "",
    tooltip_offset_x = TOOLTIP_DEFAULT_X,
    tooltip_offset_y = TOOLTIP_DEFAULT_Y
}) {
  return (
    <aside style={{
        left: tooltip_x,
        top: tooltip_y,
        position: "absolute"
    }}>
      <Typography variant="h3">{tooltip_title}</Typography>
      {tooltip_desc ? <Typography>{tooltip_desc}</Typography> : ""}
    </aside>
  )
}