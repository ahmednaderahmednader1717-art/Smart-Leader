'use client'

import { motion } from 'framer-motion'
import { MapPin, Calendar, Lightbulb } from 'lucide-react'

const ProjectsHero = () => {
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
            Current Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Discover our latest real estate developments across Egypt. From luxury apartments 
            to premium villas and commercial spaces, we offer exceptional properties that 
            combine modern design with prime locations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <Lightbulb className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Projects</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <MapPin className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Cities</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4"
            >
              <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2024</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Launch Year</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsHero
