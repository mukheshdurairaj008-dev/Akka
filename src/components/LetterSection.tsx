import { useRef, useEffect, useState } from "react"
import FloatingHearts from "./FloatingHearts"
import { LETTER } from "../data/content"

export default function LetterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(LETTER.body)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const formatBody = (text: string) =>
    text.split("\n\n").filter(Boolean).map((para, i) => (
      <p key={i} className="mb-5 last:mb-0" style={{ color: "rgba(245,230,211,0.88)", lineHeight: 1.9 }}>
        {para}
      </p>
    ))

  return (
    <section
      id="letter"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6"
      style={{ background: "linear-gradient(180deg, #050508 0%, #0a0614 40%, #050508 100%)" }}
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full"
          style={{ width: 600, height: 600, top: "10%", left: "50%", transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(155,89,182,0.06) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full"
          style={{ width: 400, height: 400, bottom: "5%", right: "10%",
            background: "radial-gradient(circle, rgba(232,121,168,0.05) 0%, transparent 70%)" }} />
      </div>

      <FloatingHearts count={8} colors={["#e879a8","#9b59b6","#d4af37"]} />

      <div
        ref={ref}
        className="relative w-full max-w-3xl"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 1.2s ease" }}
      >
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="font-cinzel mb-3" style={{ color: "rgba(212,175,55,0.6)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            A PERSONAL NOTE
          </p>
          <h2
            className="font-playfair italic"
            style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)", color: "#f5e6d3", lineHeight: 1.3 }}
          >
            {LETTER.heading}
          </h2>
          <div className="gold-divider mt-6" style={{ width: 200, margin: "1.5rem auto 0" }} />
        </div>

        {/* Letter card */}
        <div className="letter-paper rounded-lg p-8 md:p-14 relative overflow-hidden">
          {/* Decorative corner flowers */}
          {["top-3 left-4","top-3 right-4","bottom-3 left-4","bottom-3 right-4"].map((pos, i) => (
            <span key={i} className={`absolute ${pos} text-xl pointer-events-none`} style={{ opacity: 0.3 }}>🌸</span>
          ))}

          {/* Floating mini hearts inside letter */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="absolute text-sm" style={{
                left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 30}%`,
                opacity: 0.12, color: "#e879a8",
                animation: `floatDrift ${3 + i}s ${i * 0.6}s ease-in-out infinite`
              }}>❤</span>
            ))}
          </div>

          {/* Edit toggle */}
          <button
            onClick={() => setEditing(!editing)}
            className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-cinzel transition-all"
            style={{
              background: editing ? "rgba(212,175,55,0.2)" : "rgba(245,230,211,0.06)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#d4af37", letterSpacing: "0.1em",
            }}
          >
            {editing ? "✓ Done" : "✏ Edit"}
          </button>

          {/* Salutation */}
          <p
            className="font-great-vibes mb-6"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "#e879a8", textShadow: "0 0 20px rgba(232,121,168,0.3)" }}
          >
            {LETTER.salutation}
          </p>

          {/* Body */}
          {editing ? (
            <textarea
              className="w-full font-lora rounded-md p-4 resize-none"
              style={{
                background: "rgba(245,230,211,0.05)",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "rgba(245,230,211,0.88)",
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                lineHeight: 1.9,
                minHeight: 280,
                outline: "none",
              }}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          ) : (
            <div className="font-lora" style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}>
              {formatBody(message)}
            </div>
          )}

          {/* Closing */}
          <div className="mt-8 border-t pt-6" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
            <p className="font-lora italic mb-2" style={{ color: "rgba(245,230,211,0.6)", fontSize: "0.95rem" }}>
              {LETTER.closing}
            </p>
            <p className="font-great-vibes" style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "#d4af37" }}>
              {LETTER.signature}
            </p>
          </div>

          {/* Wax seal decorative */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3">
              <div style={{ height: 1, width: 80, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4))" }} />
              <span style={{ fontSize: "1.6rem", animation: "heartBeat 2s ease-in-out infinite" }}>🌸</span>
              <div style={{ height: 1, width: 80, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.4))" }} />
            </div>
          </div>
        </div>

        {/* Keep reading */}
        <div className="text-center mt-10">
          <a
            href="#memories"
            className="font-cinzel inline-block"
            style={{
              color: "rgba(212,175,55,0.7)", fontSize: "0.8rem", letterSpacing: "0.2em",
              textDecoration: "none", transition: "color 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#d4af37")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(212,175,55,0.7)")}
          >
            Keep Reading ↓
          </a>
        </div>
      </div>
    </section>
  )
}
