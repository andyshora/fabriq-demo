import { useState, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import PrevIcon from '@mui/icons-material/ArrowBackIos';

import Tooltip from './components/Tooltip';
import story from "./content/story.json"
import styled from 'styled-components';

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

export default function App() {

  const [activeKey, setActiveKey] = useState("")
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [activeAnnotationIndex, setActiveAnnotationIndex] = useState(0)
  const isOnLastAnnotationOfScene = activeAnnotationIndex === story.scenes[story.scenes.length - 1].annotations.length - 1

  const isAtStart = !activeSceneIndex && !activeAnnotationIndex
  const isAtEnd = activeSceneIndex === story.scenes.length - 1 && isOnLastAnnotationOfScene

  const viewXY = useMemo(() => {
    return [
      story.scenes[activeSceneIndex].view_x,
      story.scenes[activeSceneIndex].view_y
    ]
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

  return (
    <div>
      
      <div>
        {story.scenes.map((scene, i) => 
          <div key={`scene-${scene.key}`}>
            {scene.annotations.map((annot, j) => <Tooltip key={`scene-${scene.key}--annot-${j}`} {...annot} isActive={activeSceneIndex === i && activeAnnotationIndex === j} />)}
          </div>
        )}
      </div>
      <div>
        <img src={process.env.PUBLIC_URL + '/images/fab36.png'} useMap="#scenemap" alt="" />
        <map name="scenemap">
          <area shape="rect" coords="0,0,100,100" alt="Intelligence" onClick={handleAreaClick} data-area-key="intelligence" />
        </map>
      </div>
      <NavWrap>
        <IconButton aria-label="Backward" onClick={handlePrevClick} disabled={isAtStart}>
          <PrevIcon />
        </IconButton>
        <IconButton aria-label="Forward" onClick={handleNextClick}>
          <NextIcon />
        </IconButton>
      </NavWrap>
      <DebugWrap>viewXY: {viewXY.join(',')}, activeKey: {activeKey}, activeSceneIndex: {activeSceneIndex}, activeAnnotationIndex: {activeAnnotationIndex}, isAtStart: {isAtStart ? "YES" : ""}, isAtEnd: {isAtEnd ? "YES" : ""}</DebugWrap>
    </div>
  )
}