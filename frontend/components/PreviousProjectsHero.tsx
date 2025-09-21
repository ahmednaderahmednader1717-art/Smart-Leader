'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Award, Users, Star } from 'lucide-react'

const PreviousProjectsHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Previous Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Take a look at our portfolio of completed projects. Each development represents 
            our commitment to excellence, innovation, and customer satisfaction. These successful 
            projects showcase our expertise and the trust our clients place in us.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">35+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed Projects</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <Award className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Awards Won</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <Users className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">300+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Happy Families</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <Star className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Client Rating</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PreviousProjectsHero

