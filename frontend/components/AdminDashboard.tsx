'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Lightbulb, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  LogOut,
  Settings,
  BarChart3
} from 'lucide-react'
import { authService, projectsService, contactsService, adminService } from '@/lib/firebaseServices'

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAddProject, setShowAddProject] = useState(false)
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

  // Mock authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load data from Firebase
      const [projectsResult, contactsResult, statsResult] = await Promise.allSettled([
        projectsService.getProjects(),
        contactsService.getContacts(),
        adminService.getStats()
      ])

      if (projectsResult.status === 'fulfilled' && projectsResult.value.success) {
        setProjects(projectsResult.value.data)
      }

      if (contactsResult.status === 'fulfilled' && contactsResult.value.success) {
        setContacts(contactsResult.value.data)
      }

      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
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
          views: 150
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
          views: 89
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
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // Use Firebase Authentication
      const result = await authService.adminLogin(email, password)
      
      if (result.success) {
        localStorage.setItem('adminToken', 'firebase-admin-token')
        setIsAuthenticated(true)
        loadDashboardData()
        return
      }

      alert('خطأ في تسجيل الدخول - تحقق من البيانات')
    } catch (error) {
      console.error('Login error:', error)
      alert('خطأ في الاتصال بالخادم')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const project: Project = {
        id: Date.now(),
        ...newProject,
        createdAt: new Date().toISOString(),
        views: 0
      }
      
      setProjects([project, ...projects])
      setStats(prev => ({
        ...prev,
        projects: {
          ...prev.projects,
          total: prev.projects.total + 1,
          available: newProject.status === 'Available' ? prev.projects.available + 1 : prev.projects.available
        }
      }))
      
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
      setShowAddProject(false)
      
      alert('تم إضافة المشروع بنجاح!')
    } catch (error) {
      console.error('Error adding project:', error)
      alert('حدث خطأ في إضافة المشروع')
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

  const deleteProject = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      setProjects(projects.filter(project => project.id !== id))
      setStats(prev => ({
        ...prev,
        projects: {
          ...prev.projects,
          total: prev.projects.total - 1
        }
      }))
      alert('تم حذف المشروع بنجاح!')
    }
  }

  const editProject = (id: number) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setNewProject({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        location: project.location,
        price: project.price,
        area: project.area,
        completionDate: project.completionDate,
        status: project.status,
        specifications: project.specifications,
        features: project.features,
        images: project.images
      })
      setShowAddProject(true)
    }
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
            <p className="text-gray-600">تسجيل الدخول للوحة التحكم</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Smart Leader Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8">
          {[
            { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
            { id: 'projects', label: 'المشاريع', icon: TrendingUp },
            { id: 'contacts', label: 'الرسائل', icon: MessageSquare },
            { id: 'settings', label: 'الإعدادات', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المشاريع</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.projects.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المشاريع المتاحة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.projects.available}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الرسائل</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contacts.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الرسائل الجديدة</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.contacts.new}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">أحدث المشاريع</h2>
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد مشاريع بعد</p>
                ) : (
                  projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.location}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status === 'Available' ? 'متاح' : 'تحت الإنشاء'}
                        </span>
                        <span className="text-sm text-gray-500">{project.views} مشاهدة</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Contacts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">أحدث الرسائل</h2>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد رسائل بعد</p>
                ) : (
                  contacts.slice(0, 3).map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          contact.status === 'New' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {contact.status === 'New' ? 'جديد' : 'تم الرد'}
                        </span>
                        <span className="text-sm text-gray-500">
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
            {/* Add Project Modal */}
            {showAddProject && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">إضافة مشروع جديد</h2>
                    <button 
                      onClick={() => setShowAddProject(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddProject} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عنوان المشروع *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: شقق فاخرة في التجمع الخامس"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الموقع *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.location}
                          onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: التجمع الخامس، القاهرة"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          السعر *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.price}
                          onChange={(e) => setNewProject(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: بداية من 2,500,000 جنيه"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المساحة *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.area}
                          onChange={(e) => setNewProject(prev => ({ ...prev, area: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: 120-200 متر مربع"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تاريخ الإنجاز *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProject.completionDate}
                          onChange={(e) => setNewProject(prev => ({ ...prev, completionDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: Q2 2025"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الحالة
                        </label>
                        <select
                          value={newProject.status}
                          onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                          <option value="Available">متاح</option>
                          <option value="Completed">مكتمل</option>
                          <option value="Under Construction">تحت الإنشاء</option>
                          <option value="Coming Soon">قريباً</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف المختصر *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="وصف مختصر للمشروع..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف التفصيلي *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={newProject.longDescription}
                        onChange={(e) => setNewProject(prev => ({ ...prev, longDescription: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="وصف تفصيلي للمشروع..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد الغرف
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.bedrooms}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, bedrooms: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: 2-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          عدد الحمامات
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.bathrooms}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, bathrooms: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: 2-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          موقف السيارات
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.parking}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, parking: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: 1-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الطابق
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.floor}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, floor: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: 3-15"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          نوع العقار
                        </label>
                        <input
                          type="text"
                          value={newProject.specifications.type}
                          onChange={(e) => setNewProject(prev => ({ 
                            ...prev, 
                            specifications: { ...prev.specifications, type: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="مثال: شقة"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المميزات
                      </label>
                      {newProject.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="مثال: تشطيب فاخر"
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
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        + إضافة ميزة
                      </button>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowAddProject(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        إضافة المشروع
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">قائمة المشاريع</h2>
                <button 
                  onClick={() => setShowAddProject(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>إضافة مشروع</span>
                </button>
              </div>
            
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">العنوان</th>
                      <th className="text-left py-3 px-4">الحالة</th>
                      <th className="text-left py-3 px-4">المشاهدات</th>
                      <th className="text-left py-3 px-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
                          لا توجد مشاريع بعد
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id} className="border-b">
                          <td className="py-3 px-4">{project.title}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'Available' 
                                ? 'bg-green-100 text-green-800' 
                                : project.status === 'Completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status === 'Available' ? 'متاح' : 
                               project.status === 'Completed' ? 'مكتمل' :
                               project.status === 'Under Construction' ? 'تحت الإنشاء' :
                               project.status === 'Coming Soon' ? 'قريباً' : project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{project.views}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => editProject(project.id)}
                                className="text-green-600 hover:text-green-700"
                                title="تعديل"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => deleteProject(project.id)}
                                className="text-red-600 hover:text-red-700"
                                title="حذف"
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
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">إدارة الرسائل</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">الاسم</th>
                    <th className="text-left py-3 px-4">البريد الإلكتروني</th>
                    <th className="text-left py-3 px-4">الحالة</th>
                    <th className="text-left py-3 px-4">التاريخ</th>
                    <th className="text-left py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        لا توجد رسائل بعد
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact.id} className="border-b">
                        <td className="py-3 px-4">{contact.name}</td>
                        <td className="py-3 px-4">{contact.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            contact.status === 'New' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {contact.status === 'New' ? 'جديد' : 'تم الرد'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(contact.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-700">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">إعدادات النظام</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  defaultValue="Smart Leader Real Estate"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  defaultValue="info@smartleader.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  defaultValue="+20 123 456 7890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                حفظ الإعدادات
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard