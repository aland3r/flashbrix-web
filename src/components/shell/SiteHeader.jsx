import { Link } from 'react-router-dom'
import { siteTabs } from '../../lib/docs'

export default function SiteHeader({ activeSlug = null }) {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        Flashbrix
      </Link>
      <nav className="site-nav" aria-label="Site">
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
      <Link to="/login" className="button button--primary site-header__cta">
        Enter
      </Link>
    </header>
  )
}
