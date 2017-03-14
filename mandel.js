const canvas = document.getElementById('canvas'), maxIterations = 40

class Chunk {
  constructor(attributes) {
    Object.assign(this, attributes)
  }

  offsetX() {
    return this.width() * this.offset
  }
  offsetY() {
    return 0
  }

  width() {
    return this.compositeDimensions[0] / this.count
  }
  height() {
    return this.compositeDimensions[1]
  }
}

class Composite {
  constructor(canvas) {
    this.canvas = canvas
  }

  chunk(count) {
    return Array(count).fill(0).map((_,i)=> new Chunk({
        compositeDimensions: [this.canvas.width, this.canvas.height],
        offset: i,
        center: [0,0],
        zoom: 1,
        count: count
      })
    )
  }

  setChunk(chunk, data) {
    const context = this.canvas.getContext('2d'),
          image   = context.createImageData(chunk.width(), chunk.height())

    for (var i = 0; i < data.length; i++)
      image.data[i] = data[i]

    console.log(chunk)
    context.putImageData(image,chunk.offsetX(),chunk.offsetY())
  }
}

const composite = new Composite(canvas)

composite.chunk(8).forEach((chunk)=> {
  const worker = new Worker('worker.js')

  worker.onmessage = ({data: {chunk,data}})=> {
    composite.setChunk(new Chunk(chunk), data)
  }

  worker.postMessage(chunk)
})
