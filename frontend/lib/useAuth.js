import { useState, useEffect } from 'react'
import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from './firebase'
import { User } from 'firebase/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Firebase Auth Error:', error)
      return { success: false, error: error.message, code: error.code }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const isAdmin = () => {
    // List of authorized admin emails
    const adminEmails = [
      'admin@smartleader.com',
      'ahmednaderahmednader1717@gmail.com',
      'manager@smartleader.com',
      'support@smartleader.com',
      'test@smartleader.com', // Test user
      'ahmed@smartleader.com', // Add your email here
      'ahmednaderahmednader1717@gmail.com', // Your Firebase email
      'admin@smartleader.com', // Main admin
      'ahmed@smartleader.com', // Alternative admin
      'support@smartleader.com', // Support admin
      'manager@smartleader.com', // Manager admin
      'ahmednaderahmednader1717@gmail.com', // Your Firebase email
      'admin@smartleader.com', // Main admin
      'ahmed@smartleader.com', // Alternative admin
      'support@smartleader.com', // Support admin
      'manager@smartleader.com', // Manager admin
      'test@smartleader.com', // Test user
      'YOUR_FIREBASE_EMAIL@gmail.com', // Replace with your actual Firebase email
      // Add more admin emails here
    ]
    
    return user && user.email && adminEmails.includes(user.email.toLowerCase())
  }

  return {
    user,
    loading,
    login,
    logout,
    isAdmin: isAdmin(),
    isAuthenticated: !!user
  }
}
