import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppShell from './AppShell'
import LookupPanel from './LookupPanel'
import { addBrick, getContext, learnerOf, listBricks, listExchanges, POS_COLORS, roleIn, setExchangeContext } from './data'
import { exchangeState } from './DashboardPage'

function rememberRecent(id) {
  try {
    const list = JSON.parse(localStorage.getItem('fx-recent') ?? '[]').filter((x) => x !== id)
    localStorage.setItem('fx-recent', JSON.stringify([id, ...list].slice(0, 10)))
  } catch { /* ignore */ }
}

const WORD = /([A-Za-z][A-Za-z'’-]*)/

/** Renders inline text with **bold**, every word tappable. */
function Inline({ text, onWord, savedSet }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const bold = part.startsWith('**') && part.endsWith('**')
    const raw = bold ? part.slice(2, -2) : part
    const tokens = raw.split(WORD)
    const nodes = tokens.map((t, j) => {
      if (!WORD.test(t) || t.length === 0) return <Fragment key={j}>{t}</Fragment>
      const key = t.toLowerCase()
      const savedPos = savedSet.get(key)
      return (
        <span
          key={j}
          className={savedPos ? 'fx-w fx-w--saved' : 'fx-w'}
          style={savedPos ? { '--brick': POS_COLORS[savedPos] ?? 'var(--pos-other)' } : undefined}
          onClick={(e) => onWord(t, e)}
        >
          {t}
        </span>
      )
    })
    return bold ? <strong key={i}>{nodes}</strong> : <Fragment key={i}>{nodes}</Fragment>
  })
}

function Body({ body, onWord, savedSet }) {
  const blocks = body.split(/\n\n+/)
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>
    if (block.startsWith('> ')) return <blockquote key={i}><Inline text={block.slice(2).replace(/^\*|\*$/g, '')} onWord={onWord} savedSet={savedSet} /></blockquote>
    if (lines.every((l) => /^- /.test(l))) {
      return <ul key={i}>{lines.map((l, j) => <li key={j}><Inline text={l.slice(2)} onWord={onWord} savedSet={savedSet} /></li>)}</ul>
    }
    if (lines.every((l) => /^\d+\. /.test(l))) {
      return <ol key={i}>{lines.map((l, j) => <li key={j}><Inline text={l.replace(/^\d+\. /, '')} onWord={onWord} savedSet={savedSet} /></li>)}</ol>
    }
    return <p key={i}><Inline text={block} onWord={onWord} savedSet={savedSet} /></p>
  })
}

function sentenceAround(el) {
  const block = el?.closest('p,li,blockquote')
  const text = block?.textContent ?? ''
  const word = el?.textContent ?? ''
  const sentences = text.match(/[^.!?]+[.!?]?/g) ?? [text]
  return (sentences.find((s) => s.includes(word)) ?? text).trim()
}

