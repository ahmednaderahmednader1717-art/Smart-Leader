import { Metadata } from 'next'
import ProjectsHero from '@/components/ProjectsHero'
import ProjectsGrid from '@/components/ProjectsGrid'

export const metadata: Metadata = {
  title: 'Current Projects - Smart Leader',
  description: 'Explore our current real estate projects in Egypt. Luxury apartments, villas, and commercial properties available now.',
  openGraph: {
    title: 'Current Projects - Smart Leader',
    description: 'Explore our current real estate projects in Egypt. Luxury apartments, villas, and commercial properties available now.',
  },
}

export default function Projects() {
  return (
    <>
      <ProjectsHero />
      <ProjectsGrid />
    </>
  )
}
