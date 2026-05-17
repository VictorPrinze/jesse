import { motion } from 'framer-motion'

interface DetailCard {
  icon: string
  label: string
  value: string[]
  sparkle?: boolean
  delay: number
}

const cards: DetailCard[] = [
  {
    icon: '📅',
    label: 'Date',
    value: ['Tuesday', '26th May 2026'],
    delay: 0,
  },
  {
    icon: '⏰',
    label: 'Time',
    value: ['6:00 PM', 'Till Late'],
    delay: 0.1,
  },
  {
    icon: '📍',
    label: 'Venue',
    value: ['34 W Sunniside', 'Sunderland SR1 1BU'],
    delay: 0.2,
  },
  {
    icon: '👔',
    label: 'Dress Code',
    value: ['Dress to', 'Impress'],
    sparkle: true,
    delay: 0.3,
  },
]

export default function EventDetails() {
  return (
    <section id="details" className="relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-playfair text-cream text-center"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          The Details
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              whileHover={{
                borderColor: '#c9a84c',
                boxShadow: '0 0 30px rgba(201,168,76,0.2)',
              }}
              className={`glass-card p-7 relative overflow-hidden cursor-default ${
                card.sparkle ? 'sparkle-text' : ''
              }`}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-12 h-12 opacity-10"
                style={{
                  background:
                    'radial-gradient(circle at top right, #c9a84c, transparent)',
                }}
              />

              <div className="text-3xl mb-4">{card.icon}</div>

              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-gold uppercase mb-2">
                {card.label}
              </p>

              <div className="font-playfair text-cream text-lg leading-snug">
                {card.value.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < card.value.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
