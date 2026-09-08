import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import SiteFooter from '../components/shell/SiteFooter'
import { fetchDoc, getView, DOCS_REPO } from '../lib/docs'

export default function DocsView() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+/, '')
  const view = getView(slug)
  const docs = useMemo(() => view?.sections.flatMap((section) => section.items) ?? [], [view])
  const firstPath = docs[0]?.path ?? null
  const [activePath, setActivePath] = useState(firstPath)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setActivePath(firstPath)
  }, [firstPath])

  useEffect(() => {
    if (!activePath) return
    let cancelled = false
    setStatus('loading')
    fetchDoc(activePath)
      .then((text) => {
        if (!cancelled) {
          setContent(text)
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [activePath])

  if (!view) return <Navigate to="/" replace />

  return (
    <div className="site-page">
      <SiteHeader activeSlug={slug} />
      <main className="docs-page">
        <p className="eyebrow">{view.eyebrow}</p>
        <h1>{view.label}</h1>
        <p className="muted">{view.blurb}</p>

        {docs.length > 1 ? (
          <nav className="docs-switcher" aria-label="Documents">
            {docs.map((doc) => (
              <button
                key={doc.path}
                type="button"
                className={doc.path === activePath ? 'docs-switcher__item is-active' : 'docs-switcher__item'}
                onClick={() => setActivePath(doc.path)}
              >
                {doc.label}
              </button>
            ))}
          </nav>
        ) : null}

        {status === 'loading' ? <p className="muted">Loading…</p> : null}
        {status === 'error' ? (
          <p className="muted">
            Docs are not published yet. They will load from{' '}
            <a href={`https://github.com/${DOCS_REPO}`}>{DOCS_REPO}</a>.
          </p>
        ) : null}
        {status === 'ready' ? <pre className="docs-body">{content}</pre> : null}
      </main>
      <SiteFooter />
    </div>
  )
}
