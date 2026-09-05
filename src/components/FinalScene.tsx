import { useRef, useEffect, useState } from "react"
import FireworksCanvas from "./FireworksCanvas"
import FloatingHearts from "./FloatingHearts"
import { FINAL } from "../data/content"

interface Props {
  onReplay: () => void
}

export default function FinalScene({ onReplay }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)
  const [fireworksActive, setFireworksActive] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          setVisible(true)
          // Stagger the text reveals
          setTimeout(() => setLineIndex(1), 800)
          setTimeout(() => setLineIndex(2), 2200)
          setTimeout(() => setFireworksActive(true), 3200)
          setTimeout(() => setLineIndex(3), 4500)
          setTimeout(() => setLineIndex(4), 5500)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [visible])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{ background: "#050508" }}
    >
      {/* Fireworks */}
      <FireworksCanvas active={fireworksActive} continuous heartMode />

      {/* Ambient hearts */}
      {visible && <FloatingHearts count={14} colors={["#e879a8","#d4af37","#c0392b","#9b59b6","#f39c12"]} />}

      {/* Background glow heart */}
      <div className="absolute pointer-events-none select-none"
        style={{
          fontSize: "clamp(30rem, 80vw, 60rem)",
          opacity: fireworksActive ? 0.03 : 0,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          transition: "opacity 2s ease",
          animation: "heartBeat 4s ease-in-out infinite",
          color: "#e879a8",
          lineHeight: 1,
        }}
      >
        ❤
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        {/* "This isn't the end..." */}
        <div
          style={{
            opacity: lineIndex >= 1 ? 1 : 0,
            transform: lineIndex >= 1 ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.2s ease",
            marginBottom: "1.5rem",
          }}
        >
          <p
            className="font-playfair italic"
            style={{
              fontSize: "clamp(1.2rem, 4vw, 2rem)",
              color: "rgba(245,230,211,0.6)",
              letterSpacing: "0.05em",
            }}
          >
            {FINAL.line1}
          </p>
        </div>

        {/* "It's Chapter 27." */}
        <div
          style={{
            opacity: lineIndex >= 2 ? 1 : 0,
            transform: lineIndex >= 2 ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.2s ease",
            marginBottom: "3rem",
          }}
        >
          <p
            className="font-cinzel"
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
              color: "#d4af37",
              letterSpacing: "0.15em",
              textShadow: lineIndex >= 2 ? "0 0 40px rgba(212,175,55,0.5)" : "none",
            }}
          >
            {FINAL.line2}
          </p>
        </div>

        {/* Main title */}
        <div
          style={{
            opacity: lineIndex >= 3 ? 1 : 0,
            transform: lineIndex >= 3 ? "scale(1)" : "scale(0.8)",
            transition: "all 1.5s cubic-bezier(0.34, 1.3, 0.64, 1)",
          }}
        >
          <h1
            className="font-cinzel text-gold-glow"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 4.5rem)",
              lineHeight: 1.15,
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            {FINAL.title.replace(" ❤️", "")}
          </h1>
          <div style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", animation: "heartBeat 1.5s ease-in-out infinite", marginBottom: "1rem" }}>
            ❤️
          </div>

          <p
            className="font-great-vibes"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#e879a8",
              textShadow: "0 0 30px rgba(232,121,168,0.5)",
            }}
          >
            {FINAL.subtitle.replace("With love, ", "")}
          </p>
          <p className="font-lora italic mt-1" style={{ color: "rgba(245,230,211,0.5)", fontSize: "0.9rem" }}>
            With love,
          </p>
        </div>

        {/* Replay button */}
        <div
          style={{
            opacity: lineIndex >= 4 ? 1 : 0,
            transform: lineIndex >= 4 ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease",
            marginTop: "3.5rem",
          }}
        >
          <div className="gold-divider mb-8" style={{ width: 200, margin: "0 auto 2rem" }} />
          <button
            className="btn-glow px-10 py-4 text-sm rounded-sm"
            onClick={onReplay}
          >
            {FINAL.replayBtn}
          </button>
        </div>

        {/* Final decorative sparkles */}
        {lineIndex >= 3 && (
          <div className="flex justify-center gap-6 mt-8">
            {["✨","🌸","❤️","🌸","✨"].map((e, i) => (
              <span
                key={i}
                style={{
                  fontSize: "1.2rem",
                  opacity: 0.6,
                  animation: `sparkle 2s ${i * 0.4}s ease-in-out infinite`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
