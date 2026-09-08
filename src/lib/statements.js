import { getSupabase, isSupabaseConfigured } from '@gestalt/auth'

const KINDS = ['vision', 'mission', 'value']

/**
 * Brand statements for a product landing page.
 *
 * Model B: `portfolio.statements` is the single source of truth, keyed by
 * (brand, kind, lang) — language is data, so this scales past en/pt without
 * schema changes. There is no declared FK from statements.brand_id to brands,
 * so we resolve the brand by `product_code` first, then read its final
 * statements for the requested language.
 *
 * @returns {Promise<{vision: string|null, mission: string|null, values: string[]} | null>}
 *   Grouped statements, or null when Supabase isn't configured.
 */
export async function fetchProductStatements(productCode, lang = 'pt') {
  if (!isSupabaseConfigured()) return null
  const db = getSupabase().schema('portfolio')

  const { data: brand, error: brandError } = await db
    .from('brands')
    .select('id')
    .eq('product_code', productCode)
    .maybeSingle()
  if (brandError) throw new Error(brandError.message)
  if (!brand) return { vision: null, mission: null, values: [] }

  const { data, error } = await db
    .from('statements')
    .select('kind, content, sort_order')
    .eq('brand_id', brand.id)
    .eq('status', 'active')
    .eq('lang', lang)
    .in('kind', KINDS)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(error.message)

  const rows = data ?? []
  return {
    vision: rows.find((row) => row.kind === 'vision')?.content ?? null,
    mission: rows.find((row) => row.kind === 'mission')?.content ?? null,
    values: rows.filter((row) => row.kind === 'value').map((row) => row.content),
  }
}
