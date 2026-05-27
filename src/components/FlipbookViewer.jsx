import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX } from 'lucide-react'

const FlipbookViewer = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)

  const pages = book.pages
  const totalPages = pages.length

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFlipping(true)
      if (soundEnabled) playFlipSound()
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true)
      if (soundEnabled) playFlipSound()
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const playFlipSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (e) {
      console.log('Audio context not available')
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextPage()
      if (e.key === 'ArrowLeft') prevPage()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, soundEnabled, totalPages])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full smooth z-10"
        >
          <X size={24} className="text-white" />
        </motion.button>

        {/* Sound toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute top-8 right-20 p-3 bg-white/10 hover:bg-white/20 rounded-full smooth"
        >
          {soundEnabled ? (
            <Volume2 size={24} className="text-white" />
          ) : (
            <VolumeX size={24} className="text-white" />
          )}
        </motion.button>

        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl">
          {/* Book Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="perspective"
          >
            <div className="relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden glass-strong">
              {/* Book Spine Effect */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-white/10 to-black/50 transform -translate-x-1/2" />

              {/* Pages Container */}
              <div className="aspect-video flex items-center justify-center relative">
                {/* Left Page */}
                <motion.div
                  key={`left-${currentPage}`}
                  initial={{ opacity: 0, rotateY: -20, x: -50 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: 20, x: 50 }}
                  transition={{ duration: 0.4 }}
                  className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-br from-white/10 to-white/5 p-8 text-center border-r border-white/10"
                >
                  {currentPage > 0 ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-400 mb-4">Page {currentPage}</h3>
                      <p className="text-lg text-white/80 leading-relaxed line-clamp-10">
                        {pages[currentPage - 1]?.content}
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">📖</div>
                      <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
                      <p className="text-gray-400">by {book.author}</p>
                    </div>
                  )}
                </motion.div>

                {/* Right Page */}
                <motion.div
                  key={`right-${currentPage}`}
                  initial={{ opacity: 0, rotateY: 20, x: 50 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0 }}
                  exit={{ opacity: 0, rotateY: -20, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="w-1/2 h-full flex flex-col justify-center items-center bg-gradient-to-bl from-white/10 to-white/5 p-8 text-center"
                >
                  {currentPage < totalPages - 1 ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-400 mb-4">Page {currentPage + 1}</h3>
                      <p className="text-lg text-white/80 leading-relaxed line-clamp-10">
                        {pages[currentPage]?.content}
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-3xl font-bold mb-2">The End</h2>
                      <p className="text-gray-400">Thank you for reading {book.title}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-black/40 to-black/20 border-t border-white/10">
                {/* Left Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-3 bg-accent/80 hover:bg-accent disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg smooth"
                >
                  <ChevronLeft size={24} />
                </motion.button>

                {/* Page Counter */}
                <div className="text-center">
                  <p className="text-white font-semibold">
                    {currentPage + 1} / {totalPages}
                  </p>
                  <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Right Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-3 bg-accent/80 hover:bg-accent disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg smooth"
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-gray-400 text-sm"
        >
          <p>Use arrow keys to navigate • Press ESC to close</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FlipbookViewer
