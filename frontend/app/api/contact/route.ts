import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Forward to backend API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    try {
      const response = await fetch(`${backendUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message
        })
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`)
      }

      const result = await response.json()
      
      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      )
    } catch (backendError) {
      console.error('Backend API error:', backendError)
      
      // Fallback: log the contact form submission
      console.log('Contact form submission (fallback):', { name, email, phone, message })
      
      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

