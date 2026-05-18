import { useEffect, useState } from 'react'
import ParticleBackground from './components/ParticleBackground'
import Hero from './components/Hero'
import EventDetails from './components/EventDetails'
import PhotoGallery from './components/PhotoGallery'
import WhatToExpect from './components/WhatToExpect'
import MapSection from './components/MapSection'
import RSVPSection from './components/RSVPSection'
import Footer from './components/Footer'
import Admin from './pages/Admin'

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(window.location.pathname === '/admin')
  }, [])

  if (isAdmin) return <Admin />

  return (
    <div className="relative min-h-screen bg-obsidian overflow-x-hidden">
      <ParticleBackground />
      <main className="relative z-10">
        <Hero />
        <EventDetails />
        <PhotoGallery />
        <WhatToExpect />
        <MapSection />
        <RSVPSection />
        <Footer />
      </main>
    </div>
  )
}