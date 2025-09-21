import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ToastProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Leader - Your Smart Guide to Real Estate Success',
  description: 'Your smart guide to real estate success. Discover exceptional properties that combine luxury, comfort, and prime locations in Egypt.',
  keywords: 'real estate, egypt, apartments, villas, commercial, luxury, smart leader',
  authors: [{ name: 'Smart Leader Real Estate' }],
  openGraph: {
    title: 'Smart Leader - Your Smart Guide to Real Estate Success',
    description: 'Your smart guide to real estate success. Discover exceptional properties that combine luxury, comfort, and prime locations in Egypt.',
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
    title: 'Smart Leader - Your Smart Guide to Real Estate Success',
    description: 'Your smart guide to real estate success. Discover exceptional properties that combine luxury, comfort, and prime locations in Egypt.',
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
        <ThemeProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
