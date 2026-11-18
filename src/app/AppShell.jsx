import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import isotypeUrl from '../assets/brand/flashbrix-isotype-light.svg'
import wordmarkUrl from '../assets/brand/flashbrix-wordmark.svg'

export default function AppShell({ children, wide = false, classMode = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    if (q.trim()) navigate(`/app/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className={`fx ${classMode ? 'fx--class' : ''}`}>
      <header className="fx-bar">
        <Link to="/app" className="fx-bar__brand">
          <img src={isotypeUrl} alt="" width="40" height="40" />
          <img src={wordmarkUrl} alt="Flashbrix" width="104" height="20" />
        </Link>
        <form className="fx-bar__search" onSubmit={submit} role="search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar vocabulário"
            aria-label="Buscar vocabulário"
          />
        </form>
        <nav className="fx-bar__nav">
          <NavLink to="/app" end>Início</NavLink>
          <NavLink to="/app/lexicon">Léxico</NavLink>
          <button type="button" className="fx-link" onClick={() => logout().then(() => navigate('/'))} title={user?.email}>
            Sair
          </button>
        </nav>
      </header>
      <main className={wide ? 'fx-main fx-main--wide' : 'fx-main'}>{children}</main>
    </div>
  )
}
