import { useEffect, useState } from 'react'
import { lookup } from './data'

const POS = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'other']

/** Quick lookup: shows dictionary data and lets the user add the item as a brick. */
export default function LookupPanel({ term, sentence, saved, onAdd, onClose }) {
  const [state, setState] = useState({ loading: true })
  const [form, setForm] = useState({ text: term, part_of_speech: '', ipa: '', definition: '', example: sentence ?? '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let alive = true
    setState({ loading: true })
    setMsg('')
    setForm({ text: term, part_of_speech: '', ipa: '', definition: '', example: sentence ?? '' })
    lookup(term).then((r) => {
      if (!alive) return
      setState({ loading: false, result: r })
      if (r) {
        setForm((f) => ({
          ...f,
          part_of_speech: POS.includes(r.partOfSpeech) ? r.partOfSpeech : 'other',
          ipa: r.ipa,
          definition: r.definition,
          audio_url: r.audio,
        }))
      } else {
        setForm((f) => ({ ...f, part_of_speech: term.includes(' ') ? 'noun' : 'other' }))
      }
    })
    return () => { alive = false }
  }, [term, sentence])

  async function add() {
    setBusy(true)
    setMsg('')
    try {
      await onAdd(form)
      setMsg('Brick adicionado ao léxico.')
    } catch (e) {
      setMsg(e.message ?? 'Não foi possível salvar.')
    } finally {
      setBusy(false)
    }
  }

  const r = state.result
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <aside className="fx-lookup" role="dialog" aria-label={`Consulta: ${term}`}>
      <div className="fx-lookup__head">
        <div>
          <input className="fx-lookup__term" value={form.text} onChange={set('text')} aria-label="Item" />
          <div className="fx-lookup__ipa">
            {form.ipa ? <span>{form.ipa}</span> : null}
            {r?.audio ? (
              <button type="button" className="fx-link" onClick={() => new Audio(r.audio).play()}>▶ ouvir</button>
            ) : null}
          </div>
        </div>
        <button type="button" className="fx-x" onClick={onClose} aria-label="Fechar">×</button>
      </div>

      {state.loading ? <p className="fx-muted">Consultando…</p> : null}
      {!state.loading && !r ? <p className="fx-muted fx-small">Não achamos no dicionário. Escreva a definição com o seu tutor.</p> : null}
      {r?.meanings?.length > 1 ? (
        <ul className="fx-lookup__meanings">
          {r.meanings.map((m, i) => (
            <li key={i}>
              <button type="button" className="fx-link" onClick={() => setForm((f) => ({ ...f, part_of_speech: POS.includes(m.partOfSpeech) ? m.partOfSpeech : 'other', definition: m.definition }))}>
                <b>{m.partOfSpeech}</b> {m.definition}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <label className="fx-field">
        <span>Classe</span>
        <select value={form.part_of_speech} onChange={set('part_of_speech')}>
          {POS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <label className="fx-field">
        <span>Definição</span>
        <textarea rows={3} value={form.definition} onChange={set('definition')} />
      </label>
      <label className="fx-field">
        <span>Exemplo</span>
        <textarea rows={2} value={form.example} onChange={set('example')} />
      </label>

      <button type="button" className="fx-btn" onClick={add} disabled={busy || saved || !form.text.trim()}>
        {saved ? 'Já está no léxico' : busy ? 'Salvando…' : 'Adicionar ao léxico'}
      </button>
      {msg ? <p className="fx-small fx-ok">{msg}</p> : null}
    </aside>
  )
}
