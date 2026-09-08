import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle, isAuthenticated, hasAccess, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    if (isAuthenticated && hasAccess) {
      navigate('/dashboard', { replace: true })
    } else if (isAuthenticated) {
      navigate('/no-access', { replace: true })
    }
  }, [loading, isAuthenticated, hasAccess, navigate])

  async function handleGoogleLogin() {
    setSubmitting(true)
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar o login com Google.')
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <p className="eyebrow">Flashbrix</p>
      <h1>Entrar</h1>
      <p className="muted">Use Google — se já entrou pelo portfolio, a sessão continua aqui.</p>
      {error ? <p className="alert">{error}</p> : null}
      <button
        type="button"
        className="button button--primary"
        disabled={submitting || loading}
        onClick={handleGoogleLogin}
      >
        {submitting ? 'Redirecionando...' : 'Continuar com Google'}
      </button>
    </section>
  )
}
