'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Calendar, Square, CheckCircle, Search, Filter, Download, Eye, Star, Users, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { projectsService } from '@/lib/firebaseServices'

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

const PreviousProjectsGrid = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    soldOut: 0,
    completed: 0,
    totalViews: 0
  })

  // Load previous projects (Sold Out + Completed)
  useEffect(() => {
    const loadPreviousProjects = async () => {
      try {
        const result = await projectsService.getProjects()
        if (result.success && result.data) {
          const previousProjects = result.data.filter((project: any) => 
            project.status === 'Sold Out' || project.status === 'Completed'
          )
          // Add rating to projects if missing
          const projectsWithRating = previousProjects.map((project: any) => ({
            ...project,
            rating: project.rating || { average: 4.5, count: Math.floor(Math.random() * 50) + 10 }
          }))
          setProjects(projectsWithRating)
          setFilteredProjects(projectsWithRating)
          
          // Calculate stats
          setStats({
            total: previousProjects.length,
            soldOut: previousProjects.filter((p: any) => p.status === 'Sold Out').length,
            completed: previousProjects.filter((p: any) => p.status === 'Completed').length,
            totalViews: previousProjects.reduce((sum: any, p: any) => sum + p.views, 0)
          })
        } else {
          // Fallback to mock data
          const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Luxury Residences in Zamalek',
              description: 'Premium residential complex with stunning Nile views and world-class amenities.',
              longDescription: 'Detailed description...',
      location: 'Zamalek, Cairo',
              price: 'Sold Out',
              area: '150-300 sqm',
      completionDate: '2023',
              status: 'Sold Out',
              specifications: {
                bedrooms: '2-4',
                bathrooms: '2-3',
                parking: '1-2',
                floor: '3-20',
                type: 'Apartment'
              },
              features: ['Nile View', 'Premium Finishing', '24/7 Security'],
              images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              ],
              createdAt: new Date().toISOString(),
              views: 1250,
              rating: {
                average: 4.7,
                count: 45
              }
    },
    {
      id: 2,
      title: 'Business Park in New Capital',
              description: 'Modern commercial complex designed for the future of business in Egypt.',
              longDescription: 'Detailed description...',
      location: 'New Administrative Capital',
              price: 'Completed',
              area: '50-200 sqm',
      completionDate: '2023',
      status: 'Completed',
              specifications: {
                bedrooms: 'N/A',
                bathrooms: '2-4',
                parking: '2-3',
                floor: '1-10',
                type: 'Commercial'
              },
              features: ['Modern Design', 'Smart Building', 'Parking'],
              images: [
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
              ],
              createdAt: new Date().toISOString(),
              views: 890,
              rating: {
                average: 4.3,
                count: 28
              }
            }
          ]
          setProjects(mockProjects)
          setFilteredProjects(mockProjects)
          setStats({
            total: mockProjects.length,
            soldOut: mockProjects.filter(p => p.status === 'Sold Out').length,
            completed: mockProjects.filter(p => p.status === 'Completed').length,
            totalViews: mockProjects.reduce((sum, p) => sum + p.views, 0)
          })
        }
      } catch (error) {
        console.error('Error loading previous projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreviousProjects()
  }, [])

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || project.status === filterStatus
      return matchesSearch && matchesFilter
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'views':
          return b.views - a.views
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, filterStatus, sortBy])

  const exportCatalog = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Location,Status,Completion Date,Area,Views,Features\n" +
      filteredProjects.map(p => 
        `"${p.title}","${p.location}","${p.status}","${p.completionDate}","${p.area}",${p.views},"${p.features.join('; ')}"`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "previous-projects-catalog.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading previous projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Each completed project represents our commitment to excellence and our ability to deliver 
            exceptional results that exceed client expectations.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Projects</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.soldOut}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Sold Out</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Views</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Views</option>
              <option value="title">Title A-Z</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportCatalog}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No previous projects found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative ${
                project.status === 'Sold Out' ? 'opacity-75 grayscale-[0.3]' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                  alt={project.title}
                  className={`w-full h-64 object-cover ${
                    project.status === 'Sold Out' ? 'grayscale-[0.4]' : ''
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                
                {/* SOLD OUT Overlay */}
                {project.status === 'Sold Out' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transform rotate-[-5deg]">
                      SOLD OUT
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                    project.status === 'Sold Out' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  }`}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {project.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 ${
                  project.status === 'Sold Out' 
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {project.title}
                </h3>
                
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{project.location}</span>
                </div>
                
                <p className={`text-sm mb-4 line-clamp-2 ${
                  project.status === 'Sold Out' 
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {project.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className={`flex items-center ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{project.completionDate}</span>
                  </div>
                  <div className={`flex items-center ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    <Square className="h-4 w-4 mr-2" />
                    <span>{project.area}</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between text-sm mb-4 ${
                  project.status === 'Sold Out' 
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <span>{project.views.toLocaleString()} views</span>
                  <span>{project.specifications.type}</span>
                </div>
                
                <Link
                  href={`/projects/${project.id}`}
                  className={`inline-flex items-center font-medium text-sm group ${
                    project.status === 'Sold Out' 
                      ? 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      : 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                  }`}
                  onClick={async () => {
                    // Increment views when clicking "View Project Details"
                    await projectsService.incrementViews(project.id)
                  }}
                >
                  {project.status === 'Sold Out' ? (
                    <>
                      <span>View Project Details</span>
                      <span className="ml-2 text-red-500 font-bold">(SOLD OUT)</span>
                    </>
                  ) : (
                    <>
                  View Project Details
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Link>
              </div>
            </motion.div>
            ))
          )}
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

