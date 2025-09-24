// Performance monitoring and optimization
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
  }

  // Measure page load time
  measurePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0]
        this.metrics.pageLoad = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        }
        console.log('Page Load Metrics:', this.metrics.pageLoad)
      })
    }
  }

  // Measure Firebase query performance
  measureFirebaseQuery(queryName, startTime) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (!this.metrics.firebase) {
      this.metrics.firebase = {}
    }
    
    this.metrics.firebase[queryName] = duration
    console.log(`Firebase Query ${queryName}: ${duration.toFixed(2)}ms`)
  }

  // Measure component render time
  measureComponentRender(componentName, startTime) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (!this.metrics.components) {
      this.metrics.components = {}
    }
    
    this.metrics.components[componentName] = duration
    console.log(`Component ${componentName} render: ${duration.toFixed(2)}ms`)
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.lcp = lastEntry.startTime
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cls = clsValue
        console.log('CLS:', clsValue)
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  // Get performance report
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    }
  }

  // Send performance data to analytics
  sendToAnalytics() {
    const report = this.getReport()
    console.log('Performance Report:', report)
    
    // Send to your analytics service
    // analytics.track('performance_metrics', report)
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Initialize monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.measurePageLoad()
  performanceMonitor.monitorWebVitals()
}
