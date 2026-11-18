import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppShell from './AppShell'
import LookupPanel from './LookupPanel'
import { addBrick, learnerOf, listBricks, listImmersions } from './data'

export default function SearchPage() {
  const [params] = useSearchParams()
  const term = params.get('q') ?? ''
  const { user } = useAuth()
  const [learner, setLearner] = useState(user?.email)
  const [bricks, setBricks] = useState([])

  useEffect(() => {
    listImmersions().then((imms) => {
      const l = learnerOf(imms[0]?.immersion_members, user?.email)
      setLearner(l)
      return listBricks(l).then(setBricks)
    }).catch(() => {})
  }, [user?.email])

  async function onAdd(form) {
    const b = await addBrick({
      learner_email: learner, added_by: user.email, text: form.text.trim(), part_of_speech: form.part_of_speech,
      ipa: form.ipa || null, audio_url: form.audio_url || null, definition: form.definition || null, example: form.example || null,
    })
    setBricks((l) => [b, ...l])
  }

  return (
    <AppShell>
      <h1 className="fx-display fx-display--sm">Busca</h1>
      {term ? (
        <div className="fx-search-result">
          <LookupPanel term={term} sentence="" saved={bricks.some((b) => b.text.toLowerCase() === term.toLowerCase())} onAdd={onAdd} onClose={() => history.back()} />
        </div>
      ) : <p className="fx-muted">Digite um item de vocabulário no campo de busca.</p>}
    </AppShell>
  )
}
