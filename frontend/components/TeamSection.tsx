'use client'

import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'

const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Ahmed Hassan',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'With over 20 years of experience in real estate development, Ahmed leads our vision of creating exceptional properties.',
      linkedin: '#',
      email: 'ahmed@smartleader.com',
    },
    {
      name: 'Sarah Mohamed',
      position: 'Chief Operating Officer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Sarah oversees our operations and ensures that every project meets our high standards of quality and excellence.',
      linkedin: '#',
      email: 'sarah@smartleader.com',
    },
    {
      name: 'Omar Ali',
      position: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Omar brings extensive experience in real estate sales and client relations, helping our clients find their perfect property.',
      linkedin: '#',
      email: 'omar@smartleader.com',
    },
    {
      name: 'Fatma Ibrahim',
      position: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Fatma leads our design team, creating innovative and functional spaces that enhance the living experience.',
      linkedin: '#',
      email: 'fatma@smartleader.com',
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our dedicated team of professionals brings together decades of experience 
            and expertise to deliver exceptional real estate solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                
                <div className="flex space-x-3">
                  <a
                    href={member.linkedin}
                    className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
