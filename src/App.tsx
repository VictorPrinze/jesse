import ParticleBackground from './components/ParticleBackground'
import Hero from './components/Hero'
import EventDetails from './components/EventDetails'
import PhotoGallery from './components/PhotoGallery'
import WhatToExpect from './components/WhatToExpect'
import MapSection from './components/MapSection'
import RSVPSection from './components/RSVPSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-obsidian overflow-x-hidden">
      {/* Fixed bokeh particle canvas */}
      <ParticleBackground />

      {/* Page content */}
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
