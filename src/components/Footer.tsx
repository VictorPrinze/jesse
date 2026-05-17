import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer
      className="relative z-10 text-center py-12 px-6"
      style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="font-mono text-[0.72rem] tracking-[0.22em] text-cream/35 uppercase">
          Jesse's 26th · May 26 2026 · Sunderland
        </p>

        <div className="flex items-center gap-3 text-gold/50 text-sm">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

        <p className="font-cormorant italic text-cream/25 text-lg">
          No dull vibes allowed 🔥
        </p>
      </motion.div>
    </footer>
  )
}
