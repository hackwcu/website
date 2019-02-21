let confettiColor = []
let confetti = []

class Confetti {
  constructor (_xRel, _y, _s, _ctx) {
    this.xRel = _xRel
    this.y = _y
    this.speed = _s
    this.ctx = _ctx
    this.time = random(0, 100)
    this.color = random(confettiColor)
    this.amp = random(2, 30)
    this.phase = random(0.5, 2)
    this.size = random(5, 15)
  }

  tick () {
    const ctx = this.ctx
    const width = ctx.canvas.width

    ctx.save()
    ctx.beginPath()
    ctx.translate(this.xRel * width, this.y)
    ctx.translate(this.amp * Math.sin(this.time * this.phase), this.speed * Math.cos(2 * this.time * this.phase))
    ctx.rotate(this.time)
    ctx.scale(Math.cos(this.time / 4), Math.sin(this.time / 4))
    ctx.fillStyle = this.color
    ctx.rect(0, 0, this.size, this.size / 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()

    this.time = this.time + 0.1

    this.speed += 1 / 75

    this.y += this.speed
  }
}

function random (min, max) {
  if (min instanceof Array) {
    const idx = Math.floor(Math.random() * min.length)
    return min[idx]
  }
  return Math.random() * (max - min) + min
}

export function setup () {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  const height = ctx.canvas.height

  document
    .getElementById('confetti-holder')
    .appendChild(canvas)

  confettiColor = ['#ff8400', '#ec008c', '#ffffff']
  for (let i = 0; i < 2000; i++) {
    confetti[i] = new Confetti(random(0, 1), random(-height, 0), random(-1, 1), ctx)
  }
  return ctx
}

export function draw (ctx) {
  const height = ctx.canvas.height
  const width = ctx.canvas.width
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()

  for (let i = 0; i < confetti.length / 2; i++) {
    confetti[i].tick()
  }

  for (let i = Math.floor(confetti.length / 2); i < confetti.length; i++) {
    confetti[i].tick()
  }
}
