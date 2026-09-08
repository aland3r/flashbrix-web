import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAuthSessionUser } from '@gestalt/auth'
import {
  checkMilebrickAccess,
  ensureMilebrickAccess,
  getMilebrickSessionUser,
  loginWithGoogle,
  logoutAuth,
  subscribeToMilebrickAuthChanges,
} from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'

const SESSION_EVENTS = new Set(['INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT'])

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  async function syncAccess(sessionUser) {
    if (!sessionUser) {
      setUser(null)
      setHasAccess(false)
      return
    }

    const mapped = await getMilebrickSessionUser()
    setUser(mapped)

    const allowed = await checkMilebrickAccess(sessionUser.id)
    setHasAccess(allowed)
    if (allowed) {
      await ensureMilebrickAccess(sessionUser)
    }
  }

  useEffect(() => {
    let active = true

    if (!isSupabaseConfigured()) {
      setLoading(false)
      return undefined
    }

    const unsubscribe = subscribeToMilebrickAuthChanges(async (_sessionUser, event) => {
      if (!active) return
      try {
        const sessionUser = await getAuthSessionUser()
        await syncAccess(sessionUser)
      } catch {
        setHasAccess(false)
      }
      if (SESSION_EVENTS.has(event)) {
        setLoading(false)
      }
    })

    const timeout = window.setTimeout(() => {
      if (active) setLoading(false)
    }, 8000)

    return () => {
      active = false
      window.clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    hasAccess,
    isAuthenticated: Boolean(user),
    async loginWithGoogle() {
      await loginWithGoogle()
    },
    async logout() {
      await logoutAuth()
      setUser(null)
      setHasAccess(false)
    },
  }), [user, loading, hasAccess])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
