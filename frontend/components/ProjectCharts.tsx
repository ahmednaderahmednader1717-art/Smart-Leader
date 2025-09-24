'use client'

import { motion } from 'framer-motion'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Project {
  id: number
  title: string
  views: number
  rating?: {
    average: number
    count: number
  }
  status: string
}

interface ProjectChartsProps {
  projects: Project[]
}

const ProjectCharts = ({ projects }: ProjectChartsProps) => {
  // Prepare data for most viewed projects chart
  const mostViewedProjects = projects
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  const mostViewedData = {
    labels: mostViewedProjects.map(project => project.title.length > 20 
      ? project.title.substring(0, 20) + '...' 
      : project.title),
    datasets: [
      {
        label: 'Views',
        data: mostViewedProjects.map(project => project.views),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  // Prepare data for project status distribution
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Create dynamic colors based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' } // Green
      case 'Under Construction':
        return { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' } // Blue
      case 'Coming Soon':
        return { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' } // Yellow
      case 'Completed':
        return { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)' } // Purple
      case 'Sold Out':
        return { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' } // Red
      default:
        return { bg: 'rgba(107, 114, 128, 0.8)', border: 'rgba(107, 114, 128, 1)' } // Gray
    }
  }

  const statusLabels = Object.keys(statusCounts)
  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: statusLabels.map(status => getStatusColor(status).bg),
        borderColor: statusLabels.map(status => getStatusColor(status).border),
        borderWidth: 2,
      },
    ],
  }

  // Prepare data for ratings chart (if available)
  const projectsWithRatings = projects.filter(project => project.rating && project.rating.count > 0)
  const topRatedProjects = projectsWithRatings
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 5)

  const ratingsData = {
    labels: topRatedProjects.map(project => project.title.length > 15 
      ? project.title.substring(0, 15) + '...' 
      : project.title),
    datasets: [
      {
        label: 'Rating',
        data: topRatedProjects.map(project => project.rating?.average || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        color: '#374151',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Most Viewed Projects Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Most Viewed Projects
        </h3>
        <div className="h-64">
          <Bar data={mostViewedData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Project Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Project Status Distribution
        </h3>
        <div className="h-64">
          <Doughnut data={statusData} options={doughnutOptions} />
        </div>
      </motion.div>

      {/* Top Rated Projects Chart */}
      {projectsWithRatings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Rated Projects
          </h3>
          <div className="h-64">
            <Bar data={ratingsData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: {
                  ...chartOptions.scales.y,
                  max: 5,
                  ticks: {
                    ...chartOptions.scales.y.ticks,
                    callback: function(value) {
                      return value + '★'
                    }
                  }
                }
              }
            }} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ProjectCharts

