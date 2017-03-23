const vertex = require('vertex')
const fragment = require('fragment')

class GLRenderer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl')
    const {gl} = this, program = gl.createProgram()

    gl.attachShader(program, this.createShader(gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, this.createShader(gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
      console.log(gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
    }
    this.positionBuffer = this.initPositionBuffer()
    this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition")
    gl.enableVertexAttribArray(this.aVertexPosition)

    gl.clearColor(1, 1, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
  }

  createShader(type, source) {
      const {gl} = this
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader
      else {
        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
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
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    console.log("render")
  }
}

export default GLRenderer
