'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageCircle, Users } from 'lucide-react'

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Office Information */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Office Information</h3>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Main Office</h4>
              <p className="text-gray-600">
                123 Business District<br />
                New Cairo, Egypt 11835
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Phone Numbers</h4>
              <p className="text-gray-600">
                Main: +20 123 456 7890<br />
                Sales: +20 123 456 7891<br />
                Support: +20 123 456 7892
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Email Addresses</h4>
              <p className="text-gray-600">
                General: info@smartleader.com<br />
                Sales: sales@smartleader.com<br />
                Support: support@smartleader.com
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Contact</h3>
        
        <div className="space-y-4">
          <a
            href="tel:+201234567890"
            className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Call Now</div>
              <div className="text-sm text-gray-600">Speak with our sales team</div>
            </div>
          </a>

          <a
            href="mailto:info@smartleader.com"
            className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Email Us</div>
              <div className="text-sm text-gray-600">Get a detailed response</div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Live Chat</div>
              <div className="text-sm text-gray-600">Chat with us online</div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center space-x-4 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Schedule Visit</div>
              <div className="text-sm text-gray-600">Book a property tour</div>
            </div>
          </a>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Find Us</h3>
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Interactive Map</p>
            <p className="text-sm text-gray-400">123 Business District, New Cairo</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactInfo
