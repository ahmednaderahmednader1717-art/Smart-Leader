import { Metadata } from 'next'
import AboutHero from '@/components/AboutHero'
import CompanyHistory from '@/components/CompanyHistory'
import TeamSection from '@/components/TeamSection'
import ValuesSection from '@/components/ValuesSection'

export const metadata: Metadata = {
  title: 'About Us - Smart Leader',
  description: 'Learn about Smart Leader - 15+ years of excellence in Egyptian real estate. Our vision, mission, and dedicated team.',
  openGraph: {
    title: 'About Us - Smart Leader',
    description: 'Learn about Smart Leader - 15+ years of excellence in Egyptian real estate. Our vision, mission, and dedicated team.',
  },
}

export default function About() {
  return (
    <>
      <AboutHero />
      <CompanyHistory />
      <ValuesSection />
      <TeamSection />
    </>
  )
}
