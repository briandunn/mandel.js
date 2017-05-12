import React from 'react'
import {connect} from 'react-redux'
import Mandelbrot from './components/mandelbrot'
import Zoom from './components/zoom'
import TouchSlider from './components/touch_slider'

const View = connect(
  (model)=> (model),
  (dispatch)=> (
    {
      onZoom:(box)=> {
        dispatch({type: 'ZOOM', box: box})
      },
      changeIterations:(e)=> {
        dispatch({type: 'ITERATIONS', iterations: +e.target.value})
      },
      setRenderer:(e)=> {
        dispatch({type: 'GL', gl: e.target.checked})
      }
    }
  )
)(
  ({x,y,scale,iterations,gl,onZoom,changeIterations,setRenderer})=> (
    <Zoom onZoom={onZoom}>
      <form>
      <input type="number" min="0" max={0xfff} value={iterations} onChange={changeIterations}/>
      <input type="checkbox" checked={gl} onChange={setRenderer} />
      </form>
      <TouchSlider onChange={changeIterations} value={iterations}/>
      <Mandelbrot {...{x,y,scale,gl,iterations}}/>
    </Zoom>
  )
)

export default View
