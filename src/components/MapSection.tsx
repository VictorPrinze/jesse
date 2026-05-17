import { motion } from 'framer-motion'

const MAPS_EMBED =
  'https://www.google.com/maps?q=34+W+Sunniside,+Sunderland+SR1+1BU&output=embed'
const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=34+W+Sunniside,+Sunderland+SR1+1BU'

export default function MapSection() {
  return (
    <section id="map" className="relative z-10" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-playfair text-cream text-center"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Find Us
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="gold-divider"
        >
          <div className="w-[6px] h-[6px] bg-gold rotate-45" />
        </motion.div>

        {/* Map wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              border: '1px solid #c9a84c',
              boxShadow:
                '0 0 60px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <iframe
              src={MAPS_EMBED}
              title="Party venue — 34 W Sunniside, Sunderland"
              width="100%"
              height="380"
              style={{
                border: 0,
                display: 'block',
                filter: 'grayscale(15%) contrast(1.08) brightness(0.9)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Address + directions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-gold uppercase mb-1">
                Venue Address
              </p>
              <p className="font-cormorant text-cream text-lg">
                34 W Sunniside, Sunniside, Sunderland SR1 1BU
              </p>
            </div>

            <a
              href={MAPS_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-gold text-gold font-mono text-sm tracking-widest hover:bg-gold hover:text-obsidian transition-all duration-300 whitespace-nowrap"
            >
              <span>📍</span>
              Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
