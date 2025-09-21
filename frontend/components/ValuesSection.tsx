'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart, Shield, Lightbulb, Users } from 'lucide-react'

const ValuesSection = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To deliver exceptional real estate solutions that exceed expectations and create lasting value for our clients through innovative design, superior quality, and unmatched service.',
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading real estate company in Egypt, recognized for innovation, quality, and customer satisfaction while contributing to the sustainable development of our communities.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We conduct business with the highest ethical standards, ensuring transparency, honesty, and fairness in all our dealings with clients, partners, and stakeholders.',
    },
    {
      icon: Shield,
      title: 'Quality',
      description: 'We are committed to delivering superior quality in every project, using premium materials, cutting-edge technology, and meticulous attention to detail.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace innovation and creativity in our designs and processes, constantly seeking new ways to enhance the living and working experience for our clients.',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Our clients are at the heart of everything we do. We listen to their needs, understand their aspirations, and deliver solutions that exceed their expectations.',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Mission, Vision & Values
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            These core principles guide our decisions, shape our culture, and drive our commitment 
            to excellence in everything we do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <value.icon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValuesSection

