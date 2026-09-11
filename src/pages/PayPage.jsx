import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import SiteFooter from '../components/shell/SiteFooter'
import { BETA_PRICE_LABEL, buildPixPayload, getPixConfig } from '../lib/pix'

export default function PayPage() {
  const pix = useMemo(() => getPixConfig(), [])
  const payload = useMemo(() => buildPixPayload(), [])
  const [copied, setCopied] = useState('')

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
    } catch {
      setCopied('falhou')
    }
  }

  const qrSrc = payload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(payload)}`
    : ''

  return (
    <div className="site-page">
      <SiteHeader activeSlug={null} />
      <main className="pay-page">
        <p className="eyebrow">Beta · outubro</p>
        <h1>Pagar {BETA_PRICE_LABEL}</h1>
        <p className="home-hero__lead">
          Fase beta: PIX. Sem cobrança por hora. Depois de pagar, crie a conta
          com Google e mande o comprovante no WhatsApp se precisar.
        </p>

        {!pix.configured ? (
          <p className="alert">
            Chave PIX ainda não está no ambiente (`VITE_PIX_KEY`). O QR entra
            assim que a chave for configurada — até lá, peça o PIX direto ao
            tutor.
          </p>
        ) : (
          <section className="pay-box">
            {qrSrc ? (
              <img
                className="pay-qr"
                src={qrSrc}
                width={220}
                height={220}
                alt="QR Code PIX do beta Flashbrix"
              />
            ) : null}
            <p className="muted">Chave</p>
            <p className="pay-key">{pix.key}</p>
            <div className="home-cta">
              <button type="button" className="button button--primary" onClick={() => copy(pix.key, 'chave')}>
                Copiar chave
              </button>
              {' '}
              <button type="button" className="button" onClick={() => copy(payload, 'copia-e-cola')}>
                Copiar PIX copia-e-cola
              </button>
            </div>
            {copied ? <p className="muted">Copiado: {copied}</p> : null}
          </section>
        )}

        <p className="home-cta">
          <Link to="/login" className="button button--primary">Criar conta</Link>
          {' '}
          <Link to="/tutor" className="button">Ver tutor</Link>
        </p>
      </main>
      <SiteFooter note="Pagamento beta · PIX · sem Stripe." />
    </div>
  )
}
