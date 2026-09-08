// Live docs viewer — same product-site skeleton as Deviante
// (gestalt-kit/partials/lp-skeleton.md). Tabs are identical across products.
export const DOCS_REPO = 'aland3r/flashbrix-docs'
export const DOCS_BRANCH = 'main'

export const siteTabs = [
  { slug: 'documentacao', label: 'Docs' },
  { slug: 'casos-de-uso', label: 'Use cases' },
  { slug: 'objetos', label: 'Objects' },
]

export const docsViews = [
  {
    slug: 'documentacao',
    label: 'Docs',
    eyebrow: 'Arquitetura',
    blurb: 'Arquitetura em arc42, com diagramas C4 e UML.',
    sections: [
      {
        section: 'Arquitetura (arc42)',
        items: [{ label: 'Documento arc42', path: 'architecture/arc42.md' }],
      },
    ],
  },
  {
    slug: 'casos-de-uso',
    label: 'Use cases',
    eyebrow: 'Processo ORCA',
    blurb: 'A descoberta ORCA e os requisitos de cada objeto do domínio.',
    sections: [
      {
        section: 'Processo ORCA (discovery)',
        items: [
          { label: 'Noun Foraging', path: 'ooux/1-discovery/1-object_discovery/1-0_NounForaging.md' },
          { label: 'Early Prioritization', path: 'ooux/1-discovery/1-object_discovery/1-1_EarlyPrioritization.md' },
          { label: 'Object Consolidation', path: 'ooux/1-discovery/1-object_discovery/2-0_ObjectConsolidation.md' },
          { label: 'Object Instancing', path: 'ooux/1-discovery/1-object_discovery/3-0_ObjectInstancing.md' },
        ],
      },
    ],
  },
  {
    slug: 'objetos',
    label: 'Objects',
    eyebrow: 'UX — OOUX',
    blurb: 'Os objetos do produto, seus relacionamentos, CTAs e atributos.',
    sections: [
      {
        section: 'UX — Objetos (OOUX)',
        items: [
          { label: 'Objetos (priorização)', path: 'ooux/3-prioritization/1-ObjectPrioritization.md' },
          { label: 'Atributos — Contexto', path: 'ooux/1-discovery/3-attribute_discovery/ContextAttributes.md' },
          { label: 'Atributos — Prática', path: 'ooux/1-discovery/3-attribute_discovery/PracticeAttributes.md' },
          { label: 'Atributos — Usuário', path: 'ooux/1-discovery/3-attribute_discovery/UserAttributes.md' },
          { label: 'Atributos — Vocabulário', path: 'ooux/1-discovery/3-attribute_discovery/VocabularyAttributes.md' },
        ],
      },
    ],
  },
]

export function getView(slug) {
  return docsViews.find((view) => view.slug === slug) ?? null
}

const cache = new Map()

function rawUrl(path) {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return `https://raw.githubusercontent.com/${DOCS_REPO}/${DOCS_BRANCH}/${encoded}`
}

export async function fetchDoc(path) {
  if (cache.has(path)) return cache.get(path)

  const response = await fetch(rawUrl(path), { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Não foi possível carregar ${path} (${response.status}).`)
  }
  const text = await response.text()
  cache.set(path, text)
  return text
}
