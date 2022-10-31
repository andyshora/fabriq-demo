import { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react';
import Draggable from "react-draggable"
import IconButton from '@mui/material/IconButton';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import PrevIcon from '@mui/icons-material/ArrowBackIos';
import { useHotkeys } from 'react-hotkeys-hook'
import _debounce from "lodash-es/debounce"

import Tooltip from './components/Tooltip';
import story from "./content/story.json"
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';

const IMG_WIDTH = 4000
const IMG_HEIGHT = 2000
const VIDEO_NAME = '0001-0100.mp4'

const IMG_NAME = 'skeleton.png'

const useVideo = false

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

const NavWrap = styled.nav`
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 1rem;
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
`

const ImageWrap = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
`

const VideoWrap = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
`

const AnnotationsWrap = styled.div`
  display: none;
`

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  width: ${IMG_WIDTH}px;
  height: ${IMG_HEIGHT}px;
  transition: all 1s ease;
`

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  width: ${IMG_WIDTH}px;
  height: ${IMG_HEIGHT}px;
  transition: all 1s ease;
`

const DraggableHandleLayer = styled.div({
  width: IMG_WIDTH,
  height: IMG_HEIGHT,
  position: "absolute",
  left: 0,
  top: 0,
  background: "rgba(255, 0, 0, 0)"
})

function getWindowDimensions() {
  const width = window.innerWidth
  const height = window.innerHeight
  return {
      width,
      height,
      centerX: Math.floor(width / 2),
      centerY: Math.floor(height / 2)
  };
}

export default function App() {

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [activeKey, setActiveKey] = useState("")
  const [manualFocus, setManualFocus] = useState({ x: null, y: null })
  const [draggableBounds, setDraggableBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 })
  const [lastLocationClicked, setLastLocationClicked] = useState({ x: 0, y: 0 })
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState(0)
  const isOnLastAnnotationOfScene = useMemo(() => {
    return activeAnnotationIndex === story.scenes[story.scenes.length - 1].annotations.length - 1
  }, [activeAnnotationIndex, activeSceneIndex, story.scenes])

  const isAtStart = !activeSceneIndex && !activeAnnotationIndex
  const isAtEnd = activeSceneIndex === story.scenes.length - 1 && isOnLastAnnotationOfScene
  
  

  // useEffect(() => {
  //   const x = imgMapScales.x(lastLocationClicked.x)
  //   const y = imgMapScales.y(lastLocationClicked.y)
  //   console.log(x, y)
  //   setManualFocus({ x, y })
  // }, [windowDimensions, lastLocationClicked])

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    const debouncedResize = _debounce(handleResize, 50)
    
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [])

  useEffect(() => {
    const xRange = [0, -IMG_WIDTH + windowDimensions.width ]
    const yRange = [0, -IMG_HEIGHT + windowDimensions.height ]
    setDraggableBounds({ left: xRange[1], top: yRange[1], right: xRange[0], bottom: yRange[0] })
  }, [windowDimensions])

  const viewXY = useMemo(() => {
    if (!Number.isNaN(manualFocus.x) && !Number.isNaN(manualFocus.y)) {
      return {
        x: manualFocus.x,
        y: manualFocus.y,
        scale: 1
      }
    } else {
      return {
        x: story.scenes[activeSceneIndex].view_x,
        y: story.scenes[activeSceneIndex].view_y,
        scale: story.scenes[activeSceneIndex].scale
      }
    }
   
  }, [activeSceneIndex, manualFocus.x, manualFocus.y])

  const imgTransform2 = useMemo(() => {
    const x =  windowDimensions.centerX - viewXY.x
    const y = windowDimensions.centerY - viewXY.y
    const scale = viewXY.scale || 1
    return `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }, [windowDimensions, activeSceneIndex, manualFocus.x, manualFocus.y])

  function handleAreaClick(e) {
    const key = e.target.getAttribute("data-area-key")

    if (key) {
      setActiveKey(key)
      setActiveAnnotationIndex(0)
    }

    const _activeSceneIndex = story.scenes.findIndex(s => s.key === key)
    if (_activeSceneIndex > -1) {
      setActiveSceneIndex(_activeSceneIndex)
    }
  }
  function handlePrevClick() {
    
    if (isAtStart) { return }
    if (!activeAnnotationIndex) {
      // first annotation, so go to last annotation of prev scene
      setActiveSceneIndex(s => s - 1)
      setActiveAnnotationIndex(story.scenes[activeSceneIndex - 1].annotations.length - 1)
    } else {
      setActiveAnnotationIndex(i => i - 1)
    }

  }
  function handleNextClick() {
    if (isAtEnd) {
      // go to start
      setActiveSceneIndex(0)
      setActiveAnnotationIndex(0)
      return
    }

    if (isOnLastAnnotationOfScene) {
      // next scene available, last annotation
      setActiveSceneIndex(s => s + 1)
      setActiveAnnotationIndex(0)
      return
    } else {
      // same scene, next annotation
      setActiveAnnotationIndex(i => i + 1)
    }
    
  }

  function handleImgMapClicked(e) {
    console.log('e', e)
    const x = e.nativeEvent.offsetX
    const y =  e.nativeEvent.offsetY
    setLastLocationClicked({ x, y })
  }

  useHotkeys('left, right', e => {
    const { key } = e
    e.preventDefault()
    setManualFocus({ x: null, y: null })
    if (key === "ArrowRight") {
      handleNextClick()
    } else {
      handlePrevClick()
    }
  }, [activeSceneIndex, activeAnnotationIndex])

  const eventHandler = (e, data) => {
    console.log('Event Type', e.type);
    console.log({e, data});
  }

  return (
    <div>
      <Header>
        <img src={process.env.PUBLIC_URL + '/images/logo-small.png'} alt="FABRIQ" height={40} />
      </Header>
      <ImageWrap>
        <Draggable
          defaultPosition={{x: 0, y: -windowDimensions.height * 0.5}}
          bounds={draggableBounds}
          handle=".react-draggable-handle"
          onMouseDown={eventHandler}
          onStart={eventHandler}
          onDrag={eventHandler}
          onStop={eventHandler}>
          <div style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}>
            { useVideo ? (
              <Video autoPlay muted loop id="bg-video"  style={{ transform: '' }}>
                <source src={process.env.PUBLIC_URL + '/images/' + VIDEO_NAME} type="video/mp4" />
              </Video>
            ) : (
              <>
                <Img src={process.env.PUBLIC_URL + '/images/' + IMG_NAME} useMap="#scenemap" alt="" />
                <map name="scenemap">
                  <area shape="rect" coords="0,0,100,100" alt="Intelligence" onClick={handleAreaClick} data-area-key="intelligence" />
                </map>
              </>
            )}
            <DraggableHandleLayer className="react-draggable-handle" />
          </div>
        </Draggable>
       
        <AnnotationsWrap>
          {story.scenes.map((scene, i) => 
            <div key={`scene-${scene.key}`}>
              {scene.annotations.map((annot, j) => <Tooltip key={`scene-${scene.key}--annot-${j}`} {...{...annot, tooltip_x: windowDimensions.centerX + annot.tooltip_x, tooltip_y: windowDimensions.centerY + annot.tooltip_y}} isActive={activeSceneIndex === i && activeAnnotationIndex === j} />)}
            </div>
          )}
        </AnnotationsWrap>
      </ImageWrap>
      <NavWrap>
        <IconButton aria-label="Backward" onClick={handlePrevClick} disabled={isAtStart}>
          <PrevIcon />
        </IconButton>
        <IconButton aria-label="Forward" onClick={handleNextClick}>
          <NextIcon />
        </IconButton>
      </NavWrap>
      <DebugWrap>llClicked: {lastLocationClicked.x}, {lastLocationClicked.y}</DebugWrap>
      {/* <DebugWrap>viewXY: {viewXY.x}, {viewXY.y}, activeKey: {activeKey}, activeSceneIndex: {activeSceneIndex}, activeAnnotationIndex: {activeAnnotationIndex}, isAtStart: {isAtStart ? "YES" : ""}, isAtEnd: {isAtEnd ? "YES" : ""}, isOnLastAnnotationOfScene: {isOnLastAnnotationOfScene ? "YES" : ""}</DebugWrap> */}
    </div>
  )
}