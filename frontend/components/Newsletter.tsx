'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Check, X } from 'lucide-react'
import { contactsService } from '@/lib/firebaseServices'

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const result = await contactsService.submitContact({
        name: 'Newsletter Subscriber',
        email: email,
        phone: '',
        message: 'Newsletter subscription request'
      })

      if (result.success) {
        setIsSubscribed(true)
        setEmail('')
      } else {
        setError('Failed to subscribe. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
      >
        <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Successfully Subscribed!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for subscribing to our newsletter. You'll receive updates about our latest properties.
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="mt-4 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm"
        >
          Subscribe another email
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
      <div className="text-center mb-6">
        <Mail className="h-12 w-12 mx-auto mb-4 text-blue-200" />
        <h2 className="text-2xl font-bold mb-2">
          Stay Updated with Our Latest Properties
        </h2>
        <p className="text-blue-100">
          Subscribe to our newsletter and be the first to know about new projects and exclusive offers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Subscribe</span>
              </>
            )}
          </motion.button>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center space-x-2 text-red-200"
          >
            <X className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </form>

      <p className="text-center text-blue-200 text-sm mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  )
}

export default Newsletter
