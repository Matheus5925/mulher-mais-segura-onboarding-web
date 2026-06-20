import { useState, useEffect } from 'react'
import { auth } from '@/api/tenants'

interface AdminUser { name: string; email: string }

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('onboarding_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, password: string) => {
    const data = await auth.login(email, password)
    localStorage.setItem('onboarding_token', data.accessToken)
    localStorage.setItem('onboarding_user', JSON.stringify({ name: data.name, email: data.email }))
    setUser({ name: data.name, email: data.email })
  }

  const logout = () => {
    localStorage.removeItem('onboarding_token')
    localStorage.removeItem('onboarding_user')
    setUser(null)
  }

  return { user, login, logout, isAuthenticated: !!user }
}
