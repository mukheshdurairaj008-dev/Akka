import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  shape: "circle" | "star" | "heart"
  gravity: number
}

interface Rocket {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  trail: { x: number; y: number }[]
  targetY: number
  alive: boolean
}

const COLORS = [
  "#d4af37","#e879a8","#c0392b","#9b59b6",
  "#f39c12","#e74c3c","#fd79a8","#fdcb6e",
  "#a29bfe","#ff7675","#fab1a0","#ffeaa7","#dfe6e9",
]

function heartExplosion(cx: number, cy: number, color: string): Particle[] {
  const pts: Particle[] = []
  for (let t = 0; t < Math.PI * 2; t += 0.12) {
    const hx = 16 * Math.pow(Math.sin(t), 3)
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    const speed = 0.12 + Math.random() * 0.05
    pts.push({
      x: cx, y: cy,
      vx: hx * speed + (Math.random() - 0.5) * 1.5,
      vy: hy * speed + (Math.random() - 0.5) * 1.5,
      life: 80 + Math.random() * 40, maxLife: 120,
      color, size: 2 + Math.random() * 2,
      shape: "circle", gravity: 0.04,
    })
  }
  return pts
}

function burstExplosion(cx: number, cy: number, color: string, count = 80): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const speed = 2.5 + Math.random() * 5
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 45 + Math.random() * 55, maxLife: 100,
      color, size: 1.5 + Math.random() * 2.5,
      shape: Math.random() > 0.75 ? "star" : "circle",
      gravity: 0.08,
    } as Particle
  })
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    const radius = i % 2 === 0 ? r : r * 0.4
    const px = x + radius * Math.cos(angle)
    const py = y + radius * Math.sin(angle)
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

interface Props {
  active: boolean
  onComplete?: () => void
  heartMode?: boolean
  continuous?: boolean
}

export default function FireworksCanvas({ active, onComplete, heartMode = false, continuous = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particles: Particle[] = []
    let rockets: Rocket[] = []
    let frame = 0
    let animId: number
    let stopped = false

    const launch = () => {
      if (stopped) return
      const x = window.innerWidth * (0.1 + Math.random() * 0.8)
      const targetY = window.innerHeight * (0.08 + Math.random() * 0.45)
      rockets.push({
        x, y: window.innerHeight,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -14 - Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        trail: [], targetY, alive: true,
      })
    }

    const explode = (x: number, y: number) => {
      const c1 = COLORS[Math.floor(Math.random() * COLORS.length)]
      const c2 = COLORS[Math.floor(Math.random() * COLORS.length)]
      if (heartMode || Math.random() > 0.55) {
        particles.push(...heartExplosion(x, y, c1))
        particles.push(...burstExplosion(x, y, c2, 25))
      } else {
        particles.push(...burstExplosion(x, y, c1, 90))
        particles.push(...burstExplosion(x, y, c2, 25))
      }
    }

    // Initial burst
    for (let i = 0; i < 4; i++) setTimeout(launch, i * 250)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      if ((continuous || frame < 180) && frame % 22 === 0) launch()
      if (!continuous && frame === 60) { launch(); launch() }

      rockets = rockets.filter(r => {
        r.x += r.vx; r.y += r.vy; r.vy += 0.18
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 10) r.trail.shift()

        r.trail.forEach((pt, i) => {
          ctx.globalAlpha = (i / r.trail.length) * 0.7
          ctx.shadowColor = r.color; ctx.shadowBlur = 6
          ctx.fillStyle = r.color
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.globalAlpha = 1; ctx.shadowBlur = 0

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y)
          return false
        }
        return true
      })

      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy
        p.vy += p.gravity; p.vx *= 0.99
        p.life--
        const alpha = Math.max(0, p.life / p.maxLife)
        ctx.globalAlpha = alpha
        ctx.shadowColor = p.color; ctx.shadowBlur = 8
        ctx.fillStyle = p.color
        if (p.shape === "star") drawStar(ctx, p.x, p.y, p.size * 1.6)
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill() }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0
        return p.life > 0
      })

      if (!continuous && frame > 220 && particles.length === 0 && rockets.length === 0) {
        onComplete?.()
        return
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      stopped = true
      cancelAnimationFrame(animId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [active, continuous, heartMode, onComplete])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 35 }}
    />
  )
}
