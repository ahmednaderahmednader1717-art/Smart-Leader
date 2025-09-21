import { Metadata } from 'next'
import ContactHero from '@/components/ContactHero'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'

export const metadata: Metadata = {
  title: 'Contact Us - Smart Leader',
  description: 'Get in touch with Smart Leader. Contact our expert team for real estate inquiries, investments, or general information.',
  openGraph: {
    title: 'Contact Us - Smart Leader',
    description: 'Get in touch with Smart Leader. Contact our expert team for real estate inquiries, investments, or general information.',
  },
}

export default function Contact() {
  return (
    <>
      <ContactHero />
      <div className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
    </>
  )
}
