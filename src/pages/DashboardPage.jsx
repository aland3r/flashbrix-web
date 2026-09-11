import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BETA_PRICE_LABEL } from '../lib/pix'

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
        Beta: cadastro aberto. Extraia vocabulário do seu interesse — o tracker
        de retenção entra nas próximas entregas.
      </p>
      <p className="home-cta">
        <Link to="/pagar" className="button button--primary">Pagar PIX {BETA_PRICE_LABEL}</Link>
        {' '}
        <Link to="/tutor" className="button">Tutor</Link>
      </p>
      <Link to="/" className="button">Voltar à landing</Link>
    </section>
  )
}
