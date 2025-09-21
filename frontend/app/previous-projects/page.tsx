import { Metadata } from 'next'
import PreviousProjectsHero from '@/components/PreviousProjectsHero'
import PreviousProjectsGrid from '@/components/PreviousProjectsGrid'

export const metadata: Metadata = {
  title: 'المشاريع السابقة - Smart Leader',
  description: 'استكشف مشاريعنا العقارية المكتملة في مصر. شاهد محفظتنا من التطويرات الناجحة والعملاء الراضين.',
  openGraph: {
    title: 'المشاريع السابقة - Smart Leader',
    description: 'استكشف مشاريعنا العقارية المكتملة في مصر. شاهد محفظتنا من التطويرات الناجحة والعملاء الراضين.',
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
