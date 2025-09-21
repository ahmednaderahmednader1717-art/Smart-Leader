import { NextRequest, NextResponse } from 'next/server'
import { contactsService } from '@/lib/firebaseServices'

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

    // Submit to Firebase
    const result = await contactsService.submitContact({
      name,
      email,
      phone: phone || null,
      message
    })

    if (result.success) {
      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { message: result.error || 'Failed to submit contact form' },
        { status: 500 }
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

