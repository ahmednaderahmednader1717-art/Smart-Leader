'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Phone, Mail, MessageCircle } from 'lucide-react'

const ContactCTA = () => {
  return (
    <section className="py-20 bg-primary-600 dark:bg-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            هل أنت مستعد للعثور على عقارك المثالي؟
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-12 max-w-3xl mx-auto">
            تواصل مع فريقنا الخبير اليوم. نحن هنا لمساعدتك في العثور على 
            العقار المثالي الذي يلبي احتياجاتك ويتجاوز توقعاتك.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">اتصل بنا</h3>
              <p className="text-blue-100 dark:text-blue-200">+20 123 456 7890</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">راسلنا</h3>
              <p className="text-blue-100 dark:text-blue-200">info@smartleader.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-blue-100 dark:text-blue-200">Available 24/7</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors"
            >
              Contact Us Now
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white dark:border-gray-200 text-white dark:text-gray-200 font-semibold rounded-lg hover:bg-white dark:hover:bg-gray-200 hover:text-blue-600 dark:hover:text-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactCTA
