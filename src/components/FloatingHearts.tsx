import { useEffect, useRef } from "react"

interface HeartProps {
  count?: number
  colors?: string[]
  className?: string
}

export default function FloatingHearts({ count = 12, colors = ["#e879a8","#d4af37","#c0392b","#9b59b6"], className = "" }: HeartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = ""

    const spawn = () => {
      if (!container) return
      const heart = document.createElement("div")
      const size = 10 + Math.random() * 18
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const duration = 4 + Math.random() * 5
      const delay = Math.random() * 2

      heart.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: -30px;
        font-size: ${size}px;
        color: ${color};
        opacity: 0;
        animation: floatUp ${duration}s ${delay}s ease-out forwards;
        filter: drop-shadow(0 0 4px ${color});
        pointer-events: none;
      `
      heart.textContent = Math.random() > 0.5 ? "❤️" : "✨"
      container.appendChild(heart)
      setTimeout(() => { heart.remove() }, (duration + delay) * 1000)
    }

    const interval = setInterval(spawn, 600)
    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 400)
    return () => clearInterval(interval)
  }, [count, colors])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    />
  )
}
