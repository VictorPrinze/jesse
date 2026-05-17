import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const PHONE_DISPLAY = '+44 7777 386639'
const PHONE_RAW = '+447777386639'
const WHATSAPP_URL = `https://wa.me/447777386639`

export default function RSVPSection() {
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleComing = () => {
    if (confirmed) return
    setConfirmed(true)

    // Gold confetti burst
    const myConfetti = confetti.create(canvasRef.current ?? undefined, {
      resize: true,
      useWorker: true,
    })

    myConfetti({
      particleCount: 220,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#c9a84c', '#f0e6d3', '#ffffff', '#e8c97a', '#7a5a1e', '#ffd700'],
      gravity: 0.9,
    })

    setTimeout(() => {
      myConfetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.5 },
        colors: ['#c9a84c', '#f0e6d3'],
        gravity: 1.1,
      })
    }, 600)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_RAW)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = PHONE_RAW
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <section
      id="rsvp"
      className="relative z-10"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)',
      }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-playfair italic font-bold text-cream leading-tight mb-3"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}
        >
          Will You<br />Be There?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="font-cormorant italic text-cream/55 text-xl mb-10"
        >
          Jesse's 26th awaits — don't miss a moment.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            onClick={handleComing}
            whileHover={!confirmed ? { y: -3, boxShadow: '0 14px 36px rgba(201,168,76,0.4)' } : {}}
            whileTap={!confirmed ? { scale: 0.97 } : {}}
            className="px-10 py-4 rounded font-mono text-sm tracking-widest transition-all duration-300"
            style={
              confirmed
                ? {
                    background: 'rgba(26,58,26,0.8)',
                    color: '#4ade80',
                    border: '1px solid #4ade80',
                    cursor: 'default',
                  }
                : {
                    background: '#c9a84c',
                    color: '#0a0a0a',
                    border: 'none',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }
            }
          >
            {confirmed ? "🥂 You're on the list!" : "✅ I'm Coming!"}
          </motion.button>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ borderColor: '#f0e6d3', background: 'rgba(240,230,211,0.05)' }}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded border font-mono text-sm tracking-widest text-cream transition-all duration-300"
            style={{ border: '1px solid rgba(240,230,211,0.28)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp Jesse
          </motion.a>
        </motion.div>

        {/* Confirmation message */}
        <AnimatePresence>
          {confirmed && (
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="font-playfair italic text-gold text-2xl mb-8"
            >
              See you there! 🥂
            </motion.p>
          )}
        </AnimatePresence>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-px w-24 bg-gold/30 mx-auto mb-8"
        />

        {/* RSVP contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-[0.65rem] tracking-[0.2em] text-gold uppercase mb-3">
            RSVP Directly
          </p>

          <div
            className="inline-flex items-center gap-4 px-6 py-4 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.3)',
            }}
          >
            <span className="font-mono text-cream text-lg tracking-wider">
              {PHONE_DISPLAY}
            </span>

            <button
              onClick={handleCopy}
              title="Copy number"
              className="text-gold hover:text-gold-light transition-colors p-1 hover:scale-110 active:scale-95 transition-transform"
              aria-label="Copy phone number"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-lg"
                  >
                    ✅
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-lg"
                  >
                    📋
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
