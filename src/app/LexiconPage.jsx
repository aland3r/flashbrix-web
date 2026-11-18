import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppShell from './AppShell'
import { learnerOf, listBricks, listImmersions, POS_COLORS, removeBrick } from './data'

export default function LexiconPage() {
  const { user } = useAuth()
  const [bricks, setBricks] = useState(null)
  const [learner, setLearner] = useState('')

  useEffect(() => {
    listImmersions().then((imms) => {
      const l = learnerOf(imms[0]?.immersion_members, user?.email)
      setLearner(l)
      return listBricks(l).then(setBricks)
    }).catch(() => setBricks([]))
  }, [user?.email])

  const present = [...new Set((bricks ?? []).map((b) => b.part_of_speech || 'other'))]

  return (
    <AppShell>
      <h1 className="fx-display fx-display--sm">Léxico</h1>
      {present.length ? (
        <div className="fx-legend">
          {present.map((p) => <span key={p} style={{ '--brick': POS_COLORS[p] ?? 'var(--pos-other)' }}>{p}</span>)}
        </div>
      ) : null}
      {bricks && !bricks.length ? <p className="fx-empty">Ainda não há bricks. Abra um contexto e toque numa palavra.</p> : null}
      <ul className="fx-lexicon">
        {(bricks ?? []).map((b) => (
          <li key={b.id} className="fx-card-brick" style={{ '--brick': POS_COLORS[b.part_of_speech] ?? 'var(--pos-other)' }}>
            <div className="fx-card-brick__head">
              <b>{b.text}</b>
              {b.ipa ? <span className="fx-ipa">{b.ipa}</span> : null}
              {b.audio_url ? <button type="button" className="fx-link" onClick={() => new Audio(b.audio_url).play()}>▶</button> : null}
            </div>
            <span className="fx-card-brick__pos">{b.part_of_speech}{b.added_by && b.added_by !== learner ? ' · adicionado pelo tutor' : ''}</span>
            {b.definition ? <p>{b.definition}</p> : null}
            {b.example ? <p className="fx-example">“{b.example}”</p> : null}
            <button type="button" className="fx-link fx-small" onClick={() => removeBrick(b.id).then(() => setBricks((l) => l.filter((x) => x.id !== b.id)))}>Remover</button>
          </li>
        ))}
      </ul>
    </AppShell>
  )
}
