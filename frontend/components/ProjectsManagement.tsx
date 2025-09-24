'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload,
  RefreshCw,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  MoreVertical,
  CheckSquare,
  Square,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'
import { projectsService } from '@/lib/firebaseServices'
import { useToastContext } from './ToastProvider'
import ImageUpload from './ImageUpload'
import QuickSearch from './QuickSearch'
import VirtualizedProjectsList from './VirtualizedProjectsList'

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

interface ProjectsManagementProps {
  onEditProject: (project: Project) => void
  onDeleteProject: (id: number) => void
}

const ProjectsManagement: React.FC<ProjectsManagementProps> = ({ 
  onEditProject, 
  onDeleteProject
}) => {
  const { success, error, warning } = useToastContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Load projects with caching
  const loadProjects = useCallback(async (useCache = true) => {
    try {
      setIsRefreshing(true)
      const result = await projectsService.getProjects(useCache)
      if (result.success && result.data) {
        setProjects(result.data)
      } else {
        error('Failed to load projects', result.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error loading projects:', err)
      error('Error', 'Failed to load projects')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [error])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Memoized filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
      
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
        case 'price':
          return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''))
        default:
          return 0
      }
    })

    return filtered
  }, [projects, searchTerm, filterStatus, sortBy])

  // Handle project selection
  const handleSelectProject = useCallback((projectId: number) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)))
    }
  }, [selectedProjects.size, filteredProjects])

  // Bulk operations
  const handleBulkDelete = useCallback(async () => {
    if (selectedProjects.size === 0) return

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedProjects.size} projects?`)
    if (!confirmed) return

    try {
      const deletePromises = Array.from(selectedProjects).map(id => 
        projectsService.deleteProject(id)
      )
      
      await Promise.all(deletePromises)
      
      setProjects(prev => prev.filter(p => !selectedProjects.has(p.id)))
      setSelectedProjects(new Set())
      setShowBulkActions(false)
      
      success('Success', `${selectedProjects.size} projects deleted successfully`)
    } catch (err) {
      error('Error', 'Failed to delete projects')
    }
  }, [selectedProjects, success, error])

  const handleBulkStatusUpdate = useCallback(async (newStatus: string) => {
    if (selectedProjects.size === 0) return

    try {
      const updatePromises = Array.from(selectedProjects).map(id => {
        const project = projects.find(p => p.id === id)
        if (project) {
          return projectsService.updateProject(id, { ...project, status: newStatus })
        }
        return Promise.resolve()
      })
      
      await Promise.all(updatePromises)
      
      setProjects(prev => prev.map(p => 
        selectedProjects.has(p.id) ? { ...p, status: newStatus } : p
      ))
      setSelectedProjects(new Set())
      setShowBulkActions(false)
      
      success('Success', `${selectedProjects.size} projects updated successfully`)
    } catch (err) {
      error('Error', 'Failed to update projects')
    }
  }, [selectedProjects, projects, success, error])

  // Export projects
  const handleExport = useCallback(() => {
    const csvContent = [
      ['Title', 'Location', 'Status', 'Price', 'Area', 'Views', 'Created At'],
      ...filteredProjects.map(project => [
        project.title,
        project.location,
        project.status,
        project.price,
        project.area,
        project.views.toString(),
        new Date(project.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `projects-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    success('Export Complete', 'Projects exported successfully')
  }, [filteredProjects, success])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'Under Construction':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Coming Soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Sold Out':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'Completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-4 w-4" />
      case 'Under Construction':
        return <Clock className="h-4 w-4" />
      case 'Coming Soon':
        return <AlertCircle className="h-4 w-4" />
      case 'Sold Out':
        return <X className="h-4 w-4" />
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Projects Management
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {filteredProjects.length} projects
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Enhanced Search */}
            <QuickSearch
              onSearch={setSearchTerm}
              onSelect={(project) => {
                if (project.id) {
                  onEditProject(project)
                }
              }}
              placeholder="Search projects..."
              className="w-full sm:w-80"
            />

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => loadProjects(false)}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            {/* Change View Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {viewMode === 'grid' ? (
                <>
                  <List className="h-4 w-4" />
                  <span>List View</span>
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4" />
                  <span>Grid View</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="views">Most Viewed</option>
                    <option value="title">Title A-Z</option>
                    <option value="price">Price Low-High</option>
                  </select>
                </div>

                {/* View Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    View Mode
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      <List className="h-4 w-4" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {selectedProjects.size} projects selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                {selectedProjects.size === filteredProjects.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="px-3 py-1 border border-blue-300 dark:border-blue-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Change Status</option>
                <option value="Available">Available</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Completed">Completed</option>
              </select>
              
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Virtualized Projects List */}
      <VirtualizedProjectsList
        projects={filteredProjects}
        selectedProjects={selectedProjects}
        onSelectProject={handleSelectProject}
        onEditProject={onEditProject}
        onDeleteProject={onDeleteProject}
        viewMode={viewMode}
      />

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first project'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectsManagement
