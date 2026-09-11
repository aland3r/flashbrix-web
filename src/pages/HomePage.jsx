import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import { useAuth } from '../context/AuthContext'

const HEADLINE = 'Construa fluência'
const LEAD =
  'Reunimos culturas diversas em torno de temas de interesse mútuo, promovendo intercâmbio linguístico e imersões temáticas adaptadas ao nível da fala, preparando falantes para interações reais. Facilitamos a aquisição de vocabulário e padrões linguísticos para que sejam incorporados a vivências na primeira chance.'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasAccess } = useAuth()
  const next = isAuthenticated && hasAccess ? '/dashboard' : '/login'

  function handleSearch(event) {
    event.preventDefault()
    navigate(next)
  }

  return (
    <div className="site-page site-page--lp">
      <SiteHeader variant="landing" />
      <main className="lp">
        <form className="lp__search" role="search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="lp-search">
            Procure uma palavra
          </label>
          <input
            id="lp-search"
            type="search"
            name="q"
            placeholder="Procure uma palavra."
            autoComplete="off"
          />
        </form>
        <h1 className="lp__headline">{HEADLINE}</h1>
        <p className="lp__lead">{LEAD}</p>
        <div className="lp__cta">
          <Link to={next} className="button button--lp-primary">
            Começar
          </Link>
          <Link to={next} className="button button--lp-ghost">
            Já tenho uma conta
          </Link>
        </div>
      </main>
    </div>
  )
}
