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

  initRenderer() {
    this.renderer = new (this.props.gl ?  GLRenderer : Composite)(this.refs.canvas)
  }

  componentDidMount() {
    this.updateDimensions()
    this.initRenderer()
    window.addEventListener("resize", () => this.updateDimensions())
  }

  componentDidUpdate(newProps) {
    if(newProps.gl != this.props.gl)
      this.initRenderer()
    this.renderer.render(this.props)
  }

  render() {
    return (
      <canvas
        key={this.props.gl}
        ref='canvas'
        width={this.state.width}
        height={this.state.height}/>)
  }
}


const touches = (e)=> Array.from(e.touches || []).map(t => ({x: t.clientX, y: t.clientY}))

const touch = (touches, onZoom, {clientWidth,clientHeight})=> {
  if(touches.length < 2 ) return
  let current = touches[touches.length - 1]
  let previous = touches[touches.length - 2]

  const pan = ()=> {
    current = current[0]
    previous = previous[0]
    return {
      top:    (current.y - previous.y) / clientHeight,
      left:   -1 * (current.x - previous.x) / clientWidth,
      width:  1,
      height: 1
    }
  }

  const zoom = ()=> {
    const distance = (pt1,pt2) => Math.sqrt(Math.pow(pt1.x - pt2.x,2) + Math.pow(pt1.y-pt2.y,2))
    const distances = [previous, current].map((t)=>
      distance(...t) / distance({x:0,y:0}, {x:clientWidth,y:clientHeight})
    )
    const scale = (distances[0] - distances[1]) * 3
    return {
      top:    scale * -0.5,
      left:   scale * -0.5,
      width:  scale + 1,
      height: scale + 1
    }
  }

  onZoom(current.length == 1 ? pan() : zoom())
}

class Zoom extends React.Component {
  constructor() {
    super()
    this.state = {touches: []}
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

    const {deltaX,deltaY} = e
    const {clientWidth, clientHeight} = this.refs.zoomable

    const pan = ()=> {
      return {
        top:    -1 * deltaY / clientHeight,
        left:   deltaX / clientWidth,
        width:  1,
        height: 1
      }
    }

    const pinch = ()=> {
      const zoomSpeed = 7
      const scale = (deltaY / clientWidth) * zoomSpeed
      return {
        top:    scale * -0.5,
        left:   scale * -0.5,
        width:  scale + 1,
        height: scale + 1
      }
    }

    this.props.onZoom(e.ctrlKey ? pinch() : pan())
  }

  touchend(e) {
    e.preventDefault()
    this.setState({touches: []})
  }

  touchstart(e) {
    e.preventDefault()

    this.setState({touches: [touches(e)]})
  }

  touch(e) {
    e.preventDefault()
    const t = touches(e)
    this.setState((state) => ({touches: state.touches.concat([t])}),
      (state)=> touch(this.state.touches, this.props.onZoom, this.refs.zoomable)
    )
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
        onWheel={this.mousewheel.bind(this)}
        onTouchEnd={this.touchend.bind(this)}
        onTouchMove={this.touch.bind(this)}
        onTouchStart={this.touchstart.bind(this)}>
      <div className='zoom' onMouseDown={this.zoom.bind(this)} style={this.style()}> </div>
      {this.props.children}
      </div>)
  }
}

const View = connect(
  (model)=> ({box: model, iterations: model.iterations, gl: model.gl}),
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
  ({box,iterations,gl,onZoom,changeIterations,setRenderer})=> (
    <Zoom onZoom={onZoom}>
      <form>
      <input type="number" min="0" max={0xfff} value={iterations} onChange={changeIterations}/>
      <input type="checkbox" checked={gl} onChange={setRenderer} />
      </form>
      <Mandelbrot box={box} gl={gl} iterations={iterations}/>
    </Zoom>
  )
)

export default View
