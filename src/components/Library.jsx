import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BookCard from './BookCard'
import FlipbookViewer from './FlipbookViewer'
import { dummyBooks } from '../data/dummyBooks'

const Library = ({ activeCategory, searchQuery }) => {
  const [selectedBook, setSelectedBook] = useState(null)
  const [filteredBooks, setFilteredBooks] = useState(dummyBooks)
  const [books, setBooks] = useState(dummyBooks)

  useEffect(() => {
    // Load books from localStorage
    const savedBooks = localStorage.getItem('books')
    if (savedBooks) {
      try {
        setBooks([...dummyBooks, ...JSON.parse(savedBooks)])
      } catch (e) {
        console.error('Error loading books:', e)
      }
    }
  }, [])

  useEffect(() => {
    let filtered = books

    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter((book) => book.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredBooks(filtered)
  }, [activeCategory, searchQuery, books])

  // Listen for new book additions
  useEffect(() => {
    const handleStorageChange = () => {
      const savedBooks = localStorage.getItem('books')
      if (savedBooks) {
        try {
          setBooks([...dummyBooks, ...JSON.parse(savedBooks)])
        } catch (e) {
          console.error('Error loading books:', e)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from AdminPanel
    window.addEventListener('bookAdded', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bookAdded', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="text-gradient">Discover</span> Your Next Book
          </h1>
          <p className="text-gray-400 text-lg">
            Immerse yourself in a world of knowledge and imagination
          </p>
        </motion.div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BookCard book={book} onClick={() => setSelectedBook(book)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-96 text-center"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">No books found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </motion.div>
        )}
      </div>

      {/* Flipbook Viewer Modal */}
      {selectedBook && (
        <FlipbookViewer
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  )
}

export default Library
