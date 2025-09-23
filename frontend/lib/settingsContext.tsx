'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db, doc, setDoc, getDoc, onSnapshot } from '@/lib/firebase'

interface CompanySettings {
  companyName: string
  email: string
  phone: string
  location: string
}

interface SettingsContextType {
  settings: CompanySettings
  updateSettings: (newSettings: Partial<CompanySettings>) => void
  refreshSettings: () => void
  isLoading: boolean
  isOnline: boolean
}

const defaultSettings: CompanySettings = {
  companyName: 'Smart Leader Real Estate',
  email: 'info@smartleader.com',
  phone: '+20 123 456 7890',
  location: '123 Business District, New Cairo, Egypt'
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  // Load settings from Firebase and localStorage
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'company')
    
    // First, try to load from localStorage as fallback
    const loadLocalSettings = () => {
      try {
        const savedSettings = localStorage.getItem('companySettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsedSettings })
        }
      } catch (error) {
        console.error('Failed to load local settings:', error)
      }
    }

    // Load local settings first
    loadLocalSettings()

    // Set up Firebase real-time listener
    const unsubscribe = onSnapshot(
      settingsRef,
      (doc) => {
        if (doc.exists()) {
          const firebaseSettings = doc.data() as CompanySettings
          setSettings({ ...defaultSettings, ...firebaseSettings })
          
          // Update localStorage with Firebase data
          try {
            localStorage.setItem('companySettings', JSON.stringify(firebaseSettings))
          } catch (error) {
            console.error('Failed to update localStorage:', error)
          }
          
          setIsOnline(true)
        } else {
          // Document doesn't exist, create it with default settings
          setDoc(settingsRef, defaultSettings)
            .then(() => {
              console.log('Created default settings in Firebase')
            })
            .catch((error) => {
              console.error('Failed to create default settings:', error)
              setIsOnline(false)
            })
        }
        setIsLoading(false)
      },
      (error) => {
        console.error('Firebase settings error:', error)
        setIsOnline(false)
        setIsLoading(false)
      }
    )

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'companySettings' && e.newValue) {
        try {
          const newSettings = JSON.parse(e.newValue)
          setSettings({ ...defaultSettings, ...newSettings })
        } catch (error) {
          console.error('Failed to parse updated settings:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    
    try {
      // Update localStorage immediately for fast UI response
      localStorage.setItem('companySettings', JSON.stringify(updatedSettings))
      
      // Update Firebase
      const settingsRef = doc(db, 'settings', 'company')
      await setDoc(settingsRef, updatedSettings)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { 
        detail: updatedSettings 
      }))
      
      setIsOnline(true)
    } catch (error) {
      console.error('Failed to save company settings:', error)
      setIsOnline(false)
      
      // Still dispatch event for local updates
      window.dispatchEvent(new CustomEvent('settingsUpdated', { 
        detail: updatedSettings 
      }))
    }
  }

  const refreshSettings = async () => {
    try {
      // Try to get fresh data from Firebase
      const settingsRef = doc(db, 'settings', 'company')
      const docSnap = await getDoc(settingsRef)
      
      if (docSnap.exists()) {
        const firebaseSettings = docSnap.data() as CompanySettings
        setSettings({ ...defaultSettings, ...firebaseSettings })
        
        // Update localStorage
        localStorage.setItem('companySettings', JSON.stringify(firebaseSettings))
        setIsOnline(true)
      } else {
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('companySettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsedSettings })
        }
      }
    } catch (error) {
      console.error('Failed to refresh company settings:', error)
      setIsOnline(false)
      
      // Fallback to localStorage
      try {
        const savedSettings = localStorage.getItem('companySettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsedSettings })
        }
      } catch (localError) {
        console.error('Failed to load local settings:', localError)
      }
    }
  }

  const value: SettingsContextType = {
    settings,
    updateSettings,
    refreshSettings,
    isLoading,
    isOnline
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
