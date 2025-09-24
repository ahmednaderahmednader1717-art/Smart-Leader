'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Star, 
  MapPin, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X
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

interface AdvancedAnalyticsProps {
  projects: Project[]
  contacts: any[]
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ projects, contacts }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('views')


  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date()
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    // Filter projects by period
    const recentProjects = projects.filter(project => 
      new Date(project.createdAt) >= startDate
    )

    // Status distribution
    const statusDistribution = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Location distribution
    const locationDistribution = projects.reduce((acc, project) => {
      const location = project.location.split(',')[0].trim()
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Type distribution
    const typeDistribution = projects.reduce((acc, project) => {
      const type = project.specifications?.type || 'Unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top performing projects
    const topProjects = [...projects]
      .sort((a, b) => {
        switch (selectedMetric) {
          case 'views':
            return b.views - a.views
          case 'rating':
            return (b.rating?.average || 0) - (a.rating?.average || 0)
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          default:
            return 0
        }
      })
      .slice(0, 5)

    // Performance metrics
    const totalViews = projects.reduce((sum, project) => sum + project.views, 0)
    const averageViews = projects.length > 0 ? totalViews / projects.length : 0
    const totalContacts = contacts.length
    const conversionRate = totalViews > 0 ? (totalContacts / totalViews) * 100 : 0

    // Growth metrics
    const previousPeriodStart = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000)
    const previousPeriodProjects = projects.filter(project => {
      const projectDate = new Date(project.createdAt)
      return projectDate >= previousPeriodStart && projectDate < startDate
    })

    const currentPeriodCount = recentProjects.length
    const previousPeriodCount = previousPeriodProjects.length
    const growthRate = previousPeriodCount > 0 
      ? ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100 
      : 0

    return {
      statusDistribution,
      locationDistribution,
      typeDistribution,
      topProjects,
      totalViews,
      averageViews,
      totalContacts,
      conversionRate,
      growthRate,
      currentPeriodCount,
      previousPeriodCount
    }
  }, [projects, contacts, selectedPeriod, selectedMetric])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500'
      case 'Under Construction':
        return 'bg-blue-500'
      case 'Coming Soon':
        return 'bg-yellow-500'
      case 'Sold Out':
        return 'bg-red-500'
      case 'Completed':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Detailed insights into your projects performance
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="views">Most Viewed</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics.averageViews.toFixed(0)} avg per project
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.conversionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics.totalContacts} total contacts
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Growth Rate</p>
              <p className={`text-2xl font-bold ${analytics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.growthRate >= 0 ? '+' : ''}{analytics.growthRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics.currentPeriodCount} new projects
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              analytics.growthRate >= 0 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {analytics.growthRate >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.filter(p => p.status === 'Available').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                of {projects.length} total
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => {
              const percentage = (count / projects.length) * 100
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Location Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.locationDistribution)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => {
                const percentage = (count / projects.length) * 100
                return (
                  <div key={location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Top Performing Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Projects
        </h3>
        <div className="space-y-4">
          {analytics.topProjects.map((project, index) => (
            <div key={project.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    #{index + 1}
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {project.location}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedMetric === 'views' ? project.views.toLocaleString() : 
                     selectedMetric === 'rating' ? (project.rating?.average || 0).toFixed(1) :
                     new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedMetric === 'views' ? 'views' : 
                     selectedMetric === 'rating' ? 'rating' : 'created'}
                  </p>
                </div>
                
                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Available' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : project.status === 'Sold Out'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                }`}>
                  {getStatusIcon(project.status)}
                  <span>{project.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalytics
