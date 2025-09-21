'use client'

import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Award, Users } from 'lucide-react'

const CompanyHistory = () => {
  const milestones = [
    {
      year: '2008',
      title: 'Company Founded',
      description: 'Qawafil Real Estate was established with a vision to revolutionize the Egyptian real estate market.',
      icon: Calendar,
    },
    {
      year: '2012',
      title: 'First Major Project',
      description: 'Completed our first luxury residential complex, setting new standards for quality and design.',
      icon: TrendingUp,
    },
    {
      year: '2018',
      title: 'Industry Recognition',
      description: 'Received the Best Real Estate Developer award from the Egyptian Real Estate Association.',
      icon: Award,
    },
    {
      year: '2023',
      title: 'Expansion & Growth',
      description: 'Expanded operations across multiple cities with over 500 satisfied clients and 50+ completed projects.',
      icon: Users,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to becoming a leading real estate developer, 
            our journey has been marked by continuous growth, innovation, and excellence.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <milestone.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="text-2xl font-bold text-primary-600">{milestone.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyHistory

