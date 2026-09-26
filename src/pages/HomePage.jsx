import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import { useAuth } from '../context/AuthContext'

const HEADLINE = 'Construa fluência a partir de material autêntico'
const LEAD =
  'Reunimos diversas culturas em torno de temas de interesse mútuo, promovendo diálogos e imersões adaptadas à compreensão do idioma. Reforçamos vocabulário para que seja incorporado a vivências na primeira oportunidade.'
const BAND =
  'Primeiro construir a fluência que só você precisa ou começar entre amigos?'

const LANGS = [
  { id: 'pt', name: 'Português', src: '/brand/flags/pt.svg' },
  { id: 'es', name: 'Espanhol', src: '/brand/flags/es.svg' },
  { id: 'it', name: 'Italiano', src: '/brand/flags/it.svg' },
  { id: 'fr', name: 'Francês', kind: 'tricolor-v', colors: ['#009fd9', '#fff', '#df6e74'] },
  { id: 'de', name: 'Alemão', kind: 'tricolor-h', colors: ['#1a1a1a', '#dd0000', '#ffce00'] },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasAccess } = useAuth()
  const start = isAuthenticated && hasAccess ? '/dashboard' : '/login'

  function handleSearch(event) {
    event.preventDefault()
    navigate(start)
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
            placeholder="Procure uma palavra"
            autoComplete="off"
          />
        </form>

        <section className="lp__hero">
          <h1 className="lp__headline">{HEADLINE}</h1>
          <div className="lp__split">
            <p className="lp__lead">{LEAD}</p>
            <div className="lp__cta">
              <Link to={start} className="button button--lp-primary">
                Começar
              </Link>
              <Link to="/login" className="button button--lp-ghost">
                Já tenho uma conta
              </Link>
            </div>
          </div>
        </section>

        <ul className="lp__langs" aria-label="Idiomas">
          {LANGS.map((lang) => (
            <li key={lang.id} className="lp__lang">
              {lang.src ? (
                <img src={lang.src} alt="" width={106} height={66} className="lp__flag" />
              ) : (
                <span
                  className={
                    lang.kind === 'tricolor-h' ? 'lp__flag lp__flag--h' : 'lp__flag lp__flag--v'
                  }
                  aria-hidden="true"
                >
                  {lang.colors.map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </span>
              )}
              <span>{lang.name}</span>
            </li>
          ))}
        </ul>

        <section className="lp__band">
          <h2 className="lp__band-title">{BAND}</h2>
          <Link to={start} className="button button--lp-primary lp__band-cta">
            Cadastrar
          </Link>
        </section>
      </main>
    </div>
  )
}
