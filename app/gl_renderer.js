const vertex = require('./vertex')
const fragment = require('./fragment')

const createProgram = (gl, vertexSource, fragmentSource)=> {

  const createShader = (type, source)=> {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      return shader
    else
      throw gl.getShaderInfoLog(shader)
  }

  const program = gl.createProgram()

  gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSource))
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSource))
  gl.linkProgram(program)

  if (gl.getProgramParameter(program, gl.LINK_STATUS))
    return program
  else
    throw gl.getProgramInfoLog(program)
}

class GLRenderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl')
    const {gl} = this, program = createProgram(gl, vertex, fragment)

    this.positionBuffer = this.initPositionBuffer()
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition")
    gl.enableVertexAttribArray(this.aVertexPosition)

    const windowSizeLoc    = gl.getUniformLocation(program, "window_size"),
          maxIterationsLoc = gl.getUniformLocation(program, "max_iterations"),
          centerLoc        = gl.getUniformLocation(program, "center"),
          scaleLoc         = gl.getUniformLocation(program, "scale")

    this.setUWindowSize    = (w,h)=> { gl.uniform2f(windowSizeLoc, w, h) }
    this.setUMaxIterations = (i)=> { gl.uniform1i(maxIterationsLoc, i) }
    this.setCenter         = ({x,y})=> { gl.uniform2f(centerLoc,x,y) }
    this.setScale          = (scale)=> { gl.uniform1f(scaleLoc,scale) }

    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, 0, 0)
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

  render({iterations,x,y,scale}) {
    if(scale < 1e-4)
      console.log('switch to 2d?')
    const {gl} = this
    const start = performance.now()
    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.setUWindowSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    this.setUMaxIterations(iterations)
    this.setCenter({x,y})
    this.setScale(scale)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    console.log((performance.now() - start) + "ms render")
  }
}

export default GLRenderer
