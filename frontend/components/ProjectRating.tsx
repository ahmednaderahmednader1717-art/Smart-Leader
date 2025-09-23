'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'

interface ProjectRatingProps {
  projectId: number
  currentRating?: {
    average: number
    count: number
  }
  onRatingSubmit?: (rating: number, feedback?: string) => void
  showFeedback?: boolean
  compact?: boolean
}

const ProjectRating = ({ 
  projectId, 
  currentRating, 
  onRatingSubmit, 
  showFeedback = false,
  compact = false 
}: ProjectRatingProps) => {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRated, setHasRated] = useState(false)

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleSubmitRating = async () => {
    if (selectedRating === 0) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onRatingSubmit) {
        onRatingSubmit(selectedRating, feedback)
      }
      
      setHasRated(true)
      
      // Reset form
      setSelectedRating(0)
      setFeedback('')
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && handleStarClick(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`transition-colors ${
              interactive 
                ? 'cursor-pointer hover:scale-110' 
                : 'cursor-default'
            }`}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            <Star
              className={`h-4 w-4 ${
                star <= (interactive ? (hoveredStar || selectedRating) : rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </motion.button>
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {currentRating && (
          <>
            {renderStars(currentRating.average)}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentRating.average.toFixed(1)} ({currentRating.count})
            </span>
          </>
        )}
      </div>
    )
  }

  if (hasRated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
      >
        <div className="flex items-center justify-center mb-2">
          <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-600 dark:text-green-400 font-medium">
            Thank you for your rating!
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your feedback helps us improve our projects.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Rate This Project
      </h3>

      {/* Current Rating Display */}
      {currentRating && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {renderStars(currentRating.average)}
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentRating.average.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {currentRating.count} review{currentRating.count !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentRating.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Reviews
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating
        </label>
        <div className="flex items-center space-x-2">
          {renderStars(selectedRating, true)}
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {selectedRating > 0 && (
              <>
                {selectedRating} star{selectedRating !== 1 ? 's' : ''}
                {selectedRating <= 2 && ' (Poor)'}
                {selectedRating === 3 && ' (Good)'}
                {selectedRating === 4 && ' (Very Good)'}
                {selectedRating === 5 && ' (Excellent)'}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Feedback Input */}
      {showFeedback && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think about this project..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmitRating}
        disabled={selectedRating === 0 || isSubmitting}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          selectedRating === 0 || isSubmitting
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        whileHover={selectedRating > 0 && !isSubmitting ? { scale: 1.02 } : {}}
        whileTap={selectedRating > 0 && !isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Submitting...
          </div>
        ) : (
          'Submit Rating'
        )}
      </motion.button>

      {/* Quick Rating Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Rating:</p>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => handleStarClick(5)}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Excellent</span>
          </motion.button>
          <motion.button
            onClick={() => handleStarClick(3)}
            className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="h-3 w-3" />
            <span>Good</span>
          </motion.button>
          <motion.button
            onClick={() => handleStarClick(1)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>Poor</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ProjectRating

