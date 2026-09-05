import { useState, useEffect, useRef } from "react"
import Intro from "./components/Intro"
import LetterSection from "./components/LetterSection"
import MemoryTree from "./components/MemoryTree"
import BondSection from "./components/BondSection"
import AdviceSection from "./components/AdviceSection"
import FinalScene from "./components/FinalScene"

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [musicError, setMusicError] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleEnter = () => {
    setShowIntro(false)
    setTimeout(() => {
      document.getElementById("letter")?.scrollIntoView({ behavior: "smooth" })
    }, 200)
  }

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => setShowIntro(true), 700)
  }

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setMusicError(true)
      }
    }
  }

  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="/music/birthday.mp3"
        loop
        onError={() => setMusicError(true)}
      />

      {/* Progress bar */}
      {!showIntro && (
        <div
          className="fixed top-0 left-0 h-0.5 z-50"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(to right, #d4af37, #e879a8, #9b59b6)",
            boxShadow: "0 0 8px rgba(212,175,55,0.6)",
            transition: "width 0.1s linear",
          }}
        />
      )}

      {/* Music control */}
      {!showIntro && (
        <button
          onClick={toggleMusic}
          title={musicError ? "Add birthday.mp3 to public/music/" : playing ? "Pause music" : "Play music"}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50"
          style={{
            background: "rgba(5,5,8,0.85)",
            border: "1px solid rgba(212,175,55,0.4)",
            backdropFilter: "blur(12px)",
            boxShadow: playing ? "0 0 20px rgba(212,175,55,0.4)" : "0 4px 16px rgba(0,0,0,0.5)",
            color: musicError ? "rgba(245,230,211,0.3)" : "#d4af37",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            cursor: musicError ? "not-allowed" : "pointer",
          }}
        >
          {musicError ? "🔇" : playing ? "⏸" : "🎵"}
        </button>
      )}

      {/* Main page content */}
      <LetterSection />
      <MemoryTree />
      <BondSection />
      <AdviceSection />
      <FinalScene onReplay={handleReplay} />

      {/* Intro overlay — rendered on top */}
      {showIntro && <Intro onEnter={handleEnter} />}
    </div>
  )
}
