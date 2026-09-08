export default function SiteFooter({ note }) {
  return (
    <footer className="site-footer">
      <p className="muted">{note ?? 'Flashbrix — context-driven language learning.'}</p>
    </footer>
  )
}
