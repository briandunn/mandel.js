import Composite from './mandel'

document.addEventListener('DOMContentLoaded', function() {

  const canvas = document.createElement('canvas')
  canvas.setAttribute('height', 786)
  canvas.setAttribute('width', 1024)
  document.body.append(canvas)

  const composite = new Composite(canvas),
        workers = Array(4).fill(0).map(()=> new Worker('worker.js'))

  canvas.onclick = (e)=> {
    composite.zoom = composite.zoom + 1
    composite.center = [
      composite.center[0] + (e.x - (composite.canvas.width / 2)),
      composite.center[1] + (e.y - (composite.canvas.height / 2))
    ]
    composite.draw(workers)
  }
  composite.draw(workers)
});
