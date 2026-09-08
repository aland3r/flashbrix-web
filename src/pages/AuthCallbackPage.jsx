import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArcadeLoadingScreen, isDevQuestEnabled } from '@gestalt/dev-quest'
import { isOAuthReturn } from '../lib/auth'
import { useAuth } from '../context/AuthContext'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasAccess, loading } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthError = params.get('error_description') ?? params.get('error')
    if (oauthError) {
      setError(decodeURIComponent(oauthError.replace(/\+/g, ' ')))
    }
  }, [])

  useEffect(() => {
    if (loading || error) return

    if (isAuthenticated) {
      navigate(hasAccess ? '/dashboard' : '/no-access', { replace: true })
      return
    }

    if (!isOAuthReturn()) {
      navigate('/login', { replace: true })
    }
  }, [error, isAuthenticated, hasAccess, loading, navigate])

  if (error) {
    return (
      <div className="loading-screen">
        <p className="alert">{error}</p>
        <a href="/login">Voltar ao login</a>
      </div>
    )
  }

  return isDevQuestEnabled()
    ? <ArcadeLoadingScreen label="OAUTH" />
    : (
      <div className="loading-screen">
        <p>Concluindo login...</p>
      </div>
    )
}
