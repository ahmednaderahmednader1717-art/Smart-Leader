import { Metadata } from 'next'
import ContactHero from '@/components/ContactHero'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'

export const metadata: Metadata = {
  title: 'تواصل معنا - Smart Leader',
  description: 'تواصل مع Smart Leader. اتصل بفريقنا للاستفسارات حول العقارات والاستثمارات أو المعلومات العامة.',
  openGraph: {
    title: 'تواصل معنا - Smart Leader',
    description: 'تواصل مع Smart Leader. اتصل بفريقنا للاستفسارات حول العقارات والاستثمارات أو المعلومات العامة.',
  },
}

export default function Contact() {
  return (
    <>
      <ContactHero />
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
    </>
  )
}
