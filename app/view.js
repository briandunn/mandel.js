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

  mousedown() { (e) => {} }

  render() {
    return (<div onMouseDown={this.mousedown}>
      <div className='zoom' style={{}}> </div>
      {this.props.children}
      </div>)
  }
}

const View = ()=> <Zoom><Mandelbrot /></Zoom>

export {Mandelbrot, Zoom, View}
