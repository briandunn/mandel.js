const initialRange = [4,2]

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
    const scaleW = initialRange[0], compositeW = this.compositeDimensions[0]
    return (x + this.offsetX()) / compositeW * scaleW - scaleW / 2
  }

  scaleY(y) {
    const scaleH = initialRange[1], compositeH = this.compositeDimensions[1]
    return y / compositeH * scaleH - scaleH / 2
  }
}

class Complex {
  constructor(real, imaginary) {
    this.real = real
    this.imaginary = imaginary
  }

  abs() {
    return Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2))
  }

  square() {
    return new Complex(
      Math.pow(this.real,2) - Math.pow(this.imaginary, 2),
      2 * this.real * this.imaginary
    )
  }

  add(complex) {
    return new Complex(
      this.real + complex.real,
      this.imaginary + complex.imaginary
    )
  }
}

const maxIterations = 40

onmessage = (message)=> {
  const chunk = new Chunk(message.data), width = chunk.width()
  let data = new Uint8ClampedArray(width * chunk.height() * 4)

  for (let i = 0; i < data.length / 4; i++) {
    let intIndex = i * 4;
    let x = i % width, y = (i / width) >> 0
    toColor(calculate(new Complex(chunk.scaleX(x),chunk.scaleY(y)))).forEach((value, i)=> {
      data[intIndex + i] = value
    })
  }

  postMessage({chunk: chunk, data: data})
}

// an iterable that returns successive feedback values for fn starting with start
const iterate = function* (start, fn) {
  let next = fn(start)
  while(true) {
    yield(next)
    next = fn(next)
  }
}

const takeWhile = (gen, test)=> {
  var values = []
  for(value of gen) {
    if(!test(value, values.length)) break
    values.push(value)
  }
  return values
}

const toColor = (value)=> {
  var ranged = (value * (1 << 8)) >> 0
  return [ranged, ranged, ranged, 255]
}

const mandel = (c)=> (z)=> z.square().add(c)

const calculate = (c)=> takeWhile(
    iterate(new Complex(0,0), mandel(c)),
    (c,i)=> i <= maxIterations && c.abs() <= 2
  ).length / maxIterations
