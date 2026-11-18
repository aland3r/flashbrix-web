import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppShell from './AppShell'
import { learnerOf, listBricks, listExchanges, listImmersions, POS_COLORS } from './data'

function readRecent() {
  try { return JSON.parse(localStorage.getItem('fx-recent') ?? '[]') } catch { return [] }
}

export function formatWhen(iso) {
  const d = new Date(iso)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return sameDay ? `Hoje, ${time}` : `${d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}, ${time}`
}

export function exchangeState(ex, now = Date.now()) {
  const start = new Date(ex.starts_at).getTime()
  const end = start + (ex.duration_min ?? 60) * 60000
  if (now >= start - 10 * 60000 && now <= end) return 'live'
  if (now < start) return 'next'
  return 'past'
}

export function ExchangeStrip({ ex, me }) {
  const state = exchangeState(ex)
  const other = me?.toLowerCase() === ex.learner_email.toLowerCase() ? 'Alander' : 'Natalia'
  return (
    <div className={`fx-exchange fx-exchange--${state}`}>
      <span className="fx-exchange__dot" aria-hidden="true" />
      <div className="fx-exchange__info">
        <strong>{state === 'live' ? 'Exchange ao vivo' : 'Próximo exchange'}</strong>
        <span>{formatWhen(ex.starts_at)} · com {other}</span>
      </div>
      {ex.current_context_id ? (
        <Link className="fx-btn fx-btn--small" to={`/app/contexts/${ex.current_context_id}?exchange=${ex.id}`}>
          {state === 'live' ? 'Abrir contexto da aula' : ex.contexts?.title ? 'Ver contexto' : 'Abrir'}
        </Link>
      ) : null}
    </div>
  )
}

export function Brick({ b }) {
  return (
    <span className="fx-brick" style={{ '--brick': POS_COLORS[b.part_of_speech] ?? 'var(--pos-other)' }} title={b.definition}>
      {b.text}
    </span>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [immersions, setImmersions] = useState(null)
  const [exchanges, setExchanges] = useState([])
  const [bricks, setBricks] = useState([])
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        const [imms, exs] = await Promise.all([listImmersions(), listExchanges()])
        if (!alive) return
        setImmersions(imms)
        setExchanges(exs)
        const learner = learnerOf(imms[0]?.immersion_members, user?.email)
        setBricks(await listBricks(learner))
      } catch (e) {
        if (alive) setError(e.message ?? String(e))
      }
    }
    load()
    const t = setInterval(() => listExchanges().then((x) => alive && setExchanges(x)).catch(() => {}), 15000)
    return () => { alive = false; clearInterval(t) }
  }, [user?.email])

  const upcoming = exchanges.filter((e) => exchangeState(e) !== 'past')
  const allContexts = (immersions ?? []).flatMap((i) => (i.contexts ?? []).map((c) => ({ ...c, immersion: i })))
  const recentIds = readRecent()
  const contexts = [...allContexts].sort((a, b) => {
    const ia = recentIds.indexOf(a.id); const ib = recentIds.indexOf(b.id)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
  const first = user?.name?.split(' ')[0] ?? ''

  return (
    <AppShell>
      <section className="fx-hero">
        <h1 className="fx-display">Olá, <em>{first}</em>.</h1>
        <form className="fx-hero__search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/app/search?q=${encodeURIComponent(q.trim())}`) }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a vocabulary item" aria-label="Buscar vocabulário" />
        </form>
      </section>

      {error ? <p className="fx-alert">{error}</p> : null}

      {upcoming.map((ex) => <ExchangeStrip key={ex.id} ex={ex} me={user?.email} />)}

      <section className="fx-section">
        <div className="fx-section__head">
          <h2>Seus bricks</h2>
          <Link to="/app/lexicon">{bricks.length} no léxico</Link>
        </div>
        {bricks.length ? (
          <div className="fx-wall">{bricks.slice(0, 18).map((b) => <Brick key={b.id} b={b} />)}</div>
        ) : (
          <p className="fx-empty">Toque em qualquer palavra de um contexto para colocar o primeiro brick no seu léxico.</p>
        )}
      </section>

      <section className="fx-section">
        <div className="fx-section__head"><h2>Continuar lendo</h2></div>
        <ul className="fx-rows">
          {contexts.map((c) => (
            <li key={c.id}>
              <Link to={`/app/contexts/${c.id}`} className="fx-row">
                <span className="fx-row__swatch" style={{ background: c.immersion.cover_color }} />
                <span className="fx-row__title">{c.title}</span>
                <span className="fx-row__meta">{c.immersion.title} · {c.level}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="fx-section">
        <div className="fx-section__head"><h2>Imersões</h2></div>
        <div className="fx-immersions">
          {(immersions ?? []).map((i) => (
            <article key={i.id} className="fx-imm" style={{ '--imm': i.cover_color }}>
              <span className="fx-imm__studs" aria-hidden="true"><i /><i /><i /></span>
              <h3>{i.title}</h3>
              <p>{i.goal}</p>
              <span className="fx-imm__meta">{i.contexts?.length ?? 0} contextos</span>
            </article>
          ))}
          {immersions && !immersions.length ? <p className="fx-empty">Nenhuma imersão ainda. Peça ao seu tutor para te convidar.</p> : null}
        </div>
      </section>
    </AppShell>
  )
}
