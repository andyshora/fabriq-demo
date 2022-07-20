import { useEffect, useState, useMemo, useCallback, useLayoutEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import PrevIcon from '@mui/icons-material/ArrowBackIos';
import { useHotkeys } from 'react-hotkeys-hook'
import _debounce from "lodash-es/debounce"

import Tooltip from './components/Tooltip';
import story from "./content/story.json"
import styled from 'styled-components';

const IMG_WIDTH = 1920
const IMG_HEIGHT = 1080

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
`

const ImageWrap = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
`

const AnnotationsWrap = styled.div``

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 0, 0);
  width: ${IMG_WIDTH}px;
  height: ${IMG_HEIGHT}px;
  transition: all 1s ease;
`

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
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState(0)
  const isOnLastAnnotationOfScene = useMemo(() => {
    return activeAnnotationIndex === story.scenes[story.scenes.length - 1].annotations.length - 1
  }, [activeAnnotationIndex, activeSceneIndex, story.scenes])

  const isAtStart = !activeSceneIndex && !activeAnnotationIndex
  const isAtEnd = activeSceneIndex === story.scenes.length - 1 && isOnLastAnnotationOfScene
  console.log(windowDimensions)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    const debouncedResize = _debounce(handleResize, 50)
    
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [])

  const viewXY = useMemo(() => {
    return {
      x: story.scenes[activeSceneIndex].view_x,
      y: story.scenes[activeSceneIndex].view_y
    }
  }, [activeSceneIndex])

  const imgTransform = useMemo(() => {
    const x =  windowDimensions.centerX - viewXY.x
    const y = windowDimensions.centerY - viewXY.y
    return `translate3d(${x}px, ${y}px, 0)`
  }, [activeSceneIndex])

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

  useHotkeys('left, right', e => {
    const { key } = e
    e.preventDefault()
    if (key === "ArrowRight") {
      handleNextClick()
    } else {
      handlePrevClick()
    }
  }, [activeSceneIndex, activeAnnotationIndex])

  return (
    <div>
      <ImageWrap>
        <Img src={process.env.PUBLIC_URL + '/images/fab36.png'} useMap="#scenemap" alt="" style={{ transform: imgTransform }} />
        <map name="scenemap">
          <area shape="rect" coords="0,0,100,100" alt="Intelligence" onClick={handleAreaClick} data-area-key="intelligence" />
        </map>
        <AnnotationsWrap>
          {story.scenes.map((scene, i) => 
            <div key={`scene-${scene.key}`}>
              {scene.annotations.map((annot, j) => <Tooltip key={`scene-${scene.key}--annot-${j}`} {...annot} isActive={activeSceneIndex === i && activeAnnotationIndex === j} />)}
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
      <DebugWrap>viewXY: {viewXY.x}, {viewXY.y}, activeKey: {activeKey}, activeSceneIndex: {activeSceneIndex}, activeAnnotationIndex: {activeAnnotationIndex}, isAtStart: {isAtStart ? "YES" : ""}, isAtEnd: {isAtEnd ? "YES" : ""}, isOnLastAnnotationOfScene: {isOnLastAnnotationOfScene ? "YES" : ""}</DebugWrap>
    </div>
  )
}