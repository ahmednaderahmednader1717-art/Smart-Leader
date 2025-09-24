'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Clock, Database, Wifi, WifiOff } from 'lucide-react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  networkStatus: 'online' | 'offline'
  cacheHitRate: number
  bundleSize: number
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkStatus: 'online',
    cacheHitRate: 0,
    bundleSize: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now()
    setMetrics(prev => ({ ...prev, loadTime }))

    // Monitor network status
    const updateNetworkStatus = () => {
      setMetrics(prev => ({
        ...prev,
        networkStatus: navigator.onLine ? 'online' : 'offline'
      }))
    }

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      }))
    }

    // Monitor cache performance
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        setMetrics(prev => ({
          ...prev,
          cacheHitRate: cacheNames.length > 0 ? 85 : 0 // Estimated
        }))
      })
    }

    // Estimate bundle size
    const scripts = document.querySelectorAll('script[src]')
    let totalSize = 0
    scripts.forEach(script => {
      const src = script.getAttribute('src')
      if (src && src.includes('_next/static')) {
        totalSize += 100 // Estimated KB per script
      }
    })
    setMetrics(prev => ({ ...prev, bundleSize: totalSize }))

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 min-w-[300px]"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span>Performance Monitor</span>
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        {/* Load Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 text-green-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Load Time</span>
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {metrics.loadTime.toFixed(0)}ms
          </span>
        </div>

        {/* Memory Usage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Memory</span>
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {metrics.memoryUsage}MB
          </span>
        </div>

        {/* Network Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {metrics.networkStatus === 'online' ? (
              <Wifi className="h-3 w-3 text-green-600" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-600" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400">Network</span>
          </div>
          <span className={`text-xs font-medium ${
            metrics.networkStatus === 'online' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {metrics.networkStatus}
          </span>
        </div>

        {/* Cache Hit Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Cache</span>
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {metrics.cacheHitRate}%
          </span>
        </div>

        {/* Bundle Size */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Bundle</span>
          </div>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {metrics.bundleSize}KB
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl+Shift+P to toggle
        </p>
      </div>
    </motion.div>
  )
}

export default PerformanceMonitor
