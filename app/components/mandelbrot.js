import React from 'react'
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

export default Mandelbrot
