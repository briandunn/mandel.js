import React from 'react'
import Composite from 'composite'

class Mandelbrot extends React.Component {
  constructor(props, context) {
    super()
    this.workers = Array(4).fill(0).map(()=> new Worker('worker.js'))
    this.state = {width: 800, height: 600}
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth, height: window.innerHeight
    })
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", () => this.updateDimensions())
  }

  componentDidUpdate() {
    clearTimeout(this.throttle)
    this.throttle = setTimeout(() => {
      const composite = new Composite(this.refs.canvas)
      composite.draw(this.workers)
    }, 250)
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
    this.setState( (state) => state.drag ? {drag: false} : {start: {x:pageX,y:pageY}, stop: null, drag: true})
  }

  mousemove(e) {
    e.stopPropagation()
    const {pageX,pageY} = e
    this.setState((state) => state.drag ? {stop: {x:pageX,y:pageY}} : {})
  }

  zoom(e) {
    debugger
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
        onMouseMove={this.mousemove.bind(this)}
        onMouseDown={this.mousedown.bind(this)}>
      <div className='zoom' onMouseDown={this.zoom.bind(this)} style={this.style()}> </div>
      {this.props.children}
      </div>)
  }
}

const View = ()=> <Zoom><Mandelbrot /></Zoom>

export {Mandelbrot, Zoom, View}
