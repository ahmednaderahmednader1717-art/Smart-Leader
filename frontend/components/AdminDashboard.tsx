'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Settings,
  BarChart3,
  X,
  Info,
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Activity,
  Zap,
  Target,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { authService, projectsService, contactsService, adminService } from '@/lib/firebaseServices'
import { useAuth } from '@/lib/useAuth'
import { useToastContext } from './ToastProvider'
import { useSettings } from '@/lib/settingsContext'
import ImageUpload from './ImageUpload'
import ProjectCharts from './ProjectCharts'

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

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  message: string
  status: string
  createdAt: string
}

const AdminDashboard = () => {
  const { success, error, warning, info } = useToastContext()
  const { user, loading, login, logout, isAdmin, isAuthenticated } = useAuth()
  const { settings, updateSettings, isOnline } = useSettings()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    longDescription: '',
    location: '',
    price: '',
    area: '',
    completionDate: '',
    status: 'Available',
    specifications: {
      bedrooms: '',
      bathrooms: '',
      parking: '',
      floor: '',
      type: ''
    },
    features: [] as string[],
    images: [] as string[]
  })
  const [stats, setStats] = useState({
    projects: { total: 0, available: 0, completed: 0, featured: 0 },
    contacts: { total: 0, new: 0, resolved: 0 }
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)

  // Load dashboard data when authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      loadDashboardData()
    }
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefreshEnabled || !isAuthenticated || !isAdmin()) return

    const interval = setInterval(() => {
      loadDashboardData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefreshEnabled, isAuthenticated])

  const loadDashboardData = async () => {
    setIsRefreshing(true)
    try {
      // Load data from Firebase
      const [projectsResult, contactsResult, statsResult] = await Promise.allSettled([
        projectsService.getProjects(),
        contactsService.getContacts(),
        adminService.getStats()
      ])

      if (projectsResult.status === 'fulfilled' && projectsResult.value.success && projectsResult.value.data) {
        setProjects(projectsResult.value.data)
      }

      if (contactsResult.status === 'fulfilled' && contactsResult.value.success && contactsResult.value.data) {
        setContacts(contactsResult.value.data)
      }

      if (statsResult.status === 'fulfilled' && statsResult.value.success && statsResult.value.data) {
        setStats(statsResult.value.data)
      }
    } catch (error) {
      console.log('API not available, using mock data')
      
      // Fallback: Mock data
      const mockProjects: Project[] = [
        {
          id: 1,
          title: 'شقق فاخرة في التجمع الخامس',
          description: 'شقق فاخرة مع إطلالة رائعة',
          longDescription: 'وصف تفصيلي للمشروع...',
          location: 'التجمع الخامس، القاهرة',
          price: 'بداية من 2,500,000 جنيه',
          area: '120-200 متر مربع',
          completionDate: 'Q2 2025',
          status: 'Available',
          specifications: {
            bedrooms: '2-3',
            bathrooms: '2-3',
            parking: '1-2',
            floor: '3-15',
            type: 'شقة'
          },
          features: ['تشطيب فاخر', 'إطلالة رائعة'],
          images: [],
          createdAt: new Date().toISOString(),
          views: 150,
          rating: {
            average: 4.5,
            count: 23
          }
        },
        {
          id: 2,
          title: 'فيلات في الشروق',
          description: 'فيلات فاخرة في الشروق',
          longDescription: 'وصف تفصيلي للمشروع...',
          location: 'الشروق، القاهرة',
          price: 'بداية من 5,000,000 جنيه',
          area: '300-500 متر مربع',
          completionDate: 'Q3 2025',
          status: 'Under Construction',
          specifications: {
            bedrooms: '4-5',
            bathrooms: '4-5',
            parking: '2-3',
            floor: 'أرضي + 2',
            type: 'فيلا'
          },
          features: ['حديقة خاصة', 'مسبح'],
          images: [],
          createdAt: new Date().toISOString(),
          views: 89,
          rating: {
            average: 4.8,
            count: 15
          }
        }
      ]

      const mockContacts: Contact[] = [
        {
          id: 1,
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+20 123 456 7890',
          message: 'أريد الاستفسار عن الشقق المتاحة',
          status: 'New',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'فاطمة علي',
          email: 'fatma@example.com',
          phone: '+20 987 654 3210',
          message: 'متى سيكون المشروع جاهز؟',
          status: 'Resolved',
          createdAt: new Date().toISOString()
        }
      ]

      setProjects(mockProjects)
      setContacts(mockContacts)
      setStats({
        projects: { total: 2, available: 1, completed: 0, featured: 0 },
        contacts: { total: 2, new: 1, resolved: 1 }
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // Use Firebase Authentication
      const result = await login(email, password)
      
      if (result.success) {
        // Wait a bit for the user state to update
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('Login successful, checking admin access:', {
          user: result.user?.email,
          isAdmin: isAdmin(),
          isAuthenticated: isAuthenticated
        })
        
        // For now, allow any successful login
        if (result.user) {
          success('Welcome!', `Successfully logged in as ${result.user.email}`)
          loadDashboardData()
        } else {
          console.log('Access denied - no user found')
          error('Access Denied', 'No user found after login')
          await logout()
        }
      } else {
        // Handle specific Firebase errors
        console.log('Login Error Details:', result)
        console.log('Error code:', result.code)
        console.log('Error message:', result.error)
        
        if (result.code === 'auth/invalid-credential') {
          error('Invalid Credentials', 'Email or password is incorrect. Please check your credentials and make sure the user exists in Firebase. Note: Special characters like $, &, # in passwords might cause issues.')
        } else if (result.code === 'auth/user-not-found') {
          error('User Not Found', 'No account found with this email address. Please add the user in Firebase Console first.')
        } else if (result.code === 'auth/wrong-password') {
          error('Wrong Password', 'The password is incorrect. Please check the password in Firebase Console.')
        } else if (result.code === 'auth/too-many-requests') {
          error('Too Many Attempts', 'Too many failed login attempts. Please try again later.')
        } else if (result.code === 'auth/invalid-email') {
          error('Invalid Email', 'Please enter a valid email address.')
        } else if (result.code === 'auth/user-disabled') {
          error('Account Disabled', 'This account has been disabled.')
        } else if (result.code === 'auth/operation-not-allowed') {
          error('Operation Not Allowed', 'Email/Password authentication is not enabled. Please enable it in Firebase Console.')
        } else {
          error('Login Error', result.error || 'Please check your credentials')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      error('Connection Error', 'Please check your internet connection')
    }
  }


  const handleLogout = async () => {
    try {
      await logout()
      success('Logged Out', 'You have been successfully logged out')
    } catch (err) {
      console.error('Logout error:', err)
      error('Logout Error', 'Failed to log out')
    }
  }



  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Check if images array is too large
      const totalImageSize = newProject.images.reduce((total, image) => {
        return total + (image.length * 0.75) // Approximate base64 to bytes conversion
      }, 0)
      
      if (totalImageSize > 5 * 1024 * 1024) { // 5MB limit
        error('Images Too Large', 'Total image size exceeds 5MB. Please reduce image sizes or remove some images.')
        return
      }
      
      let result
      
      if (editingProjectId) {
        // Update existing project
        result = await projectsService.updateProject(editingProjectId, {
          ...newProject,
          views: 0
        })
      } else {
        // Create new project
        result = await projectsService.createProject({
          ...newProject,
          views: 0
        })
      }
      
      if (result.success) {
        // Reload projects from Firebase
        await loadDashboardData()
        
        // Reset form
        setNewProject({
          title: '',
          description: '',
          longDescription: '',
          location: '',
          price: '',
          area: '',
          completionDate: '',
          status: 'Available',
          specifications: {
            bedrooms: '',
            bathrooms: '',
            parking: '',
            floor: '',
            type: ''
          },
          features: [],
          images: []
        })
        setEditingProjectId(null)
        setShowAddProject(false)
        
        success(editingProjectId ? 'Project Updated Successfully!' : 'Project Added Successfully!', 'Changes saved to database')
        
        // Auto-refresh after successful operation
        setTimeout(() => {
          loadDashboardData()
        }, 1000)
      } else {
        error('Operation Failed', result.error || 'An unexpected error occurred')
      }
    } catch (err) {
      console.error('Error:', err)
      if (err instanceof Error && err.message.includes('size')) {
        error('Data Too Large', 'The project data is too large. Please reduce image sizes or remove some images.')
      } else {
        error('Operation Error', 'Please try again')
      }
    }
  }


  const addFeature = () => {
    setNewProject(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setNewProject(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const deleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const result = await projectsService.deleteProject(id)
        if (result.success) {
          // Reload projects from Firebase
          await loadDashboardData()
          success('Project Deleted Successfully!', 'Project removed from database')
          
          // Auto-refresh after successful operation
          setTimeout(() => {
            loadDashboardData()
          }, 1000)
        } else {
          error('Delete Failed', result.error || 'An unexpected error occurred')
        }
      } catch (err) {
        console.error('Error deleting project:', err)
        error('Delete Error', 'Please try again')
      }
    }
  }

  const editProject = (id: number) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setNewProject({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription || '',
        location: project.location,
        price: project.price,
        area: project.area,
        completionDate: project.completionDate,
        status: project.status,
        specifications: project.specifications,
        features: project.features,
        images: project.images
      })
      setEditingProjectId(id)
      setShowAddProject(true)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update settings using the context
      await updateSettings(settings)
      success('Settings Saved Successfully!', 'System settings updated and will be applied across the site')
      console.log('Settings saved:', settings)
      
      // Auto-refresh after successful operation
      setTimeout(() => {
        loadDashboardData()
      }, 1000)
    } catch (err) {
      error('Save Failed', 'Failed to save settings. Please try again.')
    }
  }

  const handleSettingsChange = (field: string, value: string) => {
    updateSettings({ [field]: value })
  }

  // Contact management functions
  const viewContact = (id: number) => {
    const contact = contacts.find(c => c.id === id)
    if (contact) {
      setSelectedContact(contact)
      setShowMessageModal(true)
    }
  }

  // Function to format phone number with country code
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    
    // If phone starts with 20 (Egypt country code), return as is
    if (cleanPhone.startsWith('20')) {
      return cleanPhone
    }
    
    // If phone starts with 0, replace with 20 (Egypt country code)
    if (cleanPhone.startsWith('0')) {
      return '20' + cleanPhone.substring(1)
    }
    
    // If phone doesn't start with country code, add Egypt code (20)
    if (cleanPhone.length >= 10 && !cleanPhone.startsWith('20')) {
      return '20' + cleanPhone
    }
    
    // Return as is if already formatted
    return cleanPhone
  }

  // Function to get email provider and create appropriate link
  const getEmailLink = (email: string, name: string) => {
    const emailDomain = email.split('@')[1]?.toLowerCase()
    
    // Create simple email template
    const createEmailBody = (name: string) => {
      return `Dear ${name},

Thank you for contacting Smart Leader Real Estate.

We have received your message and will get back to you soon.

Best regards,
Smart Leader Team`
    }
    
    // Gmail
    if (emailDomain === 'gmail.com') {
      return {
        href: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Re: Your Inquiry&body=${encodeURIComponent(createEmailBody(name))}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Open Gmail to send email to ${email}`,
        icon: 'gmail'
      }
    }
    
    // Outlook/Hotmail
    if (emailDomain === 'outlook.com' || emailDomain === 'hotmail.com' || emailDomain === 'live.com') {
      return {
        href: `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodeURIComponent('Re: Your Inquiry')}&body=${encodeURIComponent(createEmailBody(name))}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Open Outlook to send email to ${email}`,
        icon: 'outlook'
      }
    }
    
    // Yahoo
    if (emailDomain === 'yahoo.com' || emailDomain === 'yahoo.co.uk' || emailDomain === 'ymail.com') {
      return {
        href: `https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent('Re: Your Inquiry')}&body=${encodeURIComponent(createEmailBody(name))}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Open Yahoo Mail to send email to ${email}`,
        icon: 'yahoo'
      }
    }
    
    // Default mailto for other providers
    return {
      href: `mailto:${email}?subject=Re: Your Inquiry&body=${encodeURIComponent(createEmailBody(name))}`,
      target: '_self',
      rel: '',
      title: `Send email to ${email}`,
      icon: 'email'
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const result = await contactsService.updateContactStatus(id, 'Read')
      if (result.success) {
        await loadDashboardData() // Reload contacts
        success('Status Updated!', 'Contact marked as read')
        
        // Auto-refresh after successful operation
        setTimeout(() => {
          loadDashboardData()
        }, 1000)
      } else {
        error('Update Failed', result.error || 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating contact status:', err)
      error('Update Error', 'Please try again')
    }
  }

  const deleteContact = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact message?')) {
      try {
        const result = await contactsService.deleteContact(id)
        if (result.success) {
          await loadDashboardData() // Reload contacts
          success('Contact Deleted!', 'Contact message removed')
          
          // Auto-refresh after successful operation
          setTimeout(() => {
            loadDashboardData()
          }, 1000)
        } else {
          error('Delete Failed', result.error || 'Failed to delete contact')
        }
      } catch (err) {
        console.error('Error deleting contact:', err)
        error('Delete Error', 'Please try again')
      }
    }
  }

  // Enhanced filtering and sorting functions
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'views':
        return b.views - a.views
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Export functions
  const exportProjects = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Title,Location,Price,Status,Views,Created\n" +
      filteredProjects.map(p => 
        `"${p.title}","${p.location}","${p.price}","${p.status}",${p.views},"${new Date(p.createdAt).toLocaleDateString()}"`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "projects.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('Export Successful!', 'Projects data exported to CSV')
  }

  const exportContacts = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Status,Message,Created\n" +
      filteredContacts.map(c => 
        `"${c.name}","${c.email}","${c.phone}","${c.status}","${c.message.replace(/"/g, '""')}","${new Date(c.createdAt).toLocaleDateString()}"`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "contacts.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('Export Successful!', 'Contacts data exported to CSV')
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Smart Leader</h1>
            <p className="text-gray-600">Admin Dashboard Login</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="admin@smartleader.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  Smart Leader Dashboard
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Admin Panel
                  </p>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} 
                       title={isOnline ? 'Connected to Firebase' : 'Offline Mode'} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Auto-refresh Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 rounded-md transition-colors ${
                  autoRefreshEnabled 
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={autoRefreshEnabled ? 'Auto-refresh enabled (30s)' : 'Auto-refresh disabled'}
              >
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">
                  {autoRefreshEnabled ? 'Auto ON' : 'Auto OFF'}
                </span>
              </motion.button>

              {/* Manual Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadDashboardData}
                disabled={isRefreshing}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                title="Manual Refresh"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                  <span className="hidden sm:inline">Notifications</span>
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50"
                    >
                      <div className="p-4 border-b dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification, index) => (
                            <div key={index} className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <p className="text-sm text-gray-900 dark:text-white">{notification}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'projects', label: 'Projects', icon: TrendingUp },
            { id: 'contacts', label: 'Messages', icon: MessageSquare },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Auto-refresh Status */}
            {autoRefreshEnabled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Auto-refresh enabled - Data updates every 30 seconds
                  </span>
                </div>
              </motion.div>
            )}
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">Total Projects</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.projects.total}</p>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 ml-1">+12%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">Available Projects</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.projects.available}</p>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 ml-1">+8%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">Total Messages</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.contacts.total}</p>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500 ml-1">+25%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">New Messages</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.contacts.new}</p>
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-500 ml-1">+5%</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h2>
              <div className="space-y-3 sm:space-y-4">
                {projects.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No projects yet</p>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-2 sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{project.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{project.location}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          project.status === 'Available' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        }`}>
                          {project.status === 'Available' ? 'Available' : 'Under Construction'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{project.views} views</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Analytics Charts */}
            <ProjectCharts projects={projects} />

            {/* Recent Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h2>
              <div className="space-y-3 sm:space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No messages yet</p>
                ) : (
                  contacts.slice(0, 3).map((contact) => (
                    <div key={contact.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg space-y-2 sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{contact.email}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          contact.status === 'New' 
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' 
                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        }`}>
                          {contact.status === 'New' ? 'New' : 'Replied'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Enhanced Projects Header with Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Projects Management</h2>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-64"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="views">Most Views</option>
                    <option value="title">Title A-Z</option>
                  </select>

                  {/* Export Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportProjects}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </motion.button>

                  {/* Add Project Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddProject(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Project</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Add Project Modal */}
            {showAddProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {editingProjectId ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button 
                      onClick={() => {
                        setShowAddProject(false)
                        setEditingProjectId(null)
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddProject} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., Luxury Apartments in New Cairo"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.location}
                          onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., New Cairo, Cairo"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.price}
                          onChange={(e) => setNewProject(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., Starting from 2,500,000 EGP"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.area}
                          onChange={(e) => setNewProject(prev => ({ ...prev, area: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 120-200 sqm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Completion Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.completionDate}
                          onChange={(e) => setNewProject(prev => ({ ...prev, completionDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., Q2 2025"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={newProject.status}
                          onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Available">Available</option>
                          <option value="Under Construction">Under Construction</option>
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Sold Out">Sold Out</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief project description..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Detailed Description *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={newProject.longDescription}
                        onChange={(e) => setNewProject(prev => ({ ...prev, longDescription: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Detailed project description..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bedrooms
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.bedrooms}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, bedrooms: e.target.value }
                          }))}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                          placeholder="e.g., 2-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bathrooms
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.bathrooms}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, bathrooms: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 2-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parking
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.parking}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, parking: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 1-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Floor
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.floor}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, floor: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 3-15"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Property Type
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.type}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, type: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., Apartment"
                        />
                      </div>
                    </div>
                    
                    <ImageUpload
                      images={newProject.images}
                      onImagesChange={(images) => setNewProject(prev => ({ ...prev, images }))}
                      maxImages={10}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Features *
                      </label>
                      {newProject.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            required
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Luxury finishing"
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        + Add Feature
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProject(false)
                          setEditingProjectId(null)
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                      >
                        {editingProjectId ? 'Update Project' : 'Add Project'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Projects List</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Showing {filteredProjects.length} of {projects.length} projects
                  </p>
                </div>
              </div>
            
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Title</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Views</th>
                      <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          {projects.length === 0 ? 'No projects yet' : 'No projects match your search criteria'}
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{project.title}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'Available' 
                                ? 'bg-green-100 text-green-800' 
                                : project.status === 'Completed'
                                ? 'bg-blue-100 text-blue-800'
                                : project.status === 'Sold Out'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{project.views}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => editProject(project.id)}
                                className="text-green-600 hover:text-green-700"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => deleteProject(project.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {filteredProjects.length === 0 ? (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {projects.length === 0 ? 'No projects yet' : 'No projects match your search criteria'}
                  </p>
                ) : (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">{project.title}</h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Available' 
                              ? 'bg-green-100 text-green-800' 
                              : project.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : project.status === 'Sold Out'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{project.views} views</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editProject(project.id)}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => deleteProject(project.id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Enhanced Contacts Header with Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Message Management</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Showing {filteredContacts.length} of {contacts.length} messages
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full sm:w-64"
                    />
                  </div>

                  {/* Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="New">New Messages</option>
                    <option value="Read">Read Messages</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                  </select>

                  {/* Export Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportContacts}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Name</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {contacts.length === 0 ? 'No messages yet' : 'No messages match your search criteria'}
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b dark:border-gray-700">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{contact.name}</td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">{contact.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            contact.status === 'New' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {contact.status === 'New' ? 'New' : 'Replied'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => viewContact(contact.id)}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Message"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => markAsRead(contact.id)}
                              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title="Mark as Read"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deleteContact(contact.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete Message"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredContacts.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {contacts.length === 0 ? 'No messages yet' : 'No messages match your search criteria'}
                </p>
              ) : (
                filteredContacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{contact.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{contact.email}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'New' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {contact.status === 'New' ? 'New' : 'Replied'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewContact(contact.id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => markAsRead(contact.id)}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Read</span>
                        </button>
                        <button 
                          onClick={() => deleteContact(contact.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </div>
        )}


        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {isOnline ? 'Synced with Firebase' : 'Offline Mode'}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingsChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingsChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Office Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleSettingsChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter office location"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Contact Message Details</h2>
                <button 
                  onClick={() => {
                    setShowMessageModal(false)
                    setSelectedContact(null)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white break-words">
                      {selectedContact.name}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white break-all text-sm">
                      {(() => {
                        const emailLink = getEmailLink(selectedContact.email, selectedContact.name)
                        return (
                          <a 
                            href={emailLink.href}
                            target={emailLink.target}
                            rel={emailLink.rel}
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-2"
                            title={emailLink.title}
                          >
                            <span>{selectedContact.email}</span>
                            {emailLink.icon === 'gmail' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819c.904 0 1.636.732 1.636 1.636z"/>
                              </svg>
                            )}
                            {emailLink.icon === 'outlook' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.462 12.5L2.5 7.538h4.962V12.5zm0-5L2.5 2.538h4.962V7.5zm5 0L7.5 2.538h4.962V7.5zm0 5L7.5 7.538h4.962V12.5zm5 0L12.5 7.538h4.962V12.5zm0-5L12.5 2.538h4.962V7.5z"/>
                              </svg>
                            )}
                            {emailLink.icon === 'yahoo' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                              </svg>
                            )}
                            {emailLink.icon === 'email' && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                              </svg>
                            )}
                          </a>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white break-words">
                      {selectedContact.phone ? (
                        <a 
                          href={`https://wa.me/${formatPhoneForWhatsApp(selectedContact.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 dark:text-green-400 hover:underline flex items-center space-x-2"
                          title={`Open WhatsApp chat with ${formatPhoneForWhatsApp(selectedContact.phone)}`}
                        >
                          <span>{selectedContact.phone}</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not provided</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedContact.status === 'New' 
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {selectedContact.status === 'New' ? 'New Message' : 'Read'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Message Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white min-h-[120px] whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {selectedContact.message}
                  </div>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Received Date
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white break-words">
                    {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    setShowMessageModal(false)
                    setSelectedContact(null)
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
                >
                  Close
                </button>
                {selectedContact.status === 'New' && (
                  <button
                    onClick={() => {
                      markAsRead(selectedContact.id)
                      setShowMessageModal(false)
                      setSelectedContact(null)
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => {
                    deleteContact(selectedContact.id)
                    setShowMessageModal(false)
                    setSelectedContact(null)
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard