import { getSupabase, isSupabaseConfigured } from '@gestalt/auth'

const PRODUCT_CODE = 'milebrick'

const SELECT = 'id,uc_number,short_id,title,summary,description,actor,object_name'

export async function fetchFlashbrixUseCases(locale = 'pt') {
  if (!isSupabaseConfigured()) {
    return { status: 'unconfigured', useCases: [] }
  }

  const { data, error } = await getSupabase()
    .schema('portfolio')
    .from('use_cases')
    .select(SELECT)
    .eq('product_code', PRODUCT_CODE)
    .eq('visibility', 'public')
    .eq('locale', locale)
    .order('uc_number', { ascending: true })

  if (error) throw error
  return { status: 'ready', useCases: data ?? [] }
}
