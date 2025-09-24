// Analytics and tracking utilities
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const trackPageView = (pageName) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: pageName,
      page_location: window.location.href
    })
  }
}

export const trackProjectView = (projectId, projectTitle) => {
  trackEvent('project_view', {
    project_id: projectId,
    project_title: projectTitle,
    event_category: 'engagement',
    event_label: 'project_interaction'
  })
}

export const trackContactForm = (formType) => {
  trackEvent('contact_form_submit', {
    form_type: formType,
    event_category: 'conversion',
    event_label: 'lead_generation'
  })
}

export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    event_category: 'engagement',
    event_label: 'search_interaction'
  })
}

export const trackAdminAction = (action, details = {}) => {
  trackEvent('admin_action', {
    action: action,
    ...details,
    event_category: 'admin',
    event_label: 'management'
  })
}
