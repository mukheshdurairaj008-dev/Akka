import { useRef, useEffect, useState } from "react"
import FloatingHearts from "./FloatingHearts"
import { BOND } from "../data/content"

export default function BondSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const paragraphs = BOND.body.split("\n\n").filter(Boolean)

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050508 0%, #0e0618 50%, #050508 100%)" }}
    >
      {/* Large background heart */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          fontSize: "clamp(20rem, 60vw, 40rem)",
          opacity: 0.02,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "heartBeat 4s ease-in-out infinite",
          lineHeight: 1,
        }}
      >
        ❤
      </div>

      {/* Glowing orb */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 700, height: 700, top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(192,57,43,0.05) 0%, transparent 70%)" }} />

      <FloatingHearts count={10} colors={["#c0392b","#e879a8","#d4af37","#9b59b6"]} />

      <div
        ref={ref}
        className="relative max-w-3xl w-full text-center"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(50px)", transition: "all 1.4s ease" }}
      >
        <p className="font-cinzel mb-4" style={{ color: "rgba(212,175,55,0.6)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
          OUR STORY
        </p>

        <h2
          className="font-playfair"
          style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.2, marginBottom: "2.5rem" }}
        >
          <span style={{ color: "#f5e6d3" }}>{BOND.heading.split("&")[0]}&</span>
          <br />
          <span className="italic" style={{ color: "#e879a8" }}>{BOND.heading.split("&")[1]}</span>
        </h2>

        <div className="gold-divider mb-10" style={{ width: 160, margin: "0 auto 2.5rem" }} />

        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-lora"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                lineHeight: 1.95,
                color: i === 0 ? "rgba(245,230,211,0.65)" : i === paragraphs.length - 1 ? "rgba(245,230,211,0.9)" : "rgba(245,230,211,0.75)",
                fontStyle: i === 0 ? "italic" : "normal",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `all 1s ${0.2 + i * 0.15}s ease`,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div style={{ height: 1, width: 80, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.5))" }} />
          <span style={{ fontSize: "1.8rem", animation: "heartBeat 2s ease-in-out infinite" }}>❤️</span>
          <div style={{ height: 1, width: 80, background: "linear-gradient(to left, transparent, rgba(212,175,55,0.5))" }} />
        </div>

        {/* Sister-brother icons */}
        <div className="flex justify-center gap-8 mt-8 opacity-40">
          {["🌸", "✨", "🌟"].map((emoji, i) => (
            <span key={i} style={{ fontSize: "1.4rem", animation: `sparkle 2s ${i * 0.5}s ease-in-out infinite` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