export default function ReaderPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { user } = useAuth()
  const [ctx, setCtx] = useState(null)
  const [bricks, setBricks] = useState([])
  const [exchange, setExchange] = useState(null)
  const [pick, setPick] = useState(null)
  const [classMode, setClassMode] = useState(params.has('exchange'))
  const [error, setError] = useState('')
  const bodyRef = useRef(null)

  const members = ctx?.immersions?.immersion_members
  const learner = learnerOf(members, user?.email)
  const role = roleIn(members, user?.email)

  useEffect(() => {
    let alive = true
    rememberRecent(id)
    setPick(null)
    getContext(id).then((c) => {
      if (!alive) return
      setCtx(c)
      return listBricks(learnerOf(c.immersions?.immersion_members, user?.email)).then((b) => alive && setBricks(b))
    }).catch((e) => alive && setError(e.message ?? String(e)))
    return () => { alive = false }
  }, [id, user?.email])

  useEffect(() => {
    let alive = true
    function poll() {
      listExchanges().then((list) => {
        if (!alive) return
        const wanted = params.get('exchange')
        const ex = list.find((e) => e.id === wanted) ?? list.find((e) => exchangeState(e) === 'live')
        setExchange(ex ?? null)
      }).catch(() => {})
    }
    poll()
    const t = setInterval(poll, 10000)
    return () => { alive = false; clearInterval(t) }
  }, [params])

  // Multi-word selection: select text with mouse or finger, then look it up.
  useEffect(() => {
    function onUp() {
      const sel = window.getSelection()
      const text = sel?.toString().trim()
      if (!text || !text.includes(' ') || text.length > 60) return
      if (!bodyRef.current?.contains(sel.anchorNode)) return
      setPick({ term: text.replace(/[.,;:!?"“”()]/g, ''), sentence: sentenceAround(sel.anchorNode?.parentElement) })
    }
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchend', onUp)
    return () => { document.removeEventListener('mouseup', onUp); document.removeEventListener('touchend', onUp) }
  }, [])

  const savedSet = useMemo(() => {
    const m = new Map()
    bricks.forEach((b) => b.text.toLowerCase().split(/\s+/).length === 1 && m.set(b.text.toLowerCase(), b.part_of_speech))
    return m
  }, [bricks])

  const onWord = useCallback((word, e) => {
    if (window.getSelection()?.toString().trim().includes(' ')) return
    setPick({ term: word, sentence: sentenceAround(e.currentTarget) })
  }, [])

  async function onAdd(form) {
    const b = await addBrick({
      learner_email: learner,
      added_by: user.email,
      text: form.text.trim(),
      part_of_speech: form.part_of_speech,
      ipa: form.ipa || null,
      audio_url: form.audio_url || null,
      definition: form.definition || null,
      example: form.example || null,
      context_id: id,
    })
    setBricks((list) => [b, ...list])
  }

  const fromHere = bricks.filter((b) => b.context_id === id)
  const isLiveHere = exchange && exchangeState(exchange) === 'live'
  const exchangeElsewhere = isLiveHere && exchange.current_context_id && exchange.current_context_id !== id

  return (
    <AppShell wide classMode={classMode}>
      <div className="fx-reader-wrap">
        <article className="fx-reader">
          <div className="fx-reader__tools">
            <Link to="/app" className="fx-link">← Início</Link>
            <label className="fx-toggle">
              <input type="checkbox" checked={classMode} onChange={(e) => setClassMode(e.target.checked)} />
              Modo aula
            </label>
          </div>

          {exchange && role === 'tutor' && exchange.current_context_id !== id ? (
            <div className="fx-banner">
              <span>Exchange {exchangeState(exchange) === 'live' ? 'ao vivo' : 'de hoje'}.</span>
              <button type="button" className="fx-btn fx-btn--small" onClick={() => setExchangeContext(exchange.id, id).then(() => setExchange({ ...exchange, current_context_id: id }))}>
                Usar este contexto na aula
              </button>
            </div>
          ) : null}
          {exchangeElsewhere && role !== 'tutor' ? (
            <div className="fx-banner">
              <span>O seu tutor abriu outro contexto.</span>
              <Link className="fx-btn fx-btn--small" to={`/app/contexts/${exchange.current_context_id}?exchange=${exchange.id}`}>Ir para o contexto</Link>
            </div>
          ) : null}

          {error ? <p className="fx-alert">{error}</p> : null}
          {ctx ? (
            <>
              <p className="fx-eyebrow">{ctx.immersions?.title} · {ctx.origin} · {ctx.level}</p>
              <h1 className="fx-reader__title">{ctx.title}</h1>
              <div className="fx-reader__body" ref={bodyRef}>
                <Body body={ctx.body ?? ''} onWord={onWord} savedSet={savedSet} />
              </div>
              {ctx.source_note ? <p className="fx-source">{ctx.source_note}</p> : null}
            </>
          ) : !error ? <p className="fx-muted">Carregando contexto…</p> : null}
        </article>

        <div className="fx-side">
          {pick ? (
            <LookupPanel
              term={pick.term}
              sentence={pick.sentence}
              saved={bricks.some((b) => b.text.toLowerCase() === pick.term.toLowerCase())}
              onAdd={onAdd}
              onClose={() => setPick(null)}
            />
          ) : (
            <p className="fx-hint">Toque numa palavra para consultar. Para uma expressão, selecione as palavras.</p>
          )}
          <section className="fx-side__bricks">
            <h3>Bricks deste contexto <span>{fromHere.length}</span></h3>
            <ul>
              {fromHere.map((b) => (
                <li key={b.id} style={{ '--brick': POS_COLORS[b.part_of_speech] ?? 'var(--pos-other)' }}>
                  <b>{b.text}</b>
                  <span>{b.part_of_speech}{b.added_by && b.added_by !== learner ? ' · tutor' : ''}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
