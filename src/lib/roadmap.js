/** Flashbrix quest log — IDs: UC{n}-{group}{letter} */

export const ROADMAP_PHASES = [
  {
    id: 'P0',
    codename: 'INSERT COIN',
    title: 'Fase 0 — Auth + perfil',
    quests: [
      { id: '0.1', uc: null, label: 'DDL milebrick no Supabase', status: 'done' },
      { id: '0.2', uc: null, label: 'Seed dev user + languages', status: 'done' },
      { id: 'UC1-1a', uc: 'UC1', label: 'Web .env Supabase + supabase-js client', status: 'locked' },
      { id: 'UC1-1b', uc: 'UC1', label: 'Login e-mail/senha (Supabase Auth)', status: 'locked' },
      { id: 'UC1-1c', uc: 'UC1', label: 'Sessão + ProtectedRoute', status: 'locked' },
      { id: 'UC1-1d', uc: 'UC1', label: 'Logout', status: 'locked' },
      { id: 'UC1-2a', uc: 'UC1', label: 'Load milebrick.users + language profile', status: 'locked' },
      { id: 'UC1-2b', uc: 'UC1', label: 'Edit profile / languages', status: 'locked' },
    ],
  },
  {
    id: 'P1',
    codename: 'LOAD WORDS',
    title: 'Fase 1 — Vocabulário',
    quests: [
      { id: 'UC4-1a', uc: null, label: 'Schema lexical_units + milebricks', status: 'locked' },
      { id: 'UC4-1b', uc: null, label: 'API vocabulary CRUD', status: 'locked' },
    ],
  },
]

export const LOADING_LINES = [
  'INSERT COIN TO CONTINUE...',
  'LOADING FLASHBRIX...',
  'BUFFERING TARGET LANGUAGE...',
]
