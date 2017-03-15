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

export default Complex
