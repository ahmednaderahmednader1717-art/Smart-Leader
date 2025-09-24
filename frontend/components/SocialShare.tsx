'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  image?: string
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description, image }) => {
  const [copied, setCopied] = React.useState(false)

  const shareData = {
    url: url,
    title: title,
    description: description || '',
    image: image || ''
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${title}`)
    const body = encodeURIComponent(`${description}\n\n${url}`)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    window.location.href = emailUrl
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      action: shareToFacebook,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: shareToTwitter,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: shareToLinkedIn,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Email',
      icon: Mail,
      action: shareViaEmail,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyToClipboard,
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Share2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Share This Property
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {shareButtons.map((button, index) => (
          <motion.button
            key={button.name}
            onClick={button.action}
            className={`${button.color} text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button.icon className="h-4 w-4" />
            <span className="text-sm">{button.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SocialShare
