import Chunk from 'chunk'

class Composite {
  constructor(canvas, {box, iterations}) {
    this.box = box
    this.iterations = iterations
    this.canvas = canvas
  }

  chunk(count) {
    return Array(count).fill(0).map((_,i)=> {
      const chunkWidth = (this.canvas.width / count) >> 0
      return new Chunk({
        frame: {width: this.canvas.width, height:this.canvas.height},
        offset: i,
        box: this.box,
        iterations: this.iterations,
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

  draw(workers) {
    const start = performance.now()
    let pending = 0
    this.chunk(workers.length).forEach((chunk, i)=> {
      const worker = workers[i % workers.length]

      worker.onmessage = ({data: {chunk}})=> {
        pending -= 1
        if(pending == 0)
          console.log((performance.now() - start) + "ms")
        this.setChunk(new Chunk(chunk))
      }

      pending += 1
      worker.postMessage(chunk)
    })
  }
}

export default Composite
