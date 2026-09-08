import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <section className="dashboard-page">
      <header className="dashboard-page__header">
        <div>
          <p className="eyebrow">Flashbrix</p>
          <h1>Olá, {user?.name ?? 'estudante'}.</h1>
        </div>
        <button type="button" className="button" onClick={() => logout()}>Sair</button>
      </header>

      <p className="muted">
        Painel inicial placeholder — práticas e contextos entram nas próximas fases.
      </p>

      <Link to="/" className="button button--primary">Voltar à landing</Link>
    </section>
  )
}
