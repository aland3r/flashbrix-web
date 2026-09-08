import { useEffect, useState } from 'react'
import SiteHeader from '../components/shell/SiteHeader'
import SiteFooter from '../components/shell/SiteFooter'
import { fetchFlashbrixUseCases } from '../lib/useCases'

export default function UseCasesView() {
  const [useCases, setUseCases] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetchFlashbrixUseCases('pt')
      .then(({ status: next, useCases: rows }) => {
        if (cancelled) return
        if (next === 'unconfigured') {
          setStatus('unconfigured')
          return
        }
        setUseCases(rows)
        setStatus(rows.length ? 'ready' : 'empty')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="site-page">
      <SiteHeader activeSlug="casos-de-uso" />
      <main className="docs-page">
        <p className="eyebrow">Scenarios</p>
        <h1>Use cases</h1>
        <p className="muted">Black-box use cases — actor, object, and outcome.</p>

        {status === 'loading' ? <p className="muted">Loading…</p> : null}
        {status === 'error' ? <p className="alert">Could not load use cases.</p> : null}
        {status === 'unconfigured' ? (
          <p className="muted">Supabase is not configured in this environment.</p>
        ) : null}
        {status === 'empty' ? <p className="muted">No public use cases yet.</p> : null}
        {status === 'ready' ? (
          <ul className="uc-list">
            {useCases.map((useCase) => (
              <li key={useCase.id} className="uc-list__item">
                <p className="eyebrow">{useCase.short_id}</p>
                <h2>{useCase.title}</h2>
                {useCase.summary ? <p className="muted">{useCase.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  )
}
