'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPin, Calendar, Square, Bed, Bath, Car, ArrowLeft, Share2, Heart, Star } from 'lucide-react'
import Link from 'next/link'
import { projectsService } from '@/lib/firebaseServices'
import ProjectRating from './ProjectRating'

interface ProjectDetailProps {
  projectId: string
}

interface Project {
  id: number
  title: string
  description: string
  longDescription?: string
  location: string
  price: string
  area: string
  completionDate: string
  status: string
  specifications: {
    bedrooms: string
    bathrooms: string
    parking: string
    floor: string
    type: string
  }
  features: string[]
  images: string[]
  createdAt: string
  views: number
  rating?: {
    average: number
    count: number
  }
}

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const result = await projectsService.getProjects()
        if (result.success && result.data) {
          const foundProject = result.data.find((p: any) => p.id.toString() === projectId)
          if (foundProject) {
            setProject(foundProject)
            // Increment views when project is loaded
            await projectsService.incrementViews(foundProject.id)
          } else {
            // Fallback to mock data if project not found
            setProject({
              id: parseInt(projectId),
              title: 'Luxury Apartments in New Cairo',
              location: 'New Cairo, Egypt',
              status: 'Available',
              price: 'Starting from $150,000',
              area: '120-200 sqm',
              completionDate: 'Q2 2024',
              description: 'Modern luxury apartments with premium amenities and stunning city views. This exceptional development offers residents a sophisticated lifestyle with world-class facilities and services.',
              longDescription: 'Located in the heart of New Cairo, this prestigious development represents the pinnacle of modern living. Each apartment is meticulously designed to maximize space, light, and comfort, featuring premium finishes and state-of-the-art appliances. The complex includes a fully equipped fitness center, swimming pool, children\'s playground, and 24/7 security services.',
              features: [
                'Premium finishes and fixtures',
                'Fully equipped kitchen with modern appliances',
                'Spacious balconies with city views',
                'Central air conditioning',
                'High-speed internet ready',
                'Underground parking',
                '24/7 security and concierge service',
                'Swimming pool and fitness center',
                'Children\'s playground',
                'Landscaped gardens',
              ],
              images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              ],
              specifications: {
                bedrooms: '2-3',
                bathrooms: '2-3',
                parking: '1-2',
                floor: '3-15',
                type: 'Apartment',
              },
              createdAt: new Date().toISOString(),
              views: 0
            })
          }
        }
      } catch (error) {
        console.error('Error loading project:', error)
        // Use mock data as fallback
        setProject({
          id: parseInt(projectId),
          title: 'Luxury Apartments in New Cairo',
          location: 'New Cairo, Egypt',
          status: 'Available',
          price: 'Starting from $150,000',
          area: '120-200 sqm',
          completionDate: 'Q2 2024',
          description: 'Modern luxury apartments with premium amenities and stunning city views.',
          longDescription: 'Located in the heart of New Cairo, this prestigious development represents the pinnacle of modern living.',
          features: [
            'Premium finishes and fixtures',
            'Fully equipped kitchen with modern appliances',
            'Spacious balconies with city views',
            'Central air conditioning',
            'High-speed internet ready',
            'Underground parking',
            '24/7 security and concierge service',
            'Swimming pool and fitness center',
            'Children\'s playground',
            'Landscaped gardens',
          ],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          ],
          specifications: {
            bedrooms: '2-3',
            bathrooms: '2-3',
            parking: '1-2',
            floor: '3-15',
            type: 'Apartment',
          },
          createdAt: new Date().toISOString(),
          views: 0,
          rating: {
            average: 4.5,
            count: 23
          }
        })
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The project you're looking for doesn't exist.</p>
          <Link href="/projects" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={project.images[selectedImage]}
                  alt={project.title}
                  className={`w-full h-96 object-cover ${
                    project.status === 'Sold Out' ? 'grayscale-[0.4]' : ''
                  }`}
                />
                
                {/* SOLD OUT Overlay */}
                {project.status === 'Sold Out' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-2xl shadow-lg transform rotate-[-5deg]">
                      SOLD OUT
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary-600 dark:ring-primary-400' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className={`text-3xl font-bold ${
                  project.status === 'Sold Out' 
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {project.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {project.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= project.rating!.average
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.rating?.average?.toFixed(1) || '0.0'} ({project.rating?.count || 0} reviews)
                  </span>
                </div>
              )}
              
              <div className={`flex items-center mb-6 ${
                project.status === 'Sold Out' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                <MapPin className="h-5 w-5 mr-2" />
                <span>{project.location}</span>
              </div>
              
              <p className={`leading-relaxed mb-6 ${
                project.status === 'Sold Out' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {project.longDescription}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bed className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-300">Bedrooms</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-gray-900 dark:text-white">{project.specifications.bedrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bath className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Bathrooms</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{project.specifications.bathrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Car className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Parking</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{project.specifications.parking}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Square className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-300">Area</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{project.area}</div>
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${
                  project.status === 'Sold Out' 
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-primary-600 dark:text-primary-400'
                }`}>
                  {project.status === 'Sold Out' ? 'SOLD OUT' : project.price}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Sold Out' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className={`${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>Completion</span>
                  <span className={`font-medium ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>{project.completionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>Type</span>
                  <span className={`font-medium ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>{project.specifications.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>Floors</span>
                  <span className={`font-medium ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>{project.specifications.floor}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {project.status === 'Sold Out' ? (
                  <>
                    <button
                      disabled
                      className="w-full bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 py-3 px-4 rounded-lg font-semibold cursor-not-allowed text-center block"
                    >
                      Project Sold Out
                    </button>
                    <button
                      disabled
                      className="w-full border-2 border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed text-center block"
                    >
                      No Longer Available
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/contact"
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                    >
                      Schedule a Visit
                    </Link>
                    <Link
                      href="/contact"
                      className="w-full border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors text-center block"
                    >
                      Get More Info
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Sales Team</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Ahmed Hassan</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Sales Manager</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div>+20 123 456 7890</div>
                  <div>ahmed@smartleader.com</div>
                </div>
              </div>
            </motion.div>

            {/* Rating Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ProjectRating 
                projectId={project.id}
                currentRating={project.rating}
                showFeedback={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
