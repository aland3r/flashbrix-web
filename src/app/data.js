import { getSupabase } from '../lib/supabase'

const db = () => getSupabase().schema('flashbrix')

export async function listImmersions() {
  const { data, error } = await db()
    .from('immersions')
    .select('id,title,goal,cover_color,contexts(id,title,origin,level,position),immersion_members(email,role)')
    .order('created_at')
  if (error) throw error
  return data ?? []
}

export async function getContext(id) {
  const { data, error } = await db()
    .from('contexts')
    .select('id,title,origin,level,body,source_note,immersion_id,immersions(title,immersion_members(email,role))')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function listExchanges() {
  const { data, error } = await db()
    .from('exchanges')
    .select('id,starts_at,duration_min,meet_url,tutor_email,learner_email,current_context_id,immersion_id,contexts(id,title)')
    .order('starts_at')
  if (error) throw error
  return data ?? []
}

export async function setExchangeContext(exchangeId, contextId) {
  const { error } = await db().from('exchanges').update({ current_context_id: contextId }).eq('id', exchangeId)
  if (error) throw error
}

export async function listBricks(learnerEmail) {
  let query = db()
    .from('flashbricks')
    .select('id,text,part_of_speech,ipa,audio_url,definition,example,context_id,added_by,created_at,due_at,reps,interval_days,ease')
    .order('created_at', { ascending: false })
  if (learnerEmail) query = query.eq('learner_email', learnerEmail)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function addBrick(brick) {
  const { data, error } = await db().from('flashbricks').insert(brick).select().single()
  if (error) throw error
  return data
}

export async function removeBrick(id) {
  const { error } = await db().from('flashbricks').delete().eq('id', id)
  if (error) throw error
}

/** Free Dictionary API lookup. Returns null when nothing is found. */
export async function lookup(term) {
  const clean = term.trim().toLowerCase()
  if (!clean) return null
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(clean)}`)
    if (!res.ok) return null
    const entries = await res.json()
    const entry = entries[0]
    const phon = entries.flatMap((e) => e.phonetics ?? [])
    const ipa = entry.phonetic || phon.find((p) => p.text)?.text || ''
    const audio = phon.find((p) => p.audio)?.audio || ''
    const meaning = entry.meanings?.[0]
    return {
      text: entry.word,
      ipa,
      audio,
      partOfSpeech: meaning?.partOfSpeech ?? '',
      definition: meaning?.definitions?.[0]?.definition ?? '',
      example: meaning?.definitions?.find((d) => d.example)?.example ?? '',
      meanings: (entry.meanings ?? []).slice(0, 3).map((m) => ({
        partOfSpeech: m.partOfSpeech,
        definition: m.definitions?.[0]?.definition ?? '',
      })),
    }
  } catch {
    return null
  }
}

/** Who owns the lexicon the current user is adding to. */
export function learnerOf(members, myEmail) {
  const learner = members?.find((m) => m.role === 'learner')
  return learner?.email ?? myEmail
}

export function roleIn(members, myEmail) {
  return members?.find((m) => m.email.toLowerCase() === myEmail?.toLowerCase())?.role ?? 'learner'
}

export const POS_COLORS = {
  noun: 'var(--pos-noun)',
  verb: 'var(--pos-verb)',
  adjective: 'var(--pos-adj)',
  adverb: 'var(--pos-adv)',
  preposition: 'var(--pos-prep)',
  conjunction: 'var(--pos-conj)',
}
