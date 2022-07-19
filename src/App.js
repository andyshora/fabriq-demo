import * as React from 'react';
import Tooltip from './components/Tooltip';
import story from "./content/story.json"


export default function App() {
  return (
    <div>
      <div>
        {story.scenes.map((scene, i) => 
          <div key={`scene-${scene.key}`}>
            {scene.annotations.map((annot, j) => <Tooltip key={`scene-${scene.key}--annot-${j}`} {...annot} />)}
          </div>
        )}
      </div>
      <div>
        <img src={process.env.PUBLIC_URL + '/images/fab36.png'} useMap="#scenemap" />
        <map name="scenemap">
          <area shape="rect" coords="0,0,100,100" alt="Intelligence" onClick={() => alert(1)} />
        </map>
      </div>
    </div>
  )
}