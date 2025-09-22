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
      console.log('Attempting login with:', { email, password: '***' })
      
      // Check for special characters that might cause issues
      if (password.includes('$') || password.includes('&') || password.includes('#')) {
        console.warn('Password contains special characters that might cause issues')
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful:', result.user.email)
      return { success: true, user: result.user }
    } catch (error) {
      console.error('Firebase Auth Error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Email used:', email)
      console.error('Password length:', password.length)
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
    // Any authenticated user from Firebase is considered admin
    // No need to maintain a manual list - all Firebase users are authorized
    console.log('isAdmin check:', { user: user?.email, hasUser: !!user, hasEmail: !!user?.email })
    return user && user.email
  }


  return {
    user,
    loading,
    login,
    logout,
    isAdmin: isAdmin,
    isAuthenticated: !!user
  }
}
