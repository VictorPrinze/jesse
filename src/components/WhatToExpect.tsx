import { motion } from 'framer-motion'

interface Tile {
  icon: string
  title: string
  desc: string
  delay: number
}

const tiles: Tile[] = [
  {
    icon: '🎶',
    title: 'Music & Vibes',
    desc: 'All night energy. Right tracks, right crowd.',
    delay: 0,
  },
  {
    icon: '🍹',
    title: 'Drinks & Food',
    desc: 'Come hungry. Leave satisfied. Repeat.',
    delay: 0.1,
  },
  {
    icon: '📸',
    title: 'Memories',
    desc: "Moments that'll live long after the night.",
    delay: 0.2,
  },
  {
    icon: '🥳',
    title: 'Celebrations',
    desc: '26 years of Jesse. Crowned in style.',
    delay: 0.3,
  },
]

export default function WhatToExpect() {
  return (
    <section id="expect" className="relative z-10">
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
          What to Expect
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

        {/* Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: tile.delay }}
              className="relative overflow-hidden rounded-xl p-8 text-center cursor-default group"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              {/* Animated border glow on hover via pseudo-element workaround */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(201,168,76,0.1), 0 0 40px rgba(201,168,76,0.15)',
                }}
              />

              {/* Subtle top radial */}
              <div
                className="absolute top-0 inset-x-0 h-24 opacity-20 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at top, rgba(201,168,76,0.4), transparent)',
                }}
              />

              <motion.span
                className="text-4xl block mb-4"
                whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                {tile.icon}
              </motion.span>

              <h3 className="font-playfair text-cream text-lg mb-2 leading-snug">
                {tile.title}
              </h3>

              <p className="font-cormorant italic text-cream/55 text-base leading-relaxed">
                {tile.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
