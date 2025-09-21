import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Leader - دليلك الذكي للنجاح في العقارات',
  description: 'دليلك الذكي للنجاح في العقارات. اكتشف العقارات الاستثنائية التي تجمع بين الفخامة والراحة والمواقع المتميزة في مصر.',
  keywords: 'عقارات, مصر, شقق, فيلات, تجاري, فاخر, smart leader',
  authors: [{ name: 'Smart Leader Real Estate' }],
  openGraph: {
    title: 'Smart Leader - دليلك الذكي للنجاح في العقارات',
    description: 'دليلك الذكي للنجاح في العقارات. اكتشف العقارات الاستثنائية التي تجمع بين الفخامة والراحة والمواقع المتميزة في مصر.',
    url: 'https://smart-leader-real-estate.vercel.app',
    siteName: 'Smart Leader Real Estate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Smart Leader Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Leader - دليلك الذكي للنجاح في العقارات',
    description: 'دليلك الذكي للنجاح في العقارات. اكتشف العقارات الاستثنائية التي تجمع بين الفخامة والراحة والمواقع المتميزة في مصر.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
