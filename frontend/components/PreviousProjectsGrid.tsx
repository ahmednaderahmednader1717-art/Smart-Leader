'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Square, CheckCircle } from 'lucide-react'

const PreviousProjectsGrid = () => {
  const projects = [
    {
      id: 1,
      title: 'Luxury Residences in Zamalek',
      location: 'Zamalek, Cairo',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2023',
      area: '150-300 sqm',
      units: '120 units',
      description: 'Premium residential complex with stunning Nile views and world-class amenities.',
    },
    {
      id: 2,
      title: 'Business Park in New Capital',
      location: 'New Administrative Capital',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2023',
      area: '50-200 sqm',
      units: '80 units',
      description: 'Modern commercial complex designed for the future of business in Egypt.',
    },
    {
      id: 3,
      title: 'Family Villas in 6th October',
      location: '6th October City, Giza',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2022',
      area: '250-400 sqm',
      units: '60 units',
      description: 'Spacious family villas with private gardens and premium finishes.',
    },
    {
      id: 4,
      title: 'Luxury Apartments in Heliopolis',
      location: 'Heliopolis, Cairo',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2022',
      area: '120-200 sqm',
      units: '100 units',
      description: 'Elegant apartments in one of Cairo\'s most prestigious neighborhoods.',
    },
    {
      id: 5,
      title: 'Mixed-Use Development in Maadi',
      location: 'Maadi, Cairo',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2021',
      area: '80-150 sqm',
      units: '150 units',
      description: 'Innovative mixed-use development combining residential and commercial spaces.',
    },
    {
      id: 6,
      title: 'Beachfront Resort in Sharm El Sheikh',
      location: 'Sharm El Sheikh, South Sinai',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      status: 'Completed',
      completionDate: '2021',
      area: '100-250 sqm',
      units: '90 units',
      description: 'Luxury beachfront resort with direct access to the Red Sea.',
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
            Our Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Each completed project represents our commitment to excellence and our ability to deliver 
            exceptional results that exceed client expectations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{project.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{project.completionDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Square className="h-4 w-4 mr-2" />
                    <span>{project.area}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  {project.units} delivered
                </div>
                
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group"
                >
                  View Project Details
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-primary-50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Next Project?
            </h3>
            <p className="text-gray-600 mb-6">
              Let us help you create your dream property. Our team of experts is ready to bring 
              your vision to life with the same quality and attention to detail that made these projects successful.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors group"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PreviousProjectsGrid

