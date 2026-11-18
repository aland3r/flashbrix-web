import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import isotypeUrl from '../assets/brand/flashbrix-isotype-light.svg'
import wordmarkUrl from '../assets/brand/flashbrix-wordmark.svg'
import emailIconUrl from './login-assets/email-icon.svg'

// Login screen from Figma "Login" section (node 307:3047, frames 307:3048 desktop and 457:3158 mobile).
export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle, isAuthenticated, loading } = useAuth()
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('Enviaremos um link de acesso para o seu e-mail.')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/app', { replace: true })
  }, [loading, isAuthenticated, navigate])

  async function google() {
    setBusy(true)
    setError(false)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(true)
      setStatus(err instanceof Error ? err.message : 'Não foi possível entrar com Google.')
      setBusy(false)
    }
  }

  async function sendLink(e) {
    e.preventDefault()
    if (!email.trim()) return
    setBusy(true)
    setError(false)
    const { error: err } = await getSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setBusy(false)
    if (err) {
      setError(true)
      setStatus('Este e-mail ainda não foi convidado. Fale com o seu tutor.')
    } else {
      setStatus('Pronto! Abra o link que enviamos para o seu e-mail.')
    }
  }

  return (
    <div className="fx-login">
      <header className="fx-login__top">
        <div className="fx-login__logo" role="img" aria-label="Flashbrix">
          <img src={isotypeUrl} alt="" width="72" height="72" />
          <img src={wordmarkUrl} alt="" width="171" height="33" />
        </div>
      </header>
      <main className="fx-login__stage">
        <div className="fx-login__shadow" aria-hidden="true"><span /></div>
        <section className="fx-login__card" aria-label="Entrar no Flashbrix">
          <div className="fx-login__form">
            <button type="button" className="fx-login__google" onClick={google} disabled={busy || loading}>
              <span className="fx-login__google-mark">
                <svg width="18" height="19" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                </svg>
              </span>
              <span className="fx-login__google-label">Continuar com Google</span>
            </button>
            <p className="fx-login__hint">Ou entre com o e-mail que o seu tutor convidou</p>
            <form className="fx-login__email-form" onSubmit={sendLink}>
              <label className="fx-login__email">
                <span className="fx-login__email-icon"><img src={emailIconUrl} alt="" width="18" height="12" /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@exemplo.com"
                  aria-label="E-mail"
                  autoComplete="email"
                />
              </label>
              <p className={`fx-login__hint${error ? ' fx-login__hint--error' : ''}`} role="status">{status}</p>
              <button type="submit" className="fx-login__submit" disabled={busy || loading}>Continuar</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
