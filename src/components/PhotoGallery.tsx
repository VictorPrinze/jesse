import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import photo1 from '../assets/photos/photo1.jpg'
import photo2 from '../assets/photos/photo2.jpg'
import photo3 from '../assets/photos/photo3.jpg'
import photo4 from '../assets/photos/photo4.jpg'
import photo5 from '../assets/photos/photo5.jpg'
import photo6 from '../assets/photos/photo6.jpg'

const photos = [
  { id: 1, src: photo1, caption: 'Good times', colSpan: true },
  { id: 2, src: photo2, caption: 'The crew' },
  { id: 3, src: photo5, caption: 'Vibes only', rowSpan: true },
  { id: 4, src: photo4, caption: 'Cheers 🥂' },
  { id: 5, src: photo3, caption: 'Good music' },
  { id: 6, src: photo6, caption: 'Memories' },
]

const glows = [
  'rgba(201,168,76,0.4)',
  'rgba(96,165,250,0.4)',
  'rgba(232,121,249,0.4)',
  'rgba(52,211,153,0.4)',
  'rgba(251,146,60,0.4)',
  'rgba(248,113,113,0.4)',
]

export default function PhotoGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [zoomed, setZoomed] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [likeAnim, setLikeAnim] = useState<Record<number, boolean>>({})

  const current = lightboxIndex !== null ? photos[lightboxIndex] : null

  const prev = useCallback(() => {
    setZoomed(false)
    setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [])

  const next = useCallback(() => {
    setZoomed(false)
    setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : null))
  }, [])

  const close = useCallback(() => {
    setLightboxIndex(null)
    setZoomed(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape') close()
      if (e.key === 'z' || e.key === 'Z') setZoomed(z => !z)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, next, prev, close])

  // Like toggle
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
    setLikeAnim(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setLikeAnim(prev => ({ ...prev, [id]: false })), 600)
  }

  return (
    <section id="gallery" className="relative z-10" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6 py-24">

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-playfair text-cream text-center"
          style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}
        >
          Moments &amp; Memories
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="gold-divider mb-10"
        >
          <div className="w-[6px] h-[6px] bg-gold rotate-45" />
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center font-mono text-[0.65rem] tracking-widest text-cream/30 uppercase mb-8"
        >
          Click any photo to explore · Arrow keys to navigate · Z to zoom
        </motion.p>

        {/* Asymmetric Grid */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: 'minmax(160px,auto)' }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
              onClick={() => setLightboxIndex(i)}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className="relative overflow-hidden rounded-xl border cursor-pointer group"
              style={{
                gridColumn: photo.colSpan ? 'span 2' : undefined,
                gridRow: photo.rowSpan ? 'span 2' : undefined,
                borderColor: 'rgba(201,168,76,0.2)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = glows[i].replace('0.4', '0.8')
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${glows[i]}`
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}
            >
          <img
  src={photo.src}
  alt={photo.caption}
  loading="lazy"
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  style={{ 
    minHeight: 160,
    objectPosition: photo.rowSpan ? 'center top' : 'center center'
  }}
/>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Caption */}
              <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="font-cormorant italic text-cream text-lg">{photo.caption}</p>
                <p className="font-mono text-[0.6rem] tracking-widest text-cream/50 mt-1">
                  Click to view full
                </p>
              </div>

              {/* Like button */}
              <button
                onClick={e => toggleLike(photo.id, e)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                aria-label="Like photo"
              >
                <motion.span
                  animate={likeAnim[photo.id] ? { scale: [1, 1.6, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: 14 }}
                >
                  {liked[photo.id] ? '❤️' : '🤍'}
                </motion.span>
              </button>

              {/* Index badge */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  className="font-mono text-[0.6rem] tracking-widest px-2 py-1 rounded"
                  style={{ background: 'rgba(0,0,0,0.6)', color: glows[i].replace('0.4','1') }}
                >
                  {i + 1} / {photos.length}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxIndex !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.96)', backdropFilter: 'blur(12px)' }}
            onClick={close}
            // Touch swipe
            onPointerDown={e => setDragStart(e.clientX)}
            onPointerUp={e => {
              if (dragStart === null) return
              const diff = e.clientX - dragStart
              if (diff > 60) prev()
              else if (diff < -60) next()
              setDragStart(null)
            }}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream text-xl font-light transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >×</button>

            {/* Counter */}
            <div className="absolute top-5 left-5 z-10">
              <span className="font-mono text-[0.7rem] tracking-widest text-cream/50">
                {lightboxIndex + 1} / {photos.length}
              </span>
            </div>

            {/* Keyboard hint */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-4">
              <span className="font-mono text-[0.6rem] tracking-widest text-cream/25">← → navigate</span>
              <span className="font-mono text-[0.6rem] tracking-widest text-cream/25">Z zoom</span>
              <span className="font-mono text-[0.6rem] tracking-widest text-cream/25">ESC close</span>
            </div>

            {/* Prev button */}
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center text-cream transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center text-cream transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Main image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full mx-16 rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${glows[lightboxIndex]}`,
                boxShadow: `0 0 80px ${glows[lightboxIndex]}, 0 40px 80px rgba(0,0,0,0.6)`,
              }}
            >
              <motion.img
                src={current.src}
                alt={current.caption}
                className="w-full block"
                animate={{ scale: zoomed ? 1.6 : 1 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={e => { e.stopPropagation(); setZoomed(z => !z) }}
                style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in', transformOrigin: 'center' }}
              />

              {/* Caption bar */}
              <div
                className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
              >
                <div>
                  <p className="font-cormorant italic text-cream text-xl">{current.caption}</p>
                  <p className="font-mono text-[0.6rem] tracking-widest mt-1" style={{ color: glows[lightboxIndex].replace('0.4','0.7') }}>
                    photo{current.id}.jpg
                  </p>
                </div>
                <button
                  onClick={e => toggleLike(current.id, e)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <motion.span
                    animate={likeAnim[current.id] ? { scale: [1, 1.8, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: 18 }}
                  >
                    {liked[current.id] ? '❤️' : '🤍'}
                  </motion.span>
                </button>
              </div>

              {/* Zoom hint */}
              {zoomed && (
                <div className="absolute top-4 left-4">
                  <span
                    className="font-mono text-[0.6rem] tracking-widest px-2 py-1 rounded"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#c9a84c' }}
                  >
                    Click to zoom out
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={e => { e.stopPropagation(); setLightboxIndex(i); setZoomed(false) }}
                  className="rounded-lg overflow-hidden transition-all hover:scale-110"
                  style={{
                    width: 44,
                    height: 44,
                    border: i === lightboxIndex
                      ? `2px solid ${glows[i].replace('0.4','1')}`
                      : '2px solid rgba(255,255,255,0.1)',
                    boxShadow: i === lightboxIndex ? `0 0 12px ${glows[i]}` : 'none',
                    opacity: i === lightboxIndex ? 1 : 0.45,
                  }}
                >
                  <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}