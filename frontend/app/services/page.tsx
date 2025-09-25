import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services - Smart Leader',
  description: 'Our distinguished real estate services'
}

export default function Services() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Real Estate Consultations</h3>
            <p>We provide specialized consultations in the real estate field</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Property Management</h3>
            <p>Comprehensive management services for real estate properties</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Real Estate Valuation</h3>
            <p>Accurate and fair real estate valuation</p>
          </div>
        </div>
      </div>
    </div>
  )
}
