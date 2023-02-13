import { useEffect, useState } from 'react'
import Draggable from "react-draggable"
import _debounce from "lodash-es/debounce"
import _findIndex from "lodash-es/findIndex"
import styled, { css, keyframes } from 'styled-components'
import { Select, MenuItem, FormControl, FormControlLabel, InputLabel, Switch } from "@mui/material"

import Annotation from "./components/Annotation"
import archetypes from "./archetypes.json"

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
  z-index: 4;

  > img {
    margin: 10px 0 10px 2rem;
  }
`

const FooterControls = styled.aside`
  position: fixed;
  left: 0r;
  bottom 0;
  padding: 1rem;
  z-index: 4;
  display: none;
`

const swipeEnter = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`


const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const overlayEnter = keyframes`
  0% {
    transform: translateX(-50px);
  }
  100% {
    transform: translateX(0px);
  }
`

const slideAway = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
`

const slidewayFrag = css`${slideAway} .6s 1s linear forwards`
const fadeOutFrag = css`${fadeOut} 1s linear forwards`

const AtlasWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  background: url(images/mesh-white.png) 0 0 no-repeat;
  background-size: 100%;
  filter: invert(1) blur(10px);
`

const WhiteMeshWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  width: ${VIDEO_WIDTH}px;
  height: ${VIDEO_HEIGHT}px;
  background: url(images/mesh-white.png) 0 0 no-repeat;
  background-size: 100%;
  animation: ${p => p.isHidden ? slidewayFrag : 'none' };
`

const DraggableAreaWrap = styled.div`
  
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  z-index: 3;
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
    animation: ${overlayEnter} 1.6s forwards;

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
  animation: ${p => p.isHidden ? fadeOutFrag : 'none' };
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
  const [isAtlasShowing, setIsAtlasShowing] = useState(false)
  const [draggableBounds, setDraggableBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 })

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

  function handleAtlasSwitchChange(e) {
    setIsAtlasShowing(e.target.checked)
  }

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

    console.log(clickX, clickY)
    
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
      <FooterControls>
        <FormControlLabel control={<Switch defaultChecked={false}  onChange={handleAtlasSwitchChange} />} label="Show Atlas" />
        isAtlasShowing: {isAtlasShowing ? "YES" : "NO"}
      </FooterControls>
      <DraggableAreaWrap>
        <Draggable
          defaultPosition={{x: -600, y: -1000}}
          bounds={draggableBounds}
          handle=".react-draggable-handle">
          <div style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }}>
            <AtlasWrap style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }} /> 
            <WhiteMeshWrap isHidden={isAtlasShowing} style={{ width: VIDEO_WIDTH, height: VIDEO_HEIGHT }} />
            {archetypes.map((a, i) => (
              <Video style={{ display: i === activeArchetypeIndex ? "block" : "none" }} isHidden={isAtlasShowing} autoPlay muted loop id="bg-video">
                <source src={process.env.PUBLIC_URL + '/images/' + a.video} type="video/mp4" />
              </Video>
            ))}
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
      </DraggableAreaWrap>
    </div>
  )
}