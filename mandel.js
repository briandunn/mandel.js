var canvas = document.getElementById('canvas'), maxIterations = 80

var mapCoords = function(canvas, fn) {
  var context   = canvas.getContext('2d'),
      image     = context.createImageData(canvas.width, canvas.height)

  for (var i = 0; i < image.data.length / 4; i++) {
    var intIndex = i * 4;
    var x = i % canvas.width, y = (i / canvas.width) >> 0
    fn(x,y).forEach((value, i)=> image.data[intIndex + i] = value)
  }
  context.putImageData(image,0,0)
  return image.data
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

var scale = (x,y) => {
  return [
      (x / canvas.width)  * 4 - 2,
      (y / canvas.height) * 2 - 1
  ]
}

var mandel = (c)=> (z)=> z.square().add(c)

var iterate = function* (start, fn) {
  var next = fn(start)
  while(true) {
    yield(next)
    next = fn(next)
  }
}

var takeWhile = function(gen, test) {
  var values = []
  for(value of gen) {
    if(!test(value, values.length)) break
    values.push(value)
  }
  return values
}

mapCoords(canvas, (x,y)=> {
  var [real, imaginary] = scale(x,y)
  var c = new Complex(real, imaginary)
  var iterations = takeWhile(
    iterate(new Complex(0,0), mandel(c)),
    (c,i)=> i <= maxIterations && c.abs() <= 2
  ).length
  var ranged = (iterations / maxIterations * 256)
  return [ranged,ranged,ranged,256]
})
