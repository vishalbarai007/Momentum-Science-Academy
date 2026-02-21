"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Aryan Mehta",
    score: "AIR 329 – JEE Advanced",
    program: "JEE Main & Advanced",
    review:
      "Momentum's structured approach and dedicated faculty completely transformed my preparation. The small batch size meant I always got personal attention when I needed it most.",
    rating: 5,
    initials: "raj-cet",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Sneha Patil",
    score: "645/720 – NEET",
    program: "NEET Preparation",
    review:
      "The doubt-clearing sessions at Momentum were a game changer. Teachers never made you feel rushed, and the mock test series was exactly like the real exam. I couldn't have done it without them.",
    rating: 5,
    initials: "ritwik-cet",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Rahul Sharma",
    score: "99.4 Percentile – MHT-CET",
    program: "MHT-CET Prep",
    review:
      "The quality of study material and the way concepts were broken down made even the hardest topics easy to grasp. Momentum is genuinely invested in every student's success.",
    rating: 5,
    initials: "vasu-neet",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Karan Desai",
    score: "IIT Bombay – CSE",
    program: "JEE Main & Advanced",
    review:
      "Three years at Momentum built my analytical thinking from the ground up. The teachers treat you like family and push you to be better every single day.",
    rating: 5,
    initials: "vishal-cet",
    color: "from-blue-500 to-indigo-600",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback(
    (next: number, dir: "left" | "right") => {
      if (isAnimating) return
      setDirection(dir)
      setIsAnimating(true)
      setTimeout(() => {
        setCurrent(next)
        setIsAnimating(false)
      }, 350)
    },
    [isAnimating]
  )

  const prev = useCallback(() => {
    const next = (current - 1 + testimonials.length) % testimonials.length
    go(next, "left")
  }, [current, go])

  const next = useCallback(() => {
    const nextIdx = (current + 1) % testimonials.length
    go(nextIdx, "right")
  }, [current, go])

  // Auto-play
  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [next, isPaused])

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
    touchEndX.current = null
  }

  const t = testimonials[current]

  return (
    <section
      className="relative py-24 overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
      onMouseEnter={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span>Student Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            What Our Students Say
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Real results from real students — their words, not ours.
          </p>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Card */}
          <div
            key={current}
            className="relative bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 md:p-12 shadow-2xl"
            style={{
              animation: isAnimating
                ? "none"
                : `slideIn${direction === "right" ? "Right" : "Left"} 0.4s cubic-bezier(0.22,1,0.36,1) both`,
            }}
          >
            {/* Large quote mark */}
            <div className="absolute top-8 right-8 md:top-10 md:right-12 opacity-10">
              <Quote className="w-20 h-20 md:w-28 md:h-28 fill-white text-white" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="shrink-0">
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl ring-4 ring-white/20`}
                >
                  {/* {t.initials} */}
                  <Image src={`/Rankers/${t.initials}.png`} alt={t.name} width={96} height={96} className="w-full h-full object-cover rounded-2xl" />

                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-300 text-yellow-300"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-white mb-6">
                  "{t.review}"
                </blockquote>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>
                    <div className="font-bold text-lg">{t.name}</div>
                    <div className="text-primary-foreground/60 text-sm">{t.program}</div>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/20" />
                  <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    {t.score}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow buttons — float on the sides (desktop) / below (mobile) */}
          <div className="flex items-center justify-between mt-8 gap-4">
            {/* Dots */}
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > current ? "right" : "left")}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2.5 bg-white"
                      : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            key={`${current}-${isPaused}`}
            className="h-full bg-white/50 rounded-full"
            style={{
              animation: isPaused ? "none" : "progress 5s linear forwards",
              width: isPaused ? "0%" : undefined,
            }}
          />
        </div>
      </div>

      {/* Keyframe animations via a style tag */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(48px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-48px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}

// Trophy icon inline (already imported in your project via lucide-react)
function Trophy({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}