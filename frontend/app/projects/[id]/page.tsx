import { Metadata } from 'next'
import ProjectDetail from '@/components/ProjectDetail'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // In a real app, you would fetch project data here
  const projectTitle = `Project ${params.id} - Smart Leader`
  
  return {
    title: projectTitle,
    description: 'عرض معلومات مفصلة عن هذا المشروع العقاري المتميز.',
    openGraph: {
      title: projectTitle,
      description: 'عرض معلومات مفصلة عن هذا المشروع العقاري المتميز.',
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetail projectId={params.id} />
}
