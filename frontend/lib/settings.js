// Company Settings Management
export const getCompanySettings = () => {
  // Always return default settings for server-side rendering
  return {
    companyName: 'Smart Leader Real Estate',
    email: 'info@smartleader.com',
    phone: '+20 123 456 7890',
    location: '123 Business District, New Cairo, Egypt'
  };
};

export const updateCompanySettings = (newSettings) => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    localStorage.setItem('companySettings', JSON.stringify(newSettings));
    return true;
  } catch (error) {
    console.error('Failed to save company settings:', error);
    return false;
  }
};
