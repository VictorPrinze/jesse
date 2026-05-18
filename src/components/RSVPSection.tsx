import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://otvtxkaojtsyonnyzfnk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mv6z4uMeRYAh3YAZyfixCw_0i14zXku'
const MAX_ATTENDANCE = 50
const PHONE_DISPLAY = '+44 7777 386639'
const PHONE_RAW = '+447777386639'

const supabase = createClient( SUPABASE_URL, SUPABASE_ANON_KEY )

async function sbFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation',
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json().catch(() => null)
}

export default function RSVPSection() {
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  
useEffect(() => {
  // Initial fetch
  const fetchCount = async () => {
    const data = await sbFetch('rsvps?select=id')
    setCount(Array.isArray(data) ? data.length : 0)
  }

  fetchCount()

  // Realtime subscription
  const channel = supabase
    .channel('rsvp-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rsvps',
      },
      async () => {
        const data = await sbFetch('rsvps?select=id')
        setCount(Array.isArray(data) ? data.length : 0)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])


  
  

  const spotsLeft = count !== null ? MAX_ATTENDANCE - count : null
  const isFull = spotsLeft !== null && spotsLeft <= 0
  const isLow = spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0

  const handleComing = async () => {
    if (confirmed || isFull || loading) return
    if (!name.trim()) { setError('Please enter your name first!'); return }
    setError('')
    setLoading(true)

    try {
      const latest = await sbFetch('rsvps?select=id')
      const currentCount = Array.isArray(latest) ? latest.length : 0
      if (currentCount >= MAX_ATTENDANCE) {
        setCount(currentCount)
        setError("Sorry, we're fully booked! 😢")
        setLoading(false)
        return
      }

      await sbFetch('rsvps', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), attending: true }),
      })

      setCount(c => (c ?? 0) + 1)
      setConfirmed(true)

      const myConfetti = confetti.create(canvasRef.current ?? undefined, { resize: true, useWorker: true })
      myConfetti({ particleCount: 250, spread: 120, origin: { y: 0.6 }, colors: ['#c9a84c','#f0e6d3','#e879f9','#60a5fa','#34d399','#fb923c','#ffffff'] })
      setTimeout(() => myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.5 }, colors: ['#c9a84c','#e879f9','#60a5fa'] }), 700)
    } catch {
      setError('Something went wrong. Try WhatsApp instead!')
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(PHONE_RAW) } catch {
      const ta = document.createElement('textarea')
      ta.value = PHONE_RAW
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const pct = count !== null ? Math.min((count / MAX_ATTENDANCE) * 100, 100) : 0

  return (
    <section id="rsvp" className="relative z-10" style={{
      background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, rgba(232,121,249,0.04) 50%, transparent 70%)'
    }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" />

      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair italic font-bold text-cream leading-tight mb-3"
          style={{ fontSize: 'clamp(2.5rem,8vw,5.5rem)' }}
        >
          Will You<br />Be There?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="font-cormorant italic text-cream/55 text-xl mb-8"
        >
          Jesse's 26th awaits — don't miss a moment.
        </motion.p>

        {/* Capacity tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-8 rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[0.65rem] tracking-widest text-gold uppercase">Spots Taken</span>
            <span className="font-mono text-[0.65rem] tracking-widest text-cream/50">
              {count !== null ? count : '…'} / {MAX_ATTENDANCE}
            </span>
          </div>

          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
              className="h-full rounded-full"
              style={{
                background: isFull
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : isLow
                  ? 'linear-gradient(90deg, #fb923c, #f97316)'
                  : 'linear-gradient(90deg, #c9a84c, #e879f9)',
              }}
            />
          </div>

          <p className="font-cormorant italic text-lg" style={{
            color: isFull ? '#ef4444' : isLow ? '#fb923c' : 'rgba(240,230,211,0.6)'
          }}>
            {isFull
              ? "We're fully booked! 😢 WhatsApp Jesse to join the waitlist."
              : isLow
              ? `🔥 Only ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left — grab yours!`
              : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} remaining — don't wait!`}
          </p>
        </motion.div>

        {/* Name input */}
        {!confirmed && !isFull && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mb-5"
          >
            <input
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleComing()}
              className="w-full px-5 py-3 rounded-xl font-cormorant text-lg text-cream placeholder-cream/30 outline-none focus:ring-1 focus:ring-gold transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: error ? '1px solid #ef4444' : '1px solid rgba(201,168,76,0.3)',
              }}
              maxLength={60}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[0.7rem] tracking-wide mt-2"
                  style={{ color: '#ef4444' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          {!isFull && (
            <motion.button
              onClick={handleComing}
              whileHover={!confirmed && !loading ? { scale: 1.05, boxShadow: '0 16px 48px rgba(201,168,76,0.5)' } : {}}
              whileTap={!confirmed && !loading ? { scale: 0.97 } : {}}
              disabled={loading}
              className="px-10 py-4 rounded-full font-mono text-sm tracking-widest font-semibold transition-all"
              style={confirmed
                ? { background: 'rgba(26,58,26,0.8)', color: '#4ade80', border: '1px solid #4ade80', cursor: 'default' }
                : { background: 'linear-gradient(135deg, #c9a84c, #e879f9, #60a5fa)', color: '#0a0a0a', border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }
              }
            >
              {loading ? '⏳ Saving...' : confirmed ? "🥂 You're on the list!" : "✅ I'm Coming!"}
            </motion.button>
          )}

          <motion.a
            href={`https://wa.me/${PHONE_RAW}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ borderColor: '#25d366', color: '#25d366', boxShadow: '0 0 20px rgba(37,211,102,0.2)' }}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full border font-mono text-sm tracking-widest text-cream transition-all"
            style={{ border: '1px solid rgba(240,230,211,0.3)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp Jesse
          </motion.a>
        </div>

        <AnimatePresence>
          {confirmed && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 18 }}
              className="mb-8 p-4 rounded-xl"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              <p
                className="font-playfair italic text-2xl"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                See you there, {name}! 🥂
              </p>
              <p className="font-mono text-[0.65rem] tracking-widest text-cream/40 mt-2 uppercase">
                Jesse has been notified via Supabase
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px w-20 bg-gold/30 mx-auto mb-8" />

        <p className="font-mono text-[0.65rem] tracking-[0.2em] text-gold uppercase mb-3">RSVP Directly</p>
        <div
          className="inline-flex items-center gap-4 px-6 py-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <span className="font-mono text-cream text-lg tracking-wider">{PHONE_DISPLAY}</span>
          <button
            onClick={handleCopy}
            className="text-gold hover:scale-110 active:scale-95 transition-transform text-lg"
            aria-label="Copy phone number"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? 'check' : 'copy'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {copied ? '✅' : '📋'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Admin link */}
        <div className="mt-8">
          <a
            href="/admin"
            className="font-mono text-[0.6rem] tracking-widest text-cream/20 hover:text-cream/40 transition-colors"
          >
            admin ›
          </a>
        </div>
      </div>
    </section>
  )
}