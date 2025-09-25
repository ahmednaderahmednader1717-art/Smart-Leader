'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  DollarSign, 
  CheckSquare,
  Square,
  Star,
  Calendar,
  Upload
} from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
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

interface VirtualizedProjectsListProps {
  projects: Project[]
  selectedProjects: Set<number>
  onSelectProject: (id: number) => void
  onEditProject: (project: Project) => void
  onDeleteProject: (id: number) => void
  viewMode: 'grid' | 'list'
}

const VirtualizedProjectsList: React.FC<VirtualizedProjectsListProps> = ({
  projects,
  selectedProjects,
  onSelectProject,
  onEditProject,
  onDeleteProject,
  viewMode
}) => {

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

  // Grid Item Component
  const GridItem = ({ project }: { project: Project }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden h-full relative ${
          project.status === 'Sold Out' ? 'opacity-75 grayscale-[0.3]' : ''
        }`}
      >
          {/* Project Image */}
          <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0]}
                alt={project.title}
                className={`w-full h-full object-cover ${
                  project.status === 'Sold Out' ? 'grayscale-[0.4]' : ''
                }`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">No Image</p>
                </div>
              </div>
            )}
            
            {/* SOLD OUT Overlay */}
            {project.status === 'Sold Out' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transform rotate-[-5deg]">
                  SOLD OUT
                </div>
              </div>
            )}
            
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3">
              <button
                onClick={() => onSelectProject(project.id)}
                className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {selectedProjects.has(project.id) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                <span>{project.status}</span>
              </span>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-4">
            <h3 className={`font-semibold mb-2 line-clamp-2 ${
              project.status === 'Sold Out' 
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {project.title}
            </h3>
            
            <div className="space-y-2 mb-4">
              <div className={`flex items-center space-x-2 text-sm ${
                project.status === 'Sold Out' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <MapPin className="h-4 w-4" />
                <span className="truncate">{project.location}</span>
              </div>
              
              <div className={`flex items-center space-x-2 text-sm ${
                project.status === 'Sold Out' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <DollarSign className="h-4 w-4" />
                <span className={project.status === 'Sold Out' ? 'line-through' : ''}>
                  {project.status === 'Sold Out' ? 'SOLD OUT' : project.price}
                </span>
              </div>
              
              <div className={`flex items-center space-x-2 text-sm ${
                project.status === 'Sold Out' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <Eye className="h-4 w-4" />
                <span>{project.views.toLocaleString()} views</span>
              </div>
              
              {project.rating && (
                <div className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{project.rating.average}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({project.rating.count} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditProject(project)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
    )
  }

  // List Item Component
  const ListItem = ({ project }: { project: Project }) => {
    return (
      <div className="px-6 py-4">
        <div className={`flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
          project.status === 'Sold Out' ? 'opacity-75 grayscale-[0.3]' : ''
        }`}>
          {/* Selection Checkbox */}
          <button
            onClick={() => onSelectProject(project.id)}
            className="flex-shrink-0"
          >
            {selectedProjects.has(project.id) ? (
              <CheckSquare className="h-4 w-4 text-blue-600" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Project Image */}
          <div className="flex-shrink-0">
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              project.status === 'Sold Out' 
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {project.title}
            </h4>
            <p className={`text-sm truncate ${
              project.status === 'Sold Out' 
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {project.location}
            </p>
          </div>
          
          {/* Status */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              <span>{project.status}</span>
            </span>
          </div>

          {/* Price */}
          <div className={`flex-shrink-0 text-sm ${
            project.status === 'Sold Out' 
              ? 'text-gray-400 dark:text-gray-500 line-through'
              : 'text-gray-900 dark:text-white'
          }`}>
            {project.status === 'Sold Out' ? 'SOLD OUT' : project.price}
          </div>

          {/* Rating */}
          <div className="flex-shrink-0 text-sm">
            {project.rating ? (
              <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{project.rating.average}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({project.rating.count})
                </span>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">No rating</span>
            )}
          </div>

          {/* Views */}
          <div className="flex-shrink-0 text-sm text-gray-900 dark:text-white">
            {project.views.toLocaleString()}
          </div>

          {/* Created Date */}
          <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              onClick={() => onEditProject(project)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteProject(project.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Upload className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No projects found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Get started by adding your first project
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {projects.map((project) => (
            <GridItem key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="w-4"></div> {/* Checkbox column */}
              <div className="w-12"></div> {/* Image column */}
              <div className="flex-1">Project</div>
              <div className="w-24">Status</div>
              <div className="w-32">Price</div>
              <div className="w-24">Rating</div>
              <div className="w-20">Views</div>
              <div className="w-24">Created</div>
              <div className="w-20">Actions</div>
            </div>
          </div>
          
          {/* Regular List */}
          <div className="max-h-96 overflow-y-auto">
            {projects.map((project) => (
              <ListItem key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VirtualizedProjectsList
