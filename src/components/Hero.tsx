import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountdownTimer from './CountdownTimer'

import img1 from '../assets/photos/image1.jpeg'
import img2 from '../assets/photos/image2.jpeg'

const NAME = "Jesse's"
const COLORS = ['#c9a84c','#e879f9','#60a5fa','#34d399','#fb923c']
const floatingWords = ['🎂', '🥂', '✨', '🎊', '🎶', '💛']

export default function Hero() {
  const [lettersVisible, setLettersVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [autoColorIndex, setAutoColorIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setLettersVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => setAutoColorIndex(i => (i + 1) % COLORS.length), 800)
    return () => clearInterval(interval)
  }, [isMobile])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Device tilt for mobile parallax
  useEffect(() => {
    if (!isMobile) return
    const handler = (e: DeviceOrientationEvent) => {
      const x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 20))
      const y = Math.max(-1, Math.min(1, (e.beta ?? 0) / 30))
      setTilt({ x, y })
    }
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [isMobile])

  const getLetterColor = (i: number) => {
    if (isMobile) return COLORS[(autoColorIndex + i) % COLORS.length]
    return hovered ? COLORS[i % COLORS.length] : '#f0e6d3'
  }

  const scrollDown = () =>
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })

  const img1X = isMobile ? tilt.x * 15 : (mousePos.x - 0.5) * -30
  const img1Y = isMobile ? tilt.y * 10 : (mousePos.y - 0.5) * -20
  const img2X = isMobile ? tilt.x * -15 : (mousePos.x - 0.5) * 25
  const img2Y = isMobile ? tilt.y * -10 : (mousePos.y - 0.5) * 15

  const mobileCards = [
    { src: img1, label: '🎉 Jesse', color: 'rgba(201,168,76,0.5)', glow: 'rgba(201,168,76,0.3)' },
    { src: img2, label: '🕯️ Vibes', color: 'rgba(232,121,249,0.5)', glow: 'rgba(232,121,249,0.3)' },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={img2}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          style={{ filter: 'blur(2px) brightness(0.25) saturate(1.4)' }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)'
        }} />
      </div>

      {/* ── DESKTOP: floating image cards (parallax) ── */}
      <motion.div
        className="absolute z-10 rounded-2xl overflow-hidden shadow-2xl hidden md:block"
        style={{
          width: 160, bottom: '18%', left: '5%',
          border: '1px solid rgba(201,168,76,0.4)',
          boxShadow: '0 0 40px rgba(201,168,76,0.2)',
          transform: `translate(${img1X}px, ${img1Y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        animate={{ y: [0, -12, 0], rotate: [-3, 1, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img src={img1} alt="Jesse" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(201,168,76,0.3), transparent)' }} />
      </motion.div>

      <motion.div
        className="absolute z-10 rounded-2xl overflow-hidden shadow-2xl hidden md:block"
        style={{
          width: 140, top: '12%', right: '6%',
          border: '1px solid rgba(232,121,249,0.4)',
          boxShadow: '0 0 40px rgba(232,121,249,0.2)',
          transform: `translate(${img2X}px, ${img2Y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
        animate={{ y: [0, 14, 0], rotate: [2, -2, 2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <img src={img2} alt="Candle" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))' }} />
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at 50% 20%, rgba(255,200,50,0.5), transparent 60%)' }}
        />
      </motion.div>

      {/* ── MOBILE: interactive swipeable photo cards ── */}
      <div className="flex md:hidden gap-3 absolute top-6 left-0 right-0 px-5 z-10 justify-between">
        {mobileCards.map((card, idx) => (
          <motion.div
            key={idx}
            className="relative rounded-2xl overflow-hidden flex-1 cursor-pointer"
            style={{
              height: 110,
              border: `1px solid ${card.color}`,
              boxShadow: activeCard === idx ? `0 0 30px ${card.glow}, 0 8px 32px rgba(0,0,0,0.5)` : `0 0 12px ${card.glow}`,
              transform: `translate(${idx === 0 ? img1X : img2X}px, ${idx === 0 ? img1Y * 0.5 : img2Y * 0.5}px)`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s',
            }}
            animate={{
              y: activeCard === idx ? -8 : [0, idx === 0 ? -6 : 6, 0],
              rotate: activeCard === idx ? 0 : [idx === 0 ? -2 : 2, idx === 0 ? 1 : -1, idx === 0 ? -2 : 2],
              scale: activeCard === idx ? 1.06 : 1,
            }}
            transition={activeCard === idx
              ? { duration: 0.3 }
              : { duration: 4 + idx, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.8 }
            }
            onTap={() => setActiveCard(activeCard === idx ? null : idx)}
          >
            <img
              src={card.src}
              alt={card.label}
              className="w-full h-full object-cover"
              style={{ opacity: activeCard === idx ? 1 : 0.75, transition: 'opacity 0.3s' }}
            />
            {/* gradient overlay */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)`
            }} />
            {/* label */}
            <motion.div
              className="absolute bottom-0 inset-x-0 px-2 py-2"
              animate={{ opacity: activeCard === idx ? 1 : 0.6 }}
            >
              <p className="font-mono text-[0.6rem] tracking-widest text-white text-center">
                {card.label}
              </p>
            </motion.div>
            {/* tap ripple */}
            <AnimatePresence>
              {activeCard === idx && (
                <motion.div
                  initial={{ opacity: 0.6, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: card.color }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Radial colour blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '10%', left: '15%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '15%', right: '10%',
            width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,140,0,0.25) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Floating emojis */}
      {floatingWords.map((w, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none pointer-events-none z-10"
          style={{ left: `${8 + i * 15}%`, top: `${12 + (i % 3) * 22}%` }}
          animate={{ y: [0, -18, 0], rotate: [0, i % 2 === 0 ? 12 : -12, 0], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        >
          {w}
        </motion.span>
      ))}

      {/* MAIN CONTENT */}
      <div className="relative z-20 flex flex-col items-center gap-5 mt-28 md:mt-0">

        {/* YOU'RE INVITED TO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2
            className="text-gold-shimmer font-playfair font-black tracking-[0.25em] leading-none"
            style={{ fontSize: 'clamp(1rem, 4vw, 3rem)' }}
          >
            YOU'RE INVITED TO
          </h2>
        </motion.div>

        {/* Jesse's */}
        <h1
          className="font-playfair italic font-bold leading-none"
          style={{ fontSize: 'clamp(3.5rem, 14vw, 11rem)', color: '#f0e6d3', lineHeight: 1 }}
          aria-label="Jesse's Birthday"
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
        >
          {[...NAME].map((char, i) => (
            <motion.span
              key={i}
              className="inline-block cursor-default"
              animate={{
                color: getLetterColor(i),
                textShadow: (hovered || isMobile) ? `0 0 50px ${getLetterColor(i)}` : '0 0 0px transparent',
              }}
              transition={{ duration: 0.35 }}
              style={{
                opacity: lettersVisible ? 1 : 0,
                transform: lettersVisible ? 'translateY(0) rotate(0deg)' : 'translateY(80px) rotate(5deg)',
                transition: `opacity 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 120 + 100}ms,
                             transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 120 + 100}ms`,
                display: char === ' ' ? 'inline' : 'inline-block',
              }}
            >
              {char === ' ' ? '\u00a0' : char}
            </motion.span>
          ))}
        </h1>

        {/* Birthday */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9 }}
          className="font-cormorant italic text-cream/80 tracking-widest"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', marginTop: '-0.3em' }}
        >
          Birthday 🎂
        </motion.p>

        {/* Flame divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c)' }} />
          <motion.span
            animate={{ scale: [1, 1.3, 1], filter: ['brightness(1)', 'brightness(1.8)', 'brightness(1)'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl"
          >🕯️</motion.span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #c9a84c, transparent)' }} />
        </motion.div>

        {/* Date/venue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(201,168,76,0.8)' }}>
            Tuesday · 26th May 2026 · 6 PM
          </p>
          <p className="font-cormorant italic text-lg" style={{ color: 'rgba(240,230,211,0.55)' }}>
            34 W Sunniside, Sunderland
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-1 px-8 py-5 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(201,168,76,0.25)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
          onClick={scrollDown}
          whileHover={{ scale: 1.07, boxShadow: '0 16px 48px rgba(201,168,76,0.5)' }}
          whileTap={{ scale: 0.96 }}
          className="mt-1 px-10 py-3 rounded-full font-mono text-sm tracking-widest font-semibold"
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #fb923c, #e879f9)',
            color: '#0a0a0a',
            boxShadow: '0 8px 32px rgba(201,168,76,0.35)',
          }}
        >
          See the details ↓
        </motion.button>

        {/* Mobile tap hint */}
        <motion.p
          className="md:hidden font-mono text-[0.55rem] tracking-widest text-cream/25 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          tap the photos above ↑
        </motion.p>
      </div>

      {/* Scroll chevron */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-60 transition-opacity z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll down"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 8L12 16L20 8" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </section>
  )
}