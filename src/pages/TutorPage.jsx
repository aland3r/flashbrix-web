import { Link } from 'react-router-dom'
import SiteHeader from '../components/shell/SiteHeader'
import SiteFooter from '../components/shell/SiteFooter'
import { BETA_PRICE_LABEL } from '../lib/pix'

export default function TutorPage() {
  return (
    <div className="site-page">
      <SiteHeader activeSlug={null} />
      <main className="tutor-page">
        <p className="eyebrow">Primeiro tutor</p>
        <h1>Alander</h1>
        <p className="home-hero__lead">
          Idioma a partir do que você já ama. O Flashbrix guarda o vocabulário
          e acompanha até retenção máxima. Beta aberto — qualquer pessoa cria
          conta.
        </p>
        <ul className="home-values">
          <li>Vocabulário extraído do seu interesse (não de lista genérica)</li>
          <li>Acesso ao app em outubro, pagamento via PIX</li>
          <li>Cupom de beta: {BETA_PRICE_LABEL}</li>
        </ul>
        <p className="home-cta">
          <Link to="/login" className="button button--primary">Criar conta</Link>
          {' '}
          <Link to="/pagar" className="button">Pagar beta (PIX)</Link>
        </p>
      </main>
      <SiteFooter note="Perfil público — Flashbrix beta." />
    </div>
  )
}
