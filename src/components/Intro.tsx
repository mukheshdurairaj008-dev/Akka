import { useState, useEffect, useRef, ChangeEvent } from "react"
import FireworksCanvas from "./FireworksCanvas"
import FloatingHearts from "./FloatingHearts"
import { HERO } from "../data/content"

type Phase = "dark" | "particles" | "countdown" | "fireworks" | "title" | "hero"

interface IntroProps {
  onEnter: () => void
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  top: `${5 + Math.random() * 90}%`,
  size: 1 + Math.random() * 3,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 4,
  color: ["#d4af37", "#e879a8", "#9b59b6", "#fff", "#c0392b"][Math.floor(Math.random() * 5)],
}))

export default function Intro({ onEnter }: IntroProps) {
  const [phase, setPhase] = useState<Phase>("dark")
  const [countdown, setCountdown] = useState(3)
  const [exiting, setExiting] = useState(false)
  const [heroImgError, setHeroImgError] = useState(false)
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    return localStorage.getItem("custom_hero_photo") || null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = []
    t.push(setTimeout(() => setPhase("particles"), 600))
    t.push(setTimeout(() => { setPhase("countdown"); setCountdown(3) }, 2200))
    t.push(setTimeout(() => setCountdown(2), 3400))
    t.push(setTimeout(() => setCountdown(1), 4600))
    // Immediately after countdown ends:
    t.push(setTimeout(() => setPhase("fireworks"), 5500))
    t.push(setTimeout(() => setPhase("title"), 7800))
    t.push(setTimeout(() => setPhase("hero"), 10000))
    return () => t.forEach(clearTimeout)
  }, [])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 900)
  }

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setCustomPhoto(result)
        localStorage.setItem("custom_hero_photo", result)
        setHeroImgError(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const activePhotoSrc = customPhoto || HERO.heroPhoto
  const isPostCountdown = phase === "fireworks" || phase === "title" || phase === "hero"

  useEffect(() => {
    setHeroImgError(false)
  }, [HERO.heroPhoto, customPhoto])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        zIndex: 50,
        background: "#050508",
        transition: "opacity 0.9s ease",
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* Hidden file input for changing background photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* FULL-SCREEN HERO BACKGROUND PHOTO (Visible right after countdown) */}
      {isPostCountdown && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            zIndex: 1,
            transition: "opacity 1.2s ease, transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)",
            opacity: 1,
            animation: "fadeInScale 1.4s ease forwards",
          }}
        >
          {!heroImgError ? (
            <img
              src={activePhotoSrc}
              alt="Birthday celebration background"
              className="w-full h-full object-cover min-w-full min-h-full"
              style={{
                objectPosition: "center 30%",
                filter: "brightness(0.9) contrast(1.05)",
                transform: phase === "hero" ? "scale(1)" : "scale(1.04)",
                transition: "transform 8s ease-out",
              }}
              onError={() => {
                if (!customPhoto) {
                  setHeroImgError(true)
                }
              }}
            />
          ) : (
            // Aesthetic placeholder with direct photo picker when no photo is saved
            <div
              className="w-full h-full flex flex-col items-center justify-center relative p-6"
              style={{ background: "radial-gradient(ellipse at center, #1a0f28 0%, #080512 70%, #050508 100%)" }}
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 px-10 py-12 cursor-pointer transition-all hover:scale-105"
                style={{
                  borderColor: "rgba(212,175,55,0.5)",
                  background: "rgba(13,10,20,0.7)",
                  backdropFilter: "blur(12px)",
                  maxWidth: 440,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.2)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}
                >
                  <span style={{ fontSize: 32 }}>📸</span>
                </div>
                <p className="font-cinzel text-center font-semibold" style={{ color: "#d4af37", fontSize: "1rem", letterSpacing: "0.15em" }}>
                  SET BACKGROUND PHOTO
                </p>
                <p className="font-lora text-center" style={{ color: "rgba(245,230,211,0.7)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  Click to select a photo from your computer, or place it at <code style={{ color: "#e879a8" }}>public/photos/hero.jpg</code>
                </p>
                <button
                  type="button"
                  className="btn-glow px-6 py-2.5 text-xs rounded-full mt-2"
                >
                  📁 Select Photo From Computer
                </button>
              </div>
            </div>
          )}

          {/* Cinematic lighting overlays for readability and luxury mood */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(5,5,8,0.4) 0%, rgba(5,5,8,0.15) 30%, rgba(5,5,8,0.3) 65%, rgba(5,5,8,0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 35%, rgba(5,5,8,0.75) 100%)",
            }}
          />
        </div>
      )}

      {/* Discreet button to change photo anytime during intro */}
      {isPostCountdown && (
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Change background photo"
          className="absolute top-5 left-5 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-cinzel transition-all hover:scale-105"
          style={{
            background: "rgba(5,5,8,0.65)",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#d4af37",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            cursor: "pointer",
          }}
        >
          <span>📷</span>
          <span className="hidden sm:inline">Change Photo</span>
        </button>
      )}

      {/* Ambient particles (Pre-countdown & early phases) */}
      {(phase === "particles" || phase === "countdown") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
          {PARTICLES.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left, top: p.top,
                width: p.size, height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
                animation: `floatDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
                opacity: phase === "particles" ? 1 : 0.6,
                transition: "opacity 1s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks canvas (rendered over background photo) */}
      <FireworksCanvas active={phase === "fireworks" || phase === "title"} />

      {/* Countdown (3 ... 2 ... 1) */}
      {phase === "countdown" && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 40 }}
        >
          <div
            key={countdown}
            className="font-cinzel text-center select-none"
            style={{
              fontSize: "clamp(8rem, 25vw, 18rem)",
              color: "#d4af37",
              textShadow: "0 0 60px rgba(212,175,55,0.9), 0 0 120px rgba(212,175,55,0.5)",
              animation: "countdownZoom 1.1s ease forwards",
            }}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* Title & Celebration Reveal (Post-countdown with full-screen photo background) */}
      {(phase === "title" || phase === "hero") && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ zIndex: 40 }}
        >
          {/* Decorative top line */}
          <div className="gold-divider mb-8" style={{ width: "min(400px, 80vw)" }} />

          <p
            className="font-cinzel mb-4 tracking-widest uppercase"
            style={{
              fontSize: "clamp(0.65rem, 1.5vw, 0.9rem)",
              color: "rgba(212,175,55,0.85)",
              letterSpacing: "0.4em",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              animation: "fadeInUp 1s 0.2s ease both",
            }}
          >
            A Cinematic Birthday Story
          </p>

          <h1
            className="font-cinzel text-center text-gold-glow"
            style={{
              fontSize: "clamp(2.5rem, 9vw, 7rem)",
              animation: "titleReveal 1.5s 0.3s ease both",
              lineHeight: 1.1,
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.9))",
            }}
          >
            {HERO.title}
          </h1>

          <div className="flex items-center gap-4 my-3">
            <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, #e879a8)" }} />
            <span style={{ color: "#e879a8", fontSize: "1.6rem", animation: "heartBeat 1.5s ease-in-out infinite", filter: "drop-shadow(0 2px 10px rgba(232,121,168,0.6))" }}>❤️</span>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, #e879a8)" }} />
          </div>

          <h2
            className="font-great-vibes text-rose-glow text-center"
            style={{
              fontSize: "clamp(3.2rem, 10vw, 8rem)",
              animation: "titleReveal 1.5s 0.8s ease both",
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.9))",
            }}
          >
            {HERO.name}
          </h2>

          <p
            className="font-playfair italic mt-4 text-center"
            style={{
              fontSize: "clamp(0.95rem, 2.5vw, 1.35rem)",
              color: "rgba(245,230,211,0.9)",
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              animation: "fadeInUp 1s 1.2s ease both",
            }}
          >
            {HERO.subtitle}
          </p>

          {phase === "hero" && (
            <>
              <p
                className="font-lora mt-3 text-center"
                style={{
                  fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
                  color: "rgba(245,230,211,0.8)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                  maxWidth: 520,
                  animation: "fadeInUp 1s 0.2s ease both",
                }}
              >
                {HERO.tagline}
              </p>

              <button
                className="btn-glow mt-10 px-10 py-4 text-sm rounded-full font-semibold"
                style={{
                  animation: "fadeInScale 1s 0.6s ease both",
                  boxShadow: "0 0 30px rgba(212,175,55,0.6), 0 8px 32px rgba(0,0,0,0.8)",
                }}
                onClick={handleEnter}
              >
                {HERO.enterBtn}
              </button>

              <FloatingHearts count={10} />
            </>
          )}

          <div className="gold-divider mt-8" style={{ width: "min(400px, 80vw)" }} />
        </div>
      )}

      {/* Corner sparkles */}
      {(phase === "title" || phase === "hero") && (
        <>
          {[
            { top: "8%", left: "5%", delay: "0s" },
            { top: "8%", right: "5%", delay: "0.5s" },
            { bottom: "8%", left: "5%", delay: "1s" },
            { bottom: "8%", right: "5%", delay: "0.3s" },
          ].map((pos, i) => (
            <div key={i} className="absolute text-2xl pointer-events-none" style={{ ...pos, animation: `sparkle 2s ${pos.delay} ease-in-out infinite` }}>✨</div>
          ))}
        </>
      )}

      <audio ref={audioRef} src="/music/birthday.mp3" loop />
    </div>
  )
}
