import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Library from './components/Library'
import AdminPanel from './components/AdminPanel'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)

  // Admin shortcut listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl + Shift + A for admin panel
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setAdminPanelOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary via-secondary to-primary overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradients */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/30 to-blue-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-blue-600/30 to-accent/30 rounded-full blur-3xl"
        />
      </div>

      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar
          onCategoryFilter={setActiveCategory}
          activeCategory={activeCategory}
        />

        <Library
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
      />

      {/* Hidden Admin Indicator (for development) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className="fixed bottom-4 right-4 text-xs text-gray-600 font-mono pointer-events-none"
      >
        Admin: Ctrl + Shift + A
      </motion.div>
    </div>
  )
}

export default App
