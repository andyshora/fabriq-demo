import { useEffect, useState } from 'react'
import Draggable from "react-draggable"
import CloseIcon from "@mui/icons-material/Close"
import _debounce from "lodash-es/debounce"
import _findIndex from "lodash-es/findIndex"
import styled, { keyframes } from 'styled-components'

import archetypes from "./archetypes.json"

import { Button, Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, IconButton, CardActions } from "@mui/material"
import { KeyboardArrowRight } from '@mui/icons-material'

const ZOOM = 0.5

const VIDEO_WIDTH = 8000 * ZOOM
const VIDEO_HEIGHT = 4000 * ZOOM

const Header = styled.header`
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  background: white;
  z-index: 3;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);

  > img {
    margin: 10px 0 10px 2rem;
  }
`

const DebugWrap = styled.aside`
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;
  color: blue;
  text-align: right;
  pointer-events: none;
  font-family: Courier, monospace;
  font-size: 12px;
  display: none;
`

const ImageWrap = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
`

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

const swipeEnter = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;

  }
`

const TooltipCard = styled(Card)`
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  animation: ${tooltipEnter} 1.6s forwards;
`

const OverlayWrap = styled.div`
  position: absolute;
  animation: ${swipeEnter} 1.6s forwards;
  z-index: 2;
  
  &::after {
    content: '';
    width: 100px;
    height: 100px;
    background: rgba(35, 186, 142, 0.5);
    
    transform-origin: 0 0;
    position: absolute;
    left: -100px;
    bottom: -20px;
    animation: ${tooltipEnter} 1.6s forwards;

    clip-path: polygon(100% 0, 0 100%, 100% 59%);

  }
`

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  width: ${VIDEO_WIDTH}px;
  height: ${VIDEO_HEIGHT}px;
  transition: all 1s ease;
`

const pulseEntranceAnim = keyframes`
  0% {
    opacity: 1;
    background: radial-gradient(rgba(35, 186, 142, 1)  0%, transparent 50%);
    border-color: rgba(35, 186, 142, 1);
  }
  80% {
    border-color: rgba(35, 186, 142, 1);
  }
  100% {
    opacity: 0;
    border-color: rgba(35, 186, 142, 0);
  }
`

const InteractionPulse = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin: -100px 0 0 -100px;
  bottom: -110px;
  left: -90px;
  background: radial-gradient(rgba(35, 186, 142)  0%, transparent 50%);
  animation: ${pulseEntranceAnim} 3s forwards;
  border: 1px dashed rgba(35, 186, 142, 1);
`

function Annotation({ id, type, onClose, title, body1, body2, onNextTapped, onLaunchTapped }) {
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

const DraggableHandleLayer = styled.div({
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
  position: "absolute",
  left: 0,
  top: 0,
  zIndex: 1,
  opacity: 0
})

function getWindowDimensions() {
  const width = window.innerWidth
  const height = window.innerHeight
  return {
      width,
      height,
      centerX: Math.floor(width / 2),
      centerY: Math.floor(height / 2)
  }
}

export default function App() {

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [activeInteractionAreas, setActiveInteractionAreas] = useState([])
  const [activeArchetypeIndex, setActiveArchetypeIndex] = useState(0)
  const [draggableBounds, setDraggableBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 })
  const [lastMouseDownLocation, setLastMouseDownLocation] = useState({ x: 0, y: 0 })
  const [draggableOffset, setDraggableOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    const debouncedResize = _debounce(handleResize, 50)
    
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [])

  useEffect(() => {
    const xRange = [0, -VIDEO_WIDTH + windowDimensions.width ]
    const yRange = [0, -VIDEO_HEIGHT + windowDimensions.height ]
    setDraggableBounds({ left: xRange[1], top: yRange[1], right: xRange[0], bottom: yRange[0] })
  }, [windowDimensions])

  function handleFlavourChange(e) {
    setActiveArchetypeIndex(parseInt(e.target.value, 10))
  }

  function handleLaunchTapped(e) {
    // todo - soft redirect to app?
  }

  function handleNextTapped() {
    // find index of current
    if (!activeInteractionAreas.length) {
      return
    }
    let indx = _findIndex(archetypes[activeArchetypeIndex].tooltips, ({ id }) => id === activeInteractionAreas[0].id)

    // end check
    if (indx === archetypes[activeArchetypeIndex].tooltips.length - 1) {
      indx = 0
    } else {
      indx++
    }

    setActiveInteractionAreas([archetypes[activeArchetypeIndex].tooltips[indx]])
  }

  function handleDraggableClicked(e) {
    
    const clickX = e.nativeEvent.offsetX
    const clickY = e.nativeEvent.offsetY
    
    // use click location to determine which areas should become active
    const activeAreas = archetypes[activeArchetypeIndex].tooltips.filter(({ x, y, width, height }) => {
      return clickX >= x && clickX <= x + width && clickY >= y && clickY <= y + height
    })

    // we want to ensure open annotations persist until they are manually closed
    if (activeAreas.length) {
      setActiveInteractionAreas([activeAreas[0]])
    }
    
  }

  function handleTooltipClose() {
    setActiveInteractionAreas([])
  }

  function handleDragEvent(e, data) {
    switch (e.type) {
      case "mousedown":
        // console.log('Event Type', e.type, data);
        if (data && !Number.isNaN(data.x)) {
          setLastMouseDownLocation({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
        }
        break;
      case "mouseup":
        // console.log('Event Type', e.type, data);
        setDraggableOffset({ x: data.x, y: data.y })
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <Header>
        <img src={process.env.PUBLIC_URL + '/images/logo-small.png'} alt="FABRIQ" height={40} />
        <FormControl fullWidth>
          <InputLabel id="archetype-label">Archetype</InputLabel>
          <Select
            labelId="archetype-label"
            id="archetype"
            value={activeArchetypeIndex}
            label="Age"
            onChange={handleFlavourChange}
          >
            {archetypes.map((a, i) => <MenuItem key={`archetype-${a.title}`} value={i}>{a.title}</MenuItem>)}
          </Select>
        </FormControl>
      </Header>
      <ImageWrap>
        <Draggable
          defaultPosition={{x: -600, y: -1000}}
          bounds={draggableBounds}
          handle=".react-draggable-handle"
          onStart={handleDragEvent}
          onDrag={handleDragEvent}
          onStop={handleDragEvent}>
          <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }}>
            <Video autoPlay muted loop id="bg-video">
              <source src={process.env.PUBLIC_URL + '/images/' + archetypes[activeArchetypeIndex].video} type="video/mp4" />
            </Video>
            {activeInteractionAreas.map((area, i) => (
              <OverlayWrap key={`interaction-area-${area.id}`} style={{ width: area.width, left: area.x + area.width + 100, top: area.y - 200 }}>
                <Annotation {...area} onClose={handleTooltipClose} onNextTapped={handleNextTapped} onLaunchTapped={handleLaunchTapped} data-id={area.id} />
                <InteractionPulse />
              </OverlayWrap>
              ))
            }
            <DraggableHandleLayer
              className="react-draggable-handle"
              onTouchEnd={handleDraggableClicked}
              onClick={handleDraggableClicked} />
          </div>
        </Draggable>
      </ImageWrap>
    </div>
  )
}