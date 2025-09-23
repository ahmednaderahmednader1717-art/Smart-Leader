'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Square } from 'lucide-react'
import { useState, useEffect } from 'react'
import { projectsService } from '@/lib/firebaseServices'

interface Project {
  id: number
  title: string
  description: string
  location: string
  images: string[]
  status: string
  price: string
  area: string
  completionDate: string
}

const ProjectsGrid = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const result = await projectsService.getProjects()
        if (result.success && result.data) {
          // Filter out Sold Out projects (they should only appear in previous projects)
          const availableProjects = result.data.filter(project => project.status !== 'Sold Out')
          setProjects(availableProjects)
        } else {
          // Fallback to mock data
          setProjects([
            {
              id: 1,
              title: 'Luxury Apartments in New Cairo',
              location: 'New Cairo, Egypt',
              images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              status: 'Available',
              price: 'Starting from $150,000',
              area: '120-200 sqm',
              completionDate: 'Q2 2024',
              description: 'Modern luxury apartments with premium amenities and stunning city views.',
            },
            {
              id: 2,
              title: 'Villa Complex in North Coast',
              location: 'North Coast, Egypt',
              images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              status: 'Available',
              price: 'Starting from $200,000',
              area: '250-400 sqm',
              completionDate: 'Q3 2024',
              description: 'Exclusive beachfront villas with private pools and direct beach access.',
            },
            {
              id: 3,
              title: 'Commercial Tower in Downtown',
              location: 'Downtown Cairo, Egypt',
              images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
              status: 'Available',
              price: 'Contact for pricing',
              area: '50-500 sqm',
              completionDate: 'Q4 2024',
              description: 'State-of-the-art commercial tower with modern office spaces.',
            }
          ])
        }
      } catch (error) {
        console.error('Error loading projects:', error)
        // Use mock data as fallback
        setProjects([
          {
            id: 1,
            title: 'Luxury Apartments in New Cairo',
            location: 'New Cairo, Egypt',
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
            status: 'Available',
            price: 'Starting from $150,000',
            area: '120-200 sqm',
            completionDate: 'Q2 2024',
            description: 'Modern luxury apartments with premium amenities and stunning city views.',
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">جاري تحميل المشاريع...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Available Properties
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse through our current projects and find the perfect property that meets your needs and lifestyle.
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
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={project.images[0] || '/placeholder.jpg'}
                  alt={project.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'Sold Out' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{project.location}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Square className="h-4 w-4 mr-2" />
                    <span>{project.area}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{project.completionDate}</span>
                  </div>
                </div>
                
                 <div className="flex items-center justify-between">
                   <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                     {project.price}
                   </span>
                  {project.status === 'Sold Out' ? (
                    <span className="inline-flex items-center text-gray-400 dark:text-gray-500 font-medium text-sm">
                      Sold Out
                    </span>
                  ) : (
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm group"
                    >
                      View Details
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
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
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors group"
          >
            Interested in a Project?
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsGrid

