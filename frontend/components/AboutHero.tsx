'use client'

import { motion } from 'framer-motion'

const AboutHero = () => {
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
                About Us - Smart Leader
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            For over 15 years, we have been at the forefront of the real estate industry in Egypt, 
            delivering exceptional properties that combine luxury, innovation, and sustainability. 
            Our commitment to excellence has made us a trusted partner for thousands of satisfied clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">Happy Clients</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-300">Completed Projects</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
                <div className="text-gray-600 dark:text-gray-300">Years of Excellence</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutHero
