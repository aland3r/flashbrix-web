import { Link } from 'react-router-dom'
import { siteTabs } from '../../lib/docs'
import { useAuth } from '../../context/AuthContext'

function BrandMark({ landing = false }) {
  return (
    <Link
      to="/"
      className={landing ? 'site-header__brand site-header__brand--lp' : 'site-header__brand'}
    >
      <img
        src="/brand/flashbrix-mark.svg"
        alt=""
        width={landing ? 55 : 28}
        height={landing ? 69 : 35}
        className="site-header__mark"
      />
      Flashbrix
    </Link>
  )
}

export default function SiteHeader({ activeSlug = null, variant = 'site' }) {
  const { isAuthenticated, hasAccess } = useAuth()
  const inApp = isAuthenticated && hasAccess
  const landing = variant === 'landing'

  return (
    <header className={landing ? 'site-header site-header--landing' : 'site-header'}>
      <BrandMark landing={landing} />
      {landing ? null : (
        <>
          <nav className="site-nav" aria-label="Site">
            <Link to="/tutor" className="site-nav__link">Tutor</Link>
            <Link to="/pagar" className="site-nav__link">Pagar</Link>
            {siteTabs.map((tab) => {
              const isActive = tab.slug === activeSlug
              return (
                <Link
                  key={tab.slug}
                  to={`/${tab.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={isActive ? 'site-nav__link is-active' : 'site-nav__link'}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
          {inApp ? (
            <Link to="/dashboard" className="button button--primary site-header__cta">
              App
            </Link>
          ) : (
            <Link to="/login" className="button button--primary site-header__cta">
              Cadastrar
            </Link>
          )}
        </>
      )}
    </header>
  )
}
