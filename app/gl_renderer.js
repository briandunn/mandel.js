const vertex = require('vertex')
const fragment = require('fragment')

class GLRenderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl')
    const {gl} = this, program = gl.createProgram()

    gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw gl.getProgramInfoLog(program)

    this.positionBuffer = this.initPositionBuffer()
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition")
    gl.enableVertexAttribArray(this.aVertexPosition)

    const windowSizeLoc    = gl.getUniformLocation(program, "window_size"),
          maxIterationsLoc = gl.getUniformLocation(program, "max_iterations"),
          boxLoc           = gl.getUniformLocation(program, "box")

    this.setUWindowSize    = (w,h)=> { gl.uniform2i(windowSizeLoc, w, h) }
    this.setUMaxIterations = (i)=> { gl.uniform1i(maxIterationsLoc, i) }
    this.setUBox = ({top, left, width,height})=> {
      gl.uniform4f(boxLoc,left,top,width,height)
    }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, 0, 0)
  }

  createShader(type, source) {
      const {gl} = this
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader
      else {
        throw gl.getShaderInfoLog(shader)
      }
  }

  initPositionBuffer() {
    const {gl} = this,
      vertices = [
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
      ],
      vertexPositionBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    return vertexPositionBuffer
  }

  render({iterations,box}) {
    const {gl} = this
    gl.clearColor(1, 1, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.setUWindowSize(gl.canvas.width,gl.canvas.height)
    this.setUMaxIterations(iterations)
    this.setUBox(box)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    console.log("render")
  }
}

export default GLRenderer
