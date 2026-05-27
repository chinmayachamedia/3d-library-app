import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Menu, X } from 'lucide-react'

const Navbar = ({ onCategoryFilter, activeCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Tech', 'Fiction', 'Notes']

  const handleCategoryClick = (category) => {
    onCategoryFilter(category)
    setMobileMenuOpen(false)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    // Trigger search in parent through callback if needed
  }

  return (
    <>
      {/* Background blur effect */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <div className="text-2xl font-bold text-gradient">📚 Library</div>
            </motion.div>

            {/* Desktop Search and Categories */}
            <div className="hidden md:flex items-center gap-8 flex-1 ml-12">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent/50 focus:bg-white/10 smooth"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>

              <div className="flex gap-4 items-center">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm smooth ${
                      activeCategory === category
                        ? 'bg-accent/80 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 space-y-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent/50"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm smooth ${
                      activeCategory === category
                        ? 'bg-accent/80 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar
