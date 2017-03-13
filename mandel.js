const canvas = document.getElementById('canvas'), maxIterations = 40

const worker = new Worker('worker.js')

class Composite {
  constructor(canvas) {
    this.canvas = canvas
  }

  chunk(count) {
    return [{
      width: this.canvas.width,
      height: this.canvas.height,
      offsetX: 0,
      offsetY: 0
    }]
  }

  setChunk(chunk, data) {
    const context = this.canvas.getContext('2d'),
          image   = context.createImageData(chunk.width, chunk.height)

    for (var i = 0; i < data.length; i++)
      image.data[i] = data[i]

    context.putImageData(image,chunk.offsetX,chunk.offsetY)
  }
}

const composite = new Composite(canvas)

worker.onmessage = ({data: {chunk,data}})=> {
  composite.setChunk(chunk, data)
}

composite.chunk(1).forEach((chunk) => worker.postMessage(chunk))
