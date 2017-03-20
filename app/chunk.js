class Chunk {
  constructor(attributes) {
    Object.assign(this, attributes)
  }

  offsetX() {
    return this.imageData.width * this.offset
  }

  offsetY() { return 0 }

  width() {
    return this.imageData.width
  }

  // x is the column of the pixel out of this chunks width
  // three widths, box, frame, and chunk
  scaleX(x) {
    const {width,left} = this.box
    // x as a fraction of the whole frame
    const xRatio = (x + this.offsetX()) / this.frame.width
    return xRatio * width + left
  }

  scaleY(y) {
    const {height,top} = this.box
    const yRatio = (y + this.offsetY()) / this.frame.height
    return yRatio * height + top
  }
}

export default Chunk
