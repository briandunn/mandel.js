const canvas = document.getElementById('canvas')

canvas.onclick = (e)=> {
  composite.zoom = composite.zoom + 1
  composite.center = [
    composite.center[0] + (e.x - (composite.canvas.width / 2)),
    composite.center[1] + (e.y - (composite.canvas.height / 2))
  ]
  draw()
}

class Chunk {
  constructor(attributes) {
    Object.assign(this, attributes)
  }

  offsetX() {
    return this.width() * this.offset
  }

  offsetY() { return 0 }

  width() {
    return this.compositeDimensions[0] / this.count
  }
  height() {
    return this.compositeDimensions[1]
  }
}

class Composite {
  constructor(canvas) {
    this.center = [0, 0]
    this.zoom = 1
    this.canvas = canvas
  }

  chunk(count) {
    return Array(count).fill(0).map((_,i)=> new Chunk({
        compositeDimensions: [this.canvas.width, this.canvas.height],
        offset: i,
        center: this.center,
        zoom: this.zoom,
        count: count
      })
    )
  }

  setChunk(chunk, data) {
    const context = this.canvas.getContext('2d'),
          image   = context.createImageData(chunk.width(), chunk.height())

    for (let i = 0; i < data.length; i++)
      image.data[i] = data[i]

    context.putImageData(image,chunk.offsetX(),chunk.offsetY())
  }
}

const composite = new Composite(canvas)

const draw = ()=> {
  composite.chunk(8).forEach((chunk)=> {
    const worker = new Worker('worker.js')

    worker.onmessage = ({data: {chunk,data}})=> {
      composite.setChunk(new Chunk(chunk), data)
    }

    worker.postMessage(chunk)
  })
}

draw()
