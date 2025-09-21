'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Calendar, Square, Bed, Bath, Car, ArrowLeft, Share2, Heart } from 'lucide-react'
import Link from 'next/link'

interface ProjectDetailProps {
  projectId: string
}

const ProjectDetail = ({ projectId }: ProjectDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock project data - in a real app, this would come from an API
  const project = {
    id: projectId,
    title: 'Luxury Apartments in New Cairo',
    location: 'New Cairo, Egypt',
    status: 'Available',
    price: 'Starting from $150,000',
    area: '120-200 sqm',
    completion: 'Q2 2024',
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
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/projects"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
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
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={project.images[selectedImage]}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 bg-white/80 text-gray-600 rounded-full backdrop-blur-sm hover:bg-white transition-colors">
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
                        selectedImage === index ? 'ring-2 ring-primary-600' : ''
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
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{project.location}</span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {project.longDescription}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Bedrooms</div>
                  <div className="font-semibold">{project.specifications.bedrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Bathrooms</div>
                  <div className="font-semibold">{project.specifications.bathrooms}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Parking</div>
                  <div className="font-semibold">{project.specifications.parking}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Area</div>
                  <div className="font-semibold">{project.area}</div>
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
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {project.price}
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium">{project.completion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{project.specifications.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floors</span>
                  <span className="font-medium">{project.specifications.floor}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                >
                  Schedule a Visit
                </Link>
                <Link
                  href="/contact"
                  className="w-full border-2 border-primary-600 text-primary-600 py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors text-center block"
                >
                  Get More Info
                </Link>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Sales Team</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ahmed Hassan</div>
                    <div className="text-sm text-gray-600">Sales Manager</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div>+20 123 456 7890</div>
                  <div>ahmed@smartleader.com</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
