import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خدماتنا - Smart Leader',
  description: 'خدماتنا العقارية المتميزة'
}

export default function Services() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">خدماتنا</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">الاستشارات العقارية</h3>
            <p>نقدم استشارات متخصصة في مجال العقارات</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">إدارة الممتلكات</h3>
            <p>خدمات إدارة شاملة للممتلكات العقارية</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">التقييم العقاري</h3>
            <p>تقييم دقيق وعادل للعقارات</p>
          </div>
        </div>
      </div>
    </div>
  )
}
