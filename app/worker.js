import Chunk from 'chunk'
import Complex from 'complex'

let lastChunk = null
global.onmessage = (message)=> {
  if(!message.data.box) return

  const chunk = new Chunk(message.data), width = chunk.width()

  if(!!lastChunk)
    postMessage({chunk: scale(chunk,lastChunk)})

  updatePixels(chunk.imageData, (x,y)=>
      toColor(calculate(new Complex(chunk.scaleX(x),chunk.scaleY(y)), chunk.iterations))
  )

  lastChunk = chunk

  postMessage({chunk})
}

const updatePixels = (imageData, fn) => {
  let {data,width} = imageData
  for (let i = 0; i < data.length >> 2; i++) {
    let pixelIndex = i << 2, x = i % width, y = (i / width) >> 0
    fn(x,y).forEach((value,i)=> {data[pixelIndex + i] = value})
  }
  return imageData
}

const getPixel = (imageData,x,y)=> {
  const pixelIndex = (y * imageData.width + x) << 2
  return imageData.data.slice(pixelIndex, pixelIndex + 4)
}

const scale = (chunk, lastChunk) => {
  // for each pixel at the new scale, look up the closest pixel in the old one
  updatePixels(chunk.imageData, (x,y)=> getPixel(
    lastChunk.imageData,
    (x * chunk.box.left / lastChunk.box.left) >> 0,
    (y * chunk.box.top / lastChunk.box.top) >> 0
  ))
  return chunk
}

// an iterable that returns successive feedback values for fn starting with start
const iterate = (start, fn) => (
  {
    [Symbol.iterator]: () => {
      let val = start
      return {
        next: () => {
          val = fn(val)
          return {
            value: val,
            done: false
          }
        }
      }
    }
  }
)

const takeWhile = (gen, test)=> {
  let values = []
  for(value of gen) {
    if(!test(value, values.length)) break
    values.push(value)
  }
  return values
}

const toColor = (value)=> {
  const ranged = (value * (1 << 24)) >> 0
  return Array(3).fill(0).map((_,i)=> (ranged >> i * 8) & 0xff).concat([0xff])
}

const mandel = (c)=> (z)=> z.square().add(c)

const calculate = (c, maxIterations)=> takeWhile(
    iterate(new Complex(0,0), mandel(c)),
    (c,i)=> i <= maxIterations && c.abs() <= 2
  ).length / maxIterations
