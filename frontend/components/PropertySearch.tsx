'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Bed, Bath, Car, Ruler, Filter, X } from 'lucide-react'
import { projectsService } from '@/lib/firebaseServices'
import { trackSearch } from '@/lib/analytics'

interface PropertySearchProps {
  onResults: (projects: any[]) => void
  onLoading: (loading: boolean) => void
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onResults, onLoading }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [allProjects, setAllProjects] = useState([])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const result = await projectsService.getProjects()
      if (result.success && result.data) {
        setAllProjects(result.data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleSearch = () => {
    onLoading(true)
    
    let filteredProjects = allProjects.filter((project: any) => {
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !location || 
        project.location.toLowerCase().includes(location.toLowerCase())
      
      const matchesType = !propertyType || 
        project.specifications?.type?.toLowerCase().includes(propertyType.toLowerCase())
      
      const matchesBedrooms = !bedrooms || 
        project.specifications?.bedrooms?.includes(bedrooms)
      
      const matchesBathrooms = !bathrooms || 
        project.specifications?.bathrooms?.includes(bathrooms)
      
      return matchesSearch && matchesLocation && matchesType && matchesBedrooms && matchesBathrooms
    })

    // Track search event
    trackSearch(searchTerm, filteredProjects.length)
    
    onResults(filteredProjects)
    onLoading(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setLocation('')
    setPropertyType('')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('')
    setBathrooms('')
    onResults(allProjects)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Find Your Dream Property
        </h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span>Advanced Filters</span>
        </button>
      </div>

      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 dark:border-gray-600 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PropertySearch
