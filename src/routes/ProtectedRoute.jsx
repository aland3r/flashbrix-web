import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, hasAccess, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Carregando sessão...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasAccess) {
    return <Navigate to="/no-access" replace />
  }

  return <Outlet />
}

export function NoAccessRedirect() {
  return (
    <div className="loading-screen">
      <h1>Beta aberto</h1>
      <p className="muted">
        Qualquer conta Google entra. Se caiu nesta tela, volte ao app.
      </p>
      <p>
        <a href="/dashboard">Ir ao app</a>
      </p>
      <p>
        <a href="/">Voltar à landing</a>
      </p>
    </div>
  )
}
