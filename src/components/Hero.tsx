import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from './CountdownTimer'

const NAME = 'Jesse'
const COLORS = ['#c9a84c','#e879f9','#60a5fa','#34d399','#fb923c']
const floatingWords = ['🎂', '🥂', '✨', '🎊', '🎶', '💛']

export default function Hero() {
  const [lettersVisible, setLettersVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [autoColorIndex, setAutoColorIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLettersVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Detect touch device
  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Auto-cycle colors on mobile
  useEffect(() => {
    if (!isMobile) return
    const interval = setInterval(() => {
      setAutoColorIndex(i => (i + 1) % COLORS.length)
    }, 800)
    return () => clearInterval(interval)
  }, [isMobile])

  const getLetterColor = (i: number) => {
    if (isMobile) {
      // Each letter offset by one step in the cycle for a wave effect
      return COLORS[(autoColorIndex + i) % COLORS.length]
    }
    return hovered ? COLORS[i % COLORS.length] : '#f0e6d3'
  }

  const scrollDown = () =>
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden"
    >
      {/* Colourful radial blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,80,200,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '60%',
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,160,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Floating emoji confetti */}
      {floatingWords.map((w, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 16}%`,
            top: `${15 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, i % 2 === 0 ? 12 : -12, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        >
          {w}
        </motion.span>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* YOU'RE INVITED */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          transition={{ duration: 1.2, delay: 0.1 }}
        >
          <h2
            className="text-gold-shimmer font-playfair font-black tracking-[0.2em] leading-none"
            style={{ fontSize: 'clamp(1.4rem, 5vw, 4.5rem)' }}
          >
            YOU'RE INVITED
          </h2>
        </motion.div>

        {/* Jesse name */}
        <h1
          className="font-playfair italic font-bold leading-none"
          style={{ fontSize: 'clamp(4.5rem, 16vw, 12rem)', color: '#f0e6d3' }}
          aria-label={NAME}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
        >
          {[...NAME].map((char, i) => (
            <motion.span
              key={i}
              className="inline-block cursor-default"
              animate={{
                color: getLetterColor(i),
                textShadow: (hovered || isMobile)
                  ? `0 0 40px ${getLetterColor(i)}`
                  : 'none',
              }}
              transition={{ duration: 0.4 }}
              style={{
                opacity: lettersVisible ? 1 : 0,
                transform: lettersVisible ? 'translateY(0) rotate(0deg)' : 'translateY(80px) rotate(5deg)',
                transition: `opacity 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 140 + 100}ms,
                             transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 140 + 100}ms`,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Turning 26 badge */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="relative w-32 h-32 flex items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.15), rgba(180,80,200,0.08))',
            border: '1px solid rgba(201,168,76,0.6)',
            boxShadow: '0 0 30px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.05)',
          }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="flex flex-col items-center"
          >
            <span className="font-playfair font-black text-gold leading-none" style={{ fontSize: '3rem' }}>26</span>
            <span className="font-mono text-[0.55rem] tracking-[0.2em] text-gold uppercase">Turning</span>
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-10px] rounded-full"
            style={{ border: '1px dashed rgba(201,168,76,0.25)' }}
          />
        </motion.div>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-1"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(201,168,76,0.7)' }}>
            Tuesday · 26th May 2026 · 6 PM
          </p>
          <p className="font-cormorant italic text-xl" style={{ color: 'rgba(240,230,211,0.5)' }}>
            34 W Sunniside, Sunderland
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-2 px-8 py-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(201,168,76,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA scroll */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={scrollDown}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2 px-8 py-3 rounded-full font-mono text-sm tracking-widest transition-all"
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #e879f9)',
            color: '#0a0a0a',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(201,168,76,0.3)',
          }}
        >
          See the details ↓
        </motion.button>
      </div>

      {/* Scroll chevrons */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-60 transition-opacity"
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