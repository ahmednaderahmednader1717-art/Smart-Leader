import { Metadata } from 'next'
import ProjectsHero from '@/components/ProjectsHero'
import ProjectsGrid from '@/components/ProjectsGrid'

export const metadata: Metadata = {
  title: 'المشاريع الحالية - Smart Leader',
  description: 'استكشف مشاريعنا العقارية الحالية في مصر. شقق فاخرة وفيلات وعقارات تجارية متاحة الآن.',
  openGraph: {
    title: 'المشاريع الحالية - Smart Leader',
    description: 'استكشف مشاريعنا العقارية الحالية في مصر. شقق فاخرة وفيلات وعقارات تجارية متاحة الآن.',
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
