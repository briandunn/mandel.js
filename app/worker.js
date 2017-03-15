import Chunk from 'chunk'
import Complex from 'complex'

const initialRange = [4,2], maxIterations = 40

global.onmessage = (message)=> {
  const chunk = new Chunk(message.data), width = chunk.width()
  let data = new Uint8ClampedArray(width * chunk.height() * 4)
  console.log(chunk)

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
  return [ranged & 0xff , (ranged >> 8) & 0xff, (ranged >> 16) & 0xff, 255]
}

const mandel = (c)=> (z)=> z.square().add(c)

const calculate = (c)=> takeWhile(
    iterate(new Complex(0,0), mandel(c)),
    (c,i)=> i <= maxIterations && c.abs() <= 2
  ).length / maxIterations
