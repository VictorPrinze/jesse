import { useEffect, useRef } from 'react'

interface Orb {
  x: number
  y: number
  r: number
  opacity: number
  vx: number
  vy: number
  phase: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const orbs: Orb[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initOrbs = () => {
      orbs.length = 0
      for (let i = 0; i < 55; i++) {
        orbs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 90 + 20,
          opacity: Math.random() * 0.12 + 0.02,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.008

      for (const o of orbs) {
        o.x += o.vx
        o.y += o.vy

        if (o.x < -o.r) o.x = canvas.width + o.r
        if (o.x > canvas.width + o.r) o.x = -o.r
        if (o.y < -o.r) o.y = canvas.height + o.r
        if (o.y > canvas.height + o.r) o.y = -o.r

        const pulse = o.opacity * (0.5 + 0.5 * Math.sin(t + o.phase))
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r)
        grad.addColorStop(0, `rgba(201,168,76,${pulse})`)
        grad.addColorStop(0.5, `rgba(201,168,76,${pulse * 0.35})`)
        grad.addColorStop(1, 'rgba(201,168,76,0)')

        ctx.beginPath()
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    initOrbs()
    draw()

    const handleResize = () => {
      resize()
      // Re-clamp orb positions to new bounds
      for (const o of orbs) {
        if (o.x > canvas.width) o.x = Math.random() * canvas.width
        if (o.y > canvas.height) o.y = Math.random() * canvas.height
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
