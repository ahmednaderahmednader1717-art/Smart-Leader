'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Target, Eye, Users, Award } from 'lucide-react'

const AboutPreview = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To deliver exceptional real estate solutions that exceed expectations and create lasting value for our clients.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading real estate company in Egypt, recognized for innovation, quality, and customer satisfaction.',
    },
    {
      icon: Users,
      title: 'Our Values',
      description: 'Integrity, excellence, and customer-centricity guide everything we do in the real estate industry.',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                من نحن - Smart Leader
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                مع أكثر من 15 عاماً من الخبرة في السوق العقاري المصري، 
                أصبح Smart Leader اسماً موثوقاً في تطوير العقارات المتميزة. 
                نتخصص في إنشاء مساحات معيشية وتجارية استثنائية تجمع بين 
                التصميم العصري والوظائف العملية.
              </p>
              <p className="text-gray-600 leading-relaxed">
                التزامنا بالجودة والابتكار ورضا العملاء جعلنا 
                الخيار المفضل للعملاء المميزين الذين يبحثون عن أفضل العقارات في مصر.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors group"
            >
              تعرف علينا أكثر
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="About Qawafil Real Estate"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
