import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import SiteFooter from '../components/shell/SiteFooter'
import { fetchProductStatements } from '../lib/statements'

const PRODUCT_CODE = 'milebrick'
const LANG = 'pt'

export default function HomePage() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })

  useEffect(() => {
    let active = true
    fetchProductStatements(PRODUCT_CODE, LANG)
      .then((data) => {
        if (active) setState({ status: 'ready', data, error: null })
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error: error.message })
      })
    return () => {
      active = false
    }
  }, [])

  const { status, data, error } = state

  return (
    <div className="site-page">
      <SiteHeader activeSlug={null} />
      <main className="home">
        <p className="eyebrow">Flashbrix</p>

        {status === 'loading' && <p className="muted">Carregando…</p>}
        {status === 'error' && (
          <p className="alert">Não foi possível carregar o conteúdo: {error}</p>
        )}
        {status === 'ready' && !data && (
          <p className="muted">Supabase não configurado neste ambiente.</p>
        )}

        {status === 'ready' && data && (
          <>
            {data.vision && <h1>{data.vision}</h1>}
            {data.mission && <p className="home-hero__lead">{data.mission}</p>}

            {data.values.length > 0 && (
              <section className="home-values">
                <ul>
                  {data.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <p className="home-cta">
          <Link to="/login" className="button button--primary">Enter the app</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
