function tlv(id, value) {
  const len = String(value.length).padStart(2, '0')
  return `${id}${len}${value}`
}

function crc16(payload) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export const BETA_PRICE_LABEL = 'R$80'
export const BETA_AMOUNT = '80.00'

export function getPixConfig() {
  const key = (import.meta.env.VITE_PIX_KEY ?? '').trim()
  return {
    key,
    name: (import.meta.env.VITE_PIX_NAME ?? 'Flashbrix').trim().slice(0, 25),
    city: (import.meta.env.VITE_PIX_CITY ?? 'CURITIBA').trim().slice(0, 15),
    configured: Boolean(key),
  }
}

/** Static PIX copia-e-cola (EMV). Empty string if no key yet. */
export function buildPixPayload({ amount = BETA_AMOUNT } = {}) {
  const { key, name, city, configured } = getPixConfig()
  if (!configured) return ''

  const merchant = tlv('26', tlv('00', 'br.gov.bcb.pix') + tlv('01', key))
  const payload = [
    tlv('00', '01'),
    tlv('01', '12'),
    merchant,
    tlv('52', '0000'),
    tlv('53', '986'),
    tlv('54', amount),
    tlv('58', 'BR'),
    tlv('59', name),
    tlv('60', city),
    tlv('62', tlv('05', 'FLASHBRIXBETA')),
  ].join('')
  const withCrcId = `${payload}6304`
  return withCrcId + crc16(withCrcId)
}
