import { useRef, useEffect, useState } from "react"
import { ADVICE } from "../data/content"

function AdviceLine({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="flex items-start gap-5 py-5"
      style={{
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-30px)",
        transition: `all 0.8s ${index * 0.12}s ease`,
      }}
    >
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: 36, height: 36,
          background: "rgba(212,175,55,0.1)",
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 0 12px rgba(212,175,55,0.15)",
        }}
      >
        <span style={{ fontSize: "0.75rem", fontFamily: "'Cinzel',serif", color: "#d4af37" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p
        className="font-playfair italic"
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#f5e6d3",
          lineHeight: 1.65,
          paddingTop: 4,
        }}
      >
        "{text}"
      </p>
    </div>
  )
}

export default function AdviceSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)
  const [headingVisible, setHeadingVisible] = useState(false)
  const [closingVisible, setClosingVisible] = useState(false)

  useEffect(() => {
    const obs1 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeadingVisible(true) },
      { threshold: 0.3 }
    )
    const obs2 = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setClosingVisible(true) },
      { threshold: 0.5 }
    )
    if (headingRef.current) obs1.observe(headingRef.current)
    if (closingRef.current) obs2.observe(closingRef.current)
    return () => { obs1.disconnect(); obs2.disconnect() }
  }, [])

  return (
    <section
      className="relative min-h-screen py-28 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050508 0%, #0a0a18 40%, #050508 100%)",
      }}
    >
      {/* Sunrise glow background */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "60%", background: "linear-gradient(to top, rgba(192,57,43,0.04), rgba(212,175,55,0.03), transparent)" }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 600, height: 400, bottom: "5%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)" }} />

      {/* Scattered stars */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          left: `${5 + Math.random() * 90}%`,
          top: `${5 + Math.random() * 90}%`,
          fontSize: "0.5rem",
          color: "#d4af37",
          opacity: 0.3,
          animation: `sparkle ${2 + i * 0.4}s ${i * 0.3}s ease-in-out infinite`,
        }}>✦</div>
      ))}

      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-16"
          style={{ opacity: headingVisible ? 1 : 0, transform: headingVisible ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease" }}
        >
          <p className="font-cinzel mb-3" style={{ color: "rgba(212,175,55,0.6)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            FROM YOUR LITTLE BROTHER
          </p>
          <h2 className="font-playfair" style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.5rem)", color: "#f5e6d3", lineHeight: 1.3 }}>
            {ADVICE.heading}
          </h2>
          <p className="font-lora italic mt-3" style={{ color: "rgba(245,230,211,0.5)", fontSize: "0.95rem" }}>
            {ADVICE.subheading}
          </p>
          <div className="gold-divider mt-6" style={{ width: 160, margin: "1.5rem auto 0" }} />
        </div>

        {/* Advice lines */}
        <div>
          {ADVICE.lines.map((line, i) => (
            <AdviceLine key={i} text={line} index={i} />
          ))}
        </div>

        {/* Closing */}
        <div
          ref={closingRef}
          className="text-center mt-16"
          style={{ opacity: closingVisible ? 1 : 0, transform: closingVisible ? "scale(1)" : "scale(0.9)", transition: "all 1.2s ease" }}
        >
          <div className="gold-divider mb-8" style={{ width: 200, margin: "0 auto 2rem" }} />
          <p
            className="font-great-vibes text-gold-glow"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", lineHeight: 1.2 }}
          >
            {ADVICE.closing}
          </p>
          {/* Small hearts */}
          <div className="flex justify-center gap-3 mt-4">
            {["❤️","✨","🌟","✨","❤️"].map((e, i) => (
              <span key={i} style={{ fontSize: "1.1rem", animation: `sparkle 2s ${i * 0.3}s ease-in-out infinite` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
