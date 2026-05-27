import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const BookCard = ({ book, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 20
    const y = (e.clientX - rect.left - rect.width / 2) / 20
    setRotation({ x, y })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, z: 100 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-96 cursor-pointer perspective"
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : 'rotateX(0deg) rotateY(0deg)',
      }}
    >
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden glass smooth ${
          isHovered ? 'glow-accent' : ''
        }`}
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(124, 58, 237, 0.5), inset 0 1px 0 0 rgba(255,255,255,0.1)`
            : `0 10px 30px -15px rgba(0, 0, 0, 0.3)`,
          transform: `translateZ(50px)`,
        }}
      >
        {/* Background Image */}
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold mb-2 line-clamp-2"
          >
            {book.title}
          </motion.h3>

          {/* Author & Category */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between"
          >
            <span className="text-sm text-gray-300">{book.author}</span>
            <span className="px-3 py-1 bg-accent/40 text-accent text-xs rounded-full font-semibold">
              {book.category}
            </span>
          </motion.div>
        </div>

        {/* Read Button - appears on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-accent/90 text-white rounded-lg font-semibold hover:bg-accent smooth"
          >
            <BookOpen size={20} />
            Read Now
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BookCard
