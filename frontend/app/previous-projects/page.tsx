import { Metadata } from 'next'
import PreviousProjectsHero from '@/components/PreviousProjectsHero'
import PreviousProjectsGrid from '@/components/PreviousProjectsGrid'

export const metadata: Metadata = {
  title: 'Previous Projects - Smart Leader',
  description: 'Explore our completed real estate projects in Egypt. View our portfolio of successful developments and satisfied clients.',
  openGraph: {
    title: 'Previous Projects - Smart Leader',
    description: 'Explore our completed real estate projects in Egypt. View our portfolio of successful developments and satisfied clients.',
  },
}

export default function PreviousProjects() {
  return (
    <>
      <PreviousProjectsHero />
      <PreviousProjectsGrid />
    </>
  )
}
