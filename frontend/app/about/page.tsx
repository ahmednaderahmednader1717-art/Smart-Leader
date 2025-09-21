import { Metadata } from 'next'
import AboutHero from '@/components/AboutHero'
import CompanyHistory from '@/components/CompanyHistory'
import TeamSection from '@/components/TeamSection'
import ValuesSection from '@/components/ValuesSection'

export const metadata: Metadata = {
  title: 'من نحن - Smart Leader',
  description: 'تعرف على Smart Leader - 15+ سنة من التميز في العقارات المصرية. رؤيتنا ورسالتنا وفريقنا المتفاني.',
  openGraph: {
    title: 'من نحن - Smart Leader',
    description: 'تعرف على Smart Leader - 15+ سنة من التميز في العقارات المصرية. رؤيتنا ورسالتنا وفريقنا المتفاني.',
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
