import CloseIcon from "@mui/icons-material/Close"
import { KeyboardArrowRight } from '@mui/icons-material'
import { Button, Box, Card, CardContent, Typography, IconButton, CardActions } from "@mui/material"
import styled, { keyframes } from 'styled-components'


const tooltipEnter = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
`

const TooltipCard = styled(Card)`
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  animation: ${tooltipEnter} 1.6s forwards;
`

export default function Annotation({ id, type, onClose, title, body1, body2, onNextTapped, onLaunchTapped }) {
    return (
      <TooltipCard style={{ width: 400 }}>
        <CardContent style={{ minHeight: 200 }}>
          <IconButton aria-label="Close" onClick={onClose} style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ pr: 1 }}>
            <Typography variant="h3">{title}</Typography>
            <Typography>{body1}</Typography>
            { body2 ? <Typography sx={{ pt: 0.5 }}>{body2}</Typography> : '' }
          </Box>
        </CardContent>
        {type === 'launch' ? <CardActions><Button onClick={onLaunchTapped} variant="contained">Launch App</Button></CardActions> : <CardActions><Button onClick={onNextTapped} variant="contained">Next <KeyboardArrowRight /></Button></CardActions>}
      </TooltipCard>
    )
  }