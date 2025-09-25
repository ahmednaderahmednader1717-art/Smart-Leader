// SEO optimization utilities
export const generateProjectSEO = (project) => {
  return {
    title: `${project.title} - Smart Leader Real Estate`,
    description: project.description || `Explore ${project.title} in ${project.location}. ${project.price}`,
    keywords: [
      'real estate',
      'property',
      'apartment',
      'villa',
      project.location,
      project.specifications?.type,
      'Smart Leader',
      'Egypt'
    ].filter(Boolean).join(', '),
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.images?.slice(0, 3) || [],
      type: 'website',
      siteName: 'Smart Leader Real Estate'
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.images?.[0]
    }
  }
}

export const generatePageSEO = (page, data = {}) => {
  const seoData = {
    home: {
      title: 'Smart Leader Real Estate - Premium Properties in Egypt',
      description: 'Discover premium real estate properties in Egypt. Luxury apartments, villas, and commercial spaces with Smart Leader Real Estate.',
      keywords: 'real estate, Egypt, luxury properties, apartments, villas, Smart Leader'
    },
    projects: {
      title: 'Our Projects - Smart Leader Real Estate',
      description: 'Explore our portfolio of premium real estate projects across Egypt. Find your dream property today.',
      keywords: 'real estate projects, Egypt properties, Smart Leader projects'
    },
    about: {
      title: 'About Us - Smart Leader Real Estate',
      description: 'Learn about Smart Leader Real Estate, your trusted partner in premium real estate development in Egypt.',
      keywords: 'about Smart Leader, real estate company, Egypt'
    },
    contact: {
      title: 'Contact Us - Smart Leader Real Estate',
      description: 'Get in touch with Smart Leader Real Estate. Contact us for inquiries about our premium properties.',
      keywords: 'contact Smart Leader, real estate inquiry, Egypt'
    }
  }

  return {
    ...seoData[page],
    ...data,
    openGraph: {
      ...seoData[page],
      ...data,
      type: 'website',
      siteName: 'Smart Leader Real Estate'
    }
  }
}


