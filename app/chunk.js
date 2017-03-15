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

  scaleX(x) {
    return this._scale(0,x)
  }

  scaleY(y) {
    return this._scale(1,y)
  }

  _scale(i, d) {
    const scale     = initialRange[i],
          composite = this.compositeDimensions[i],
          offset    = [this.offsetX(), this.offsetY()][i],
          scaled    = (d + offset + this.center[i]) / composite * scale - scale / 2
    return scaled / this.zoom
  }
}

export default Chunk
