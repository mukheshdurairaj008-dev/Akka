import { useRef, useEffect, useState, useCallback, ChangeEvent } from "react"
import { memories, Memory } from "../data/memories"
import { TREE } from "../data/content"

function MemoryCard({
  memory,
  index,
  customPhoto,
  onOpen,
  onUpload,
}: {
  memory: Memory
  index: number
  customPhoto?: string
  onOpen: (idx: number) => void
  onUpload: (id: number, file: File) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [visible, setVisible] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const isLeft = memory.side === "left"
  const tilts = [-3.5, 3, -4.5, 2.5, -2, 4, -3, 3.5, -4, 2]
  const tilt = tilts[index % tilts.length]
  const photoSize = "clamp(190px, 24vw, 270px)"
  // Prioritize photo path defined in src/data/photos.ts
  const photoSrc = memory.imagePath || customPhoto

  useEffect(() => {
    setImgError(false)
  }, [photoSrc])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(memory.id, file)
      setImgError(false)
    }
  }

  return (
    <div
      ref={ref}
      className="relative flex items-center"
      style={{
        justifyContent: isLeft ? "flex-start" : "flex-end",
        paddingLeft: isLeft ? 0 : "50%",
        paddingRight: isLeft ? "50%" : 0,
        marginBottom: "clamp(2.5rem, 6vw, 4.5rem)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Golden branch line connecting trunk to photo */}
      <div
        ref={branchRef}
        style={{
          position: "absolute",
          top: "50%",
          [isLeft ? "right" : "left"]: "50%",
          height: "2px",
          width: visible ? "clamp(30px, 6vw, 65px)" : "0px",
          background: `linear-gradient(${isLeft ? "to left" : "to right"}, #d4af37, rgba(212,175,55,0.25))`,
          boxShadow: "0 0 8px rgba(212,175,55,0.6)",
          transform: "translateY(-50%)",
          transition: "width 0.7s ease",
          transitionDelay: `${index * 0.03}s`,
        }}
      />

      {/* Glowing golden trunk node dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: visible ? 12 : 0,
          height: visible ? 12 : 0,
          background: "radial-gradient(circle, #ffeaa7, #d4af37)",
          borderRadius: "50%",
          boxShadow: "0 0 16px rgba(212,175,55,0.9)",
          transition: "all 0.4s ease",
          transitionDelay: `${index * 0.03 + 0.1}s`,
          zIndex: 5,
        }}
      />

      {/* Photo Frame Container (Pure photo card with attractive luxury presentation) */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? `rotate(${tilt}deg)`
            : `rotate(${tilt}deg) ${isLeft ? "translateX(-50px)" : "translateX(50px)"}`,
          transition: "all 0.8s cubic-bezier(0.34, 1.4, 0.64, 1)",
          transitionDelay: `${index * 0.03 + 0.12}s`,
          cursor: "pointer",
        }}
        onClick={() => onOpen(index)}
        className="group"
      >
        <div
          className="photo-frame-luxury"
          style={{ width: photoSize }}
        >
          {/* Top pin/accent badge */}
          <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
            style={{
              background: "rgba(5,5,8,0.75)",
              border: "1px solid rgba(212,175,55,0.4)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            <span style={{ color: "#d4af37", fontSize: "0.65rem", fontFamily: "'Cinzel',serif", fontWeight: 600, letterSpacing: "0.08em" }}>
              #{String(memory.id).padStart(2, "0")}
            </span>
          </div>

          {/* Photo Inner Container */}
          <div
            className="photo-inner relative overflow-hidden"
            style={{
              width: "100%",
              paddingTop: "115%", // Elegant portrait aspect ratio
              background: "linear-gradient(145deg, #130d1e, #090610)",
            }}
          >
            {!imgError ? (
              <img
                src={photoSrc}
                alt={`Photo ${memory.id}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => {
                  if (!customPhoto) setImgError(true)
                }}
              />
            ) : (
              // Aesthetic placeholder when photo hasn't been placed yet
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 transition-all group-hover:scale-105"
                style={{ background: "radial-gradient(ellipse at center, #1b1028 0%, #0c0816 100%)" }}
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", boxShadow: "0 0 15px rgba(212,175,55,0.15)" }}
                >
                  <span style={{ fontSize: "1.4rem" }}>📷</span>
                </div>
                <p style={{ color: "#d4af37", fontSize: "0.75rem", textAlign: "center", fontFamily: "'Cinzel',serif", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Photo #{String(memory.id).padStart(2, "0")}
                </p>
                <span className="text-[10px] px-2.5 py-1 rounded-full text-center"
                  style={{ background: "rgba(232,121,168,0.15)", border: "1px solid rgba(232,121,168,0.3)", color: "rgba(245,230,211,0.8)" }}>
                  Click to add
                </span>
              </div>
            )}

            {/* Shimmer light reflection effect on hover */}
            <div className="photo-shimmer" />

            {/* Soft vignette on photo corners */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, transparent 65%, rgba(5,5,8,0.35) 100%)" }}
            />
          </div>
        </div>
      </div>

      {/* Subtle floating gold counter on side */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          [isLeft ? "left" : "right"]: "calc(50% + clamp(40px, 8vw, 85px))",
          transform: "translateY(-50%)",
          opacity: visible ? 0.4 : 0,
          transition: "opacity 0.5s ease",
          transitionDelay: `${index * 0.03 + 0.3}s`,
        }}
      >
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.7rem", color: "#d4af37", letterSpacing: "0.15em", fontWeight: 600 }}>
          {String(memory.id).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}

export default function MemoryTree() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [currentMemory, setCurrentMemory] = useState(1)
  const [customPhotos, setCustomPhotos] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem("custom_memory_photos")
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const modalFileInputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Track scroll position to update sticky counter
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      setCurrentMemory(Math.min(27, Math.max(1, Math.ceil(progress * 27))))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return
      if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev !== null && prev < memories.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : memories.length - 1))
      } else if (e.key === "Escape") {
        setActiveIdx(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIdx])

  const handleUpload = useCallback((id: number, file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setCustomPhotos((prev) => {
        const next = { ...prev, [id]: result }
        try {
          localStorage.setItem("custom_memory_photos", JSON.stringify(next))
        } catch {
          // Ignore localStorage quota
        }
        return next
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleModalFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (activeIdx === null) return
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(memories[activeIdx].id, file)
    }
  }

  const activeMemory = activeIdx !== null ? memories[activeIdx] : null
  // Prioritize photo path defined in src/data/photos.ts
  const activePhotoSrc = activeMemory ? activeMemory.imagePath || customPhotos[activeMemory.id] : ""

  return (
    <section
      id="memories"
      ref={sectionRef}
      className="relative py-28"
      style={{ background: "linear-gradient(180deg, #050508 0%, #080514 25%, #0a0618 75%, #050508 100%)" }}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 800,
            height: 800,
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(155,89,182,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: "60%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Sticky memory counter pill */}
      <div
        className="sticky top-6 mx-auto flex justify-center pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="inline-flex items-center gap-3 rounded-full px-5 py-2"
          style={{
            background: "rgba(5,5,8,0.85)",
            border: "1px solid rgba(212,175,55,0.3)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 15px rgba(212,175,55,0.15)",
          }}
        >
          <span style={{ color: "#d4af37", fontFamily: "'Cinzel',serif", fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 600 }}>
            PHOTO
          </span>
          <span style={{ color: "#e879a8", fontFamily: "'Cinzel',serif", fontSize: "1.05rem", fontWeight: 700 }}>
            {String(currentMemory).padStart(2, "0")}
          </span>
          <span style={{ color: "rgba(245,230,211,0.4)", fontFamily: "'Cinzel',serif", fontSize: "0.75rem" }}>/ 27</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-24 mt-6">
          <p className="font-cinzel mb-3" style={{ color: "rgba(212,175,55,0.7)", letterSpacing: "0.3em", fontSize: "0.8rem", fontWeight: 600 }}>
            27 BEAUTIFUL MOMENTS
          </p>
          <h2 className="font-playfair" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#f5e6d3", lineHeight: 1.25 }}>
            {TREE.heading}
          </h2>
          <p className="font-lora italic mt-3" style={{ color: "rgba(245,230,211,0.6)", fontSize: "1rem" }}>
            {TREE.subheading}
          </p>
          <div className="gold-divider mt-6" style={{ width: 220, margin: "1.5rem auto 0" }} />
        </div>

        {/* Tree Trunk & Photos */}
        <div className="relative">
          {/* Central glowing trunk */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: 0,
              bottom: 0,
              transform: "translateX(-50%)",
              width: 2,
              background: "linear-gradient(to bottom, transparent, #d4af37 4%, rgba(232,121,168,0.7) 50%, #d4af37 96%, transparent)",
              boxShadow: "0 0 14px rgba(212,175,55,0.5)",
            }}
          />

          {/* Floating leaf accents */}
          {[12, 26, 40, 54, 68, 82, 94].map((pct, i) => (
            <div
              key={i}
              className="absolute pointer-events-none select-none"
              style={{
                left: `calc(50% + ${i % 2 === 0 ? "-18px" : "10px"})`,
                top: `${pct}%`,
                fontSize: "1rem",
                opacity: 0.35,
                animation: `floatDrift ${3 + i}s ${i * 0.4}s ease-in-out infinite`,
              }}
            >
              🍃
            </div>
          ))}

          {/* Render 27 Memory Cards */}
          {memories.map((m, i) => (
            <MemoryCard
              key={m.id}
              memory={m}
              index={i}
              customPhoto={customPhotos[m.id]}
              onOpen={setActiveIdx}
              onUpload={handleUpload}
            />
          ))}

          {/* End of tree — Glowing Heart */}
          <div className="flex justify-center mt-12 mb-6">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                background: "radial-gradient(circle, rgba(232,121,168,0.35), transparent)",
                border: "1px solid rgba(232,121,168,0.5)",
                boxShadow: "0 0 30px rgba(232,121,168,0.4)",
                animation: "heartBeat 2s ease-in-out infinite",
                fontSize: "2rem",
              }}
            >
              ❤️
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX (PURE PHOTO VIEW WITHOUT ANY TITLE) */}
      {activeIdx !== null && activeMemory && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(5,5,8,0.94)", zIndex: 70, backdropFilter: "blur(16px)" }}
          onClick={() => setActiveIdx(null)}
        >
          <input
            ref={modalFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleModalFileUpload}
          />

          {/* Lightbox Container */}
          <div
            className="relative flex flex-col items-center max-w-4xl w-full"
            style={{ animation: "fadeInScale 0.3s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Counter & Actions */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <span
                  className="font-cinzel text-xs md:text-sm tracking-widest px-4 py-1.5 rounded-full"
                  style={{
                    background: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    color: "#d4af37",
                    boxShadow: "0 0 15px rgba(212,175,55,0.2)",
                  }}
                >
                  ✦ PHOTO {String(activeMemory.id).padStart(2, "0")} / 27 ✦
                </span>

                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  className="px-3 py-1 rounded-full text-xs font-cinzel transition-all hover:scale-105"
                  style={{
                    background: "rgba(232,121,168,0.15)",
                    border: "1px solid rgba(232,121,168,0.4)",
                    color: "#e879a8",
                  }}
                  title="Upload / replace photo for this slot"
                >
                  📷 Change Photo
                </button>
              </div>

              <button
                onClick={() => setActiveIdx(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center font-cinzel text-base transition-all hover:scale-110"
                style={{
                  background: "rgba(5,5,8,0.8)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                }}
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Photo Card View */}
            <div
              className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                maxHeight: "78vh",
                background: "rgba(12,9,18,0.8)",
                border: "1.5px solid rgba(212,175,55,0.4)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.25)",
              }}
            >
              <img
                key={activePhotoSrc}
                src={activePhotoSrc}
                alt={`Photo ${activeMemory.id}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />

              {/* Navigation Arrows on Photo */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : memories.length - 1))
                }}
                className="absolute left-3 md:left-5 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
                style={{
                  background: "rgba(5,5,8,0.75)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                  backdropFilter: "blur(10px)",
                }}
                title="Previous photo (←)"
              >
                ◀
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIdx((prev) => (prev !== null && prev < memories.length - 1 ? prev + 1 : 0))
                }}
                className="absolute right-3 md:right-5 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
                style={{
                  background: "rgba(5,5,8,0.75)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                  backdropFilter: "blur(10px)",
                }}
                title="Next photo (→)"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
