'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Users, Star, Award, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

const ContactInfo = () => {
  const [settings, setSettings] = useState({
    companyName: 'Smart Leader Real Estate',
    email: 'info@smartleader.com',
    phone: '+20 123 456 7890',
    location: '123 Business District, New Cairo, Egypt'
  })

  useEffect(() => {
    // Load settings from localStorage on client side
    try {
      const savedSettings = localStorage.getItem('companySettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Failed to load company settings:', error)
    }
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Office Information */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Office Information</h3>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Main Office</h4>
              <p className="text-gray-700 leading-relaxed">
                {settings.location}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Phone Numbers</h4>
              <p className="text-gray-700 leading-relaxed">
                Main: <span className="font-semibold text-primary-600">{settings.phone}</span><br />
                Sales: <span className="font-semibold text-primary-600">{settings.phone}</span><br />
                Support: <span className="font-semibold text-primary-600">{settings.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Email Addresses</h4>
              <p className="text-gray-700 leading-relaxed">
                General: <span className="font-semibold text-primary-600">{settings.email}</span><br />
                Sales: <span className="font-semibold text-primary-600">{settings.email}</span><br />
                Support: <span className="font-semibold text-primary-600">{settings.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Business Hours</h4>
              <p className="text-gray-700 leading-relaxed">
                Monday - Friday: <span className="font-semibold">9:00 AM - 6:00 PM</span><br />
                Saturday: <span className="font-semibold">10:00 AM - 4:00 PM</span><br />
                Sunday: <span className="font-semibold text-red-600">Closed</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Contact</h3>
        </div>
        
        <div className="space-y-4">
          <a
            href="tel:+201234567890"
            className="flex items-center space-x-4 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 border border-primary-200 hover:border-primary-300 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Call Now</div>
              <div className="text-gray-600">Speak with our sales team</div>
            </div>
          </a>

          <a
            href="mailto:info@smartleader.com"
            className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Email Us</div>
              <div className="text-gray-600">Get a detailed response</div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 hover:border-green-300 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Live Chat</div>
              <div className="text-gray-600">Chat with us online</div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:border-purple-300 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">Schedule Visit</div>
              <div className="text-gray-600">Book a property tour</div>
            </div>
          </a>
        </div>
      </div>

      {/* Trust & Awards */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
            <Award className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Why Choose Us</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-300" />
            </div>
            <h4 className="font-bold text-lg mb-2">5-Star Service</h4>
            <p className="text-white/80 text-sm">Rated excellent by 1000+ clients</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-300" />
            </div>
            <h4 className="font-bold text-lg mb-2">Trusted & Secure</h4>
            <p className="text-white/80 text-sm">Licensed and insured company</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-300" />
            </div>
            <h4 className="font-bold text-lg mb-2">Award Winning</h4>
            <p className="text-white/80 text-sm">Best Real Estate 2023</p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Find Us</h3>
        </div>
        <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold mb-2">Interactive Map</p>
            <p className="text-gray-500">123 Business District, New Cairo</p>
            <button className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactInfo
