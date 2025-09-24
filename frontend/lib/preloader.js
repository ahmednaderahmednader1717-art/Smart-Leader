// Preloader for performance optimization
class Preloader {
  constructor() {
    this.preloadedImages = new Set()
    this.preloadedRoutes = new Set()
  }

  // Preload images
  preloadImages(urls) {
    urls.forEach(url => {
      if (!this.preloadedImages.has(url)) {
        const img = new Image()
        img.src = url
        this.preloadedImages.add(url)
      }
    })
  }

  // Preload routes
  preloadRoute(route) {
    if (!this.preloadedRoutes.has(route)) {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
      this.preloadedRoutes.add(route)
    }
  }

  // Preload critical resources
  preloadCritical() {
    // Preload critical images
    const criticalImages = [
      '/images/hero-bg.jpg',
      '/images/logo.png',
      '/images/placeholder.jpg'
    ]
    this.preloadImages(criticalImages)

    // Preload critical routes
    const criticalRoutes = [
      '/projects',
      '/about',
      '/contact',
      '/admin'
    ]
    criticalRoutes.forEach(route => this.preloadRoute(route))
  }

  // Preload on hover
  preloadOnHover(element, route) {
    element.addEventListener('mouseenter', () => {
      this.preloadRoute(route)
    })
  }

  // Preload on intersection
  preloadOnIntersection(element, callback) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    observer.observe(element)
  }
}

export const preloader = new Preloader()
