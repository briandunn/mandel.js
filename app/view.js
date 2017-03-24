import React from 'react'
import {connect} from 'react-redux'
import Composite from 'composite'
import GLRenderer from 'gl_renderer'

class Mandelbrot extends React.Component {
  constructor() {
    super()
    this.state = {width: 0, height: 0}
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth, height: window.innerHeight
    })
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", () => this.updateDimensions())
    this.renderer = new GLRenderer(this.refs.canvas)
    // this.renderer = new Composite(this.refs.canvas)
  }

  componentDidUpdate() {
    this.renderer.render(this.props)
  }

  render() {
    return (
      <canvas
        ref='canvas'
        width={this.state.width}
        height={this.state.height}/>)
  }
}

class Zoom extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  mousedown(e) {
    e.stopPropagation()
    const {pageX,pageY} = e
    this.setState({start: {x:pageX,y:pageY}, stop: null, drag: true})
  }

  mouseup(e) {
    e.stopPropagation()
    this.setState({drag:false})
  }

  mousemove(e) {
    //FIXME: constrain to canvas aspect ratio
    e.stopPropagation()
    const {pageX,pageY} = e
    this.setState((state) => state.drag ? {stop: {x:pageX,y:pageY}} : {})
  }

  mousewheel(e) {
    e.stopPropagation()
    e.preventDefault()
    const {wheelDeltaX,wheelDeltaY} = e.nativeEvent
    const {clientWidth, clientHeight} = this.refs.zoomable
    this.props.onZoom({
      top:  wheelDeltaY / clientHeight,
      left: -1 * wheelDeltaX / clientWidth,
      width: 1,
      height: 1
    })
  }

  zoom(e) {
    const {clientWidth, clientHeight} = this.refs.zoomable
    const {width,height,top,left} = this.style()
    this.props.onZoom(
      {
        top:    top / clientHeight,
        left:   left / clientWidth,
        width:  width / clientWidth,
        height: height / clientHeight,
      }
    )
  }

  style() {
    const {start,stop} = this.state
    if(start && stop) {
      const [lowY,highY] = [start.y, stop.y].sort((a,b)=> a - b)
      const [lowX,highX] = [start.x, stop.x].sort((a,b)=> a - b)
      return {
        top: lowY,
        height: highY - lowY,
        left: lowX,
        width: highX - lowX
      }
    } else
      return {}
  }

  render() {
    return (
      <div
        className='zoomable'
        ref='zoomable'
        onMouseUp={this.mouseup.bind(this)}
        onMouseDown={this.mousedown.bind(this)}
        onMouseMove={this.mousemove.bind(this)}
        onWheel={this.mousewheel.bind(this)}>
      <div className='zoom' onMouseDown={this.zoom.bind(this)} style={this.style()}> </div>
      {this.props.children}
      </div>)
  }
}

const View = connect(
  (model)=> ({box: model, iterations: model.iterations}),
  (dispatch)=> (
    {
      onZoom:(box)=> {
        dispatch({type: 'ZOOM', box: box})
      },
      changeIterations:(e)=> {
        dispatch({type: 'ITERATIONS', iterations: +e.target.value})
      },
    }
  )
)(
  ({box,iterations,onZoom,changeIterations})=> (
    <Zoom onZoom={onZoom}>
      <input type="number" min="0" max={0xffffff} value={iterations} onChange={changeIterations}/>
      <Mandelbrot box={box} iterations={iterations}/>
    </Zoom>
  )
)

export default View
