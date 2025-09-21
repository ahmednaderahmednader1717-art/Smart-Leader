import Link from 'next/link'
import { Lightbulb, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-blue-400 dark:text-blue-300" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">SMART</span>
                <span className="text-xl font-bold -mt-1">LEADER</span>
              </div>
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
              Your smart guide to real estate success. We provide you with the best real estate services 
              with unmatched quality throughout Egypt.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                  Current Projects
                </Link>
              </li>
              <li>
                <Link href="/previous-projects" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                  Previous Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 dark:text-gray-400 text-sm">Residential Properties</li>
              <li className="text-gray-300 dark:text-gray-400 text-sm">Commercial Properties</li>
              <li className="text-gray-300 dark:text-gray-400 text-sm">Investment Opportunities</li>
              <li className="text-gray-300 dark:text-gray-400 text-sm">Property Management</li>
              <li className="text-gray-300 dark:text-gray-400 text-sm">Consultation Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 dark:text-primary-300 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 dark:text-gray-400 text-sm">
                  123 Business District, New Cairo, Egypt
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 dark:text-primary-300 flex-shrink-0" />
                <p className="text-gray-300 dark:text-gray-400 text-sm">+20 123 456 7890</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 dark:text-primary-300 flex-shrink-0" />
                <p className="text-gray-300 dark:text-gray-400 text-sm">info@smartleader.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © 2024 Smart Leader Real Estate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-primary-400 dark:hover:text-primary-300 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
