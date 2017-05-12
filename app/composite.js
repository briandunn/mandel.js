import Chunk from './chunk'

let lastChunk = null

class Composite {
  constructor(canvas) {
    this.canvas = canvas
    this.workers = Array(5).fill(0).map(()=> new Worker('worker.js'))
  }

  chunk(count, {box,iterations}) {
    return Array(count).fill(0).map((_,i)=> {
      const chunkWidth = (this.canvas.width / count) >> 0
      return new Chunk({
        frame: {width: this.canvas.width, height:this.canvas.height},
        offset: i,
        box: box,
        iterations: iterations,
        imageData: this.canvas.getContext('2d').getImageData(chunkWidth * i, 0, chunkWidth, this.canvas.height)
      })
    })
  }

  setChunk(chunk) {
    this
      .canvas
      .getContext('2d')
      .putImageData(chunk.imageData,chunk.offsetX(),chunk.offsetY())
  }

  scale(chunk, lastChunk) {
    // for each pixel at the new scale, look up the closest pixel in the old one
    const start = performance.now()
    const scaleX = chunk.box.width / lastChunk.box.width
    const scaleY = chunk.box.height / lastChunk.box.height
    if(scaleX == 1 && scaleY == 1) return
    const left = ((chunk.box.left - lastChunk.box.left) / lastChunk.box.width) * lastChunk.width()
    const top = ((chunk.box.top - lastChunk.box.top) / lastChunk.box.height) * lastChunk.imageData.height

    chunk.updatePixels((x,y)=>
      lastChunk.getPixel(
        ((x * scaleX) + left) >> 0,
        ((y * scaleY) + top) >> 0
      )
    )

    this
      .canvas
      .getContext('2d')
      .putImageData(chunk.imageData,0,0)
    console.log((performance.now() - start) + "ms scale")
  }

  render(props) {
    const start = performance.now()
    const workers = this.workers
    let pending = 0
    if(!!lastChunk)
      this.scale(this.chunk(1, props)[0],lastChunk)
    this.chunk(workers.length, props).forEach((chunk, i)=> {
      const worker = workers[i % workers.length]

      worker.onmessage = ({data: {chunk}})=> {
        pending -= 1
        this.setChunk(new Chunk(chunk))
        if(pending == 0) {
          console.log((performance.now() - start) + "ms render")
          lastChunk = this.chunk(1, props)[0]
        }
      }

      pending += 1
      worker.postMessage(chunk)
    })
  }
}

export default Composite
