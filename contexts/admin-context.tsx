"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminUser {
  id: string
  username: string
  email: string
  role: "admin" | "editor"
}

interface AdminContextType {
  user: AdminUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Demo admin credentials - في الإنتاج استخدم قاعدة بيانات حقيقية
const DEMO_ADMIN = {
  id: "1",
  username: "admin",
  email: "admin@blacksea-star.com",
  role: "admin" as const,
  password: "admin123" // في الإنتاج استخدم hash للباسوورد
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("admin_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("admin_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    
    console.log('Login attempt:', { username, password })
    console.log('Expected:', { username: DEMO_ADMIN.username, password: DEMO_ADMIN.password })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
      console.log('Login successful!')
      const userData = {
        id: DEMO_ADMIN.id,
        username: DEMO_ADMIN.username,
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role
      }
      setUser(userData)
      localStorage.setItem("admin_user", JSON.stringify(userData))
      setLoading(false)
      return true
    }
    
    console.log('Login failed - credentials mismatch')
    setLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("admin_user")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}



