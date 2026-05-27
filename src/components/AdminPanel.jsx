import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Lock } from 'lucide-react'

const AdminPanel = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState('login') // login or form
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    coverImage: null,
    pdfFile: null,
  })
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setStage('form')
      setPasswordError('')
      setPassword('')
    } else {
      setPasswordError('Invalid password')
      setPassword('')
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      const file = files[0]
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [name]: {
            name: file.name,
            data: event.target.result,
          },
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.title || !formData.category || !formData.coverImage) {
      alert('Please fill all required fields')
      setIsSubmitting(false)
      return
    }

    // Simulate processing delay
    setTimeout(() => {
      // Create new book object
      const newBook = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        author: 'User',
        cover: formData.coverImage.data,
        pages: [
          { pageNumber: 1, content: formData.title, type: 'cover' },
          { pageNumber: 2, content: 'Chapter 1: Introduction\n\nThis is your custom book uploaded to the library.' },
          { pageNumber: 3, content: 'Page 3 content\n\nYour content goes here.' },
          { pageNumber: 4, content: 'Page 4 content\n\nMore of your book content.' },
          { pageNumber: 5, content: 'The End\n\nThank you for reading!' },
        ],
      }

      // Get existing books from localStorage
      const existingBooks = JSON.parse(localStorage.getItem('books') || '[]')
      existingBooks.push(newBook)
      localStorage.setItem('books', JSON.stringify(existingBooks))

      // Trigger update in Library component
      window.dispatchEvent(new Event('bookAdded'))

      setUploadSuccess(true)
      setTimeout(() => {
        setFormData({ title: '', category: '', coverImage: null, pdfFile: null })
        setUploadSuccess(false)
        setStage('login')
        setIsSubmitting(false)
        onClose()
      }, 2000)
    }, 500)
  }

  const handleClose = () => {
    setStage('login')
    setPassword('')
    setPasswordError('')
    setFormData({ title: '', category: '', coverImage: null, pdfFile: null })
    setUploadSuccess(false)
    setIsSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-strong rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-accent/10 to-blue-500/10">
              <div className="flex items-center gap-2">
                <Lock size={24} className="text-accent" />
                <h2 className="text-2xl font-bold">Admin Panel</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg smooth"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-96 overflow-y-auto">
              {uploadSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold mb-2">Book Added!</h3>
                  <p className="text-gray-400">Your book is now in the library</p>
                </motion.div>
              ) : stage === 'login' ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent/50 smooth"
                      autoFocus
                    />
                    {passwordError && (
                      <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Hint: admin123</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-2 bg-accent/80 hover:bg-accent text-white font-semibold rounded-lg smooth transition"
                  >
                    Unlock Admin Panel
                  </motion.button>
                </form>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Book Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Enter book title"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent/50 smooth"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent/50 smooth"
                    >
                      <option value="">Select category</option>
                      <option value="Tech">Tech</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Notes">Notes</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cover Image *</label>
                    <label className="flex items-center justify-center w-full py-3 border-2 border-dashed border-accent/50 rounded-lg cursor-pointer hover:border-accent/80 hover:bg-accent/5 smooth transition">
                      <div className="flex items-center gap-2">
                        <Upload size={20} />
                        <span className="text-sm">Choose image</span>
                      </div>
                      <input
                        type="file"
                        name="coverImage"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    {formData.coverImage && (
                      <p className="text-xs text-gray-400 mt-1">✓ {formData.coverImage.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">PDF File (Optional)</label>
                    <label className="flex items-center justify-center w-full py-3 border-2 border-dashed border-blue-500/50 rounded-lg cursor-pointer hover:border-blue-500/80 hover:bg-blue-500/5 smooth transition">
                      <div className="flex items-center gap-2">
                        <Upload size={20} />
                        <span className="text-sm">Choose PDF</span>
                      </div>
                      <input
                        type="file"
                        name="pdfFile"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                      />
                    </label>
                    {formData.pdfFile && (
                      <p className="text-xs text-gray-400 mt-1">✓ {formData.pdfFile.name}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 bg-accent/80 hover:bg-accent disabled:bg-accent/50 text-white font-semibold rounded-lg smooth transition mt-6"
                  >
                    {isSubmitting ? 'Uploading...' : 'Upload Book'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AdminPanel
