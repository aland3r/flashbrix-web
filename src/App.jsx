import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DocsView from './pages/DocsView'
import HomePage from './pages/HomePage'
import LoginPage from './app/LoginPage'
import AppDashboard from './app/DashboardPage'
import ReaderPage from './app/ReaderPage'
import SearchPage from './app/SearchPage'
import LexiconPage from './app/LexiconPage'
import './app/app.css'
import PayPage from './pages/PayPage'
import TutorPage from './pages/TutorPage'
import UseCasesView from './pages/UseCasesView'
import ProtectedRoute, { NoAccessRedirect } from './routes/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/no-access" element={<NoAccessRedirect />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/app" element={<AppDashboard />} />
            <Route path="/app/contexts/:id" element={<ReaderPage />} />
            <Route path="/app/search" element={<SearchPage />} />
            <Route path="/app/lexicon" element={<LexiconPage />} />
          </Route>

          <Route path="/" element={<HomePage />} />
          <Route path="/tutor" element={<TutorPage />} />
          <Route path="/pagar" element={<PayPage />} />
          <Route path="/documentacao" element={<DocsView />} />
          <Route path="/casos-de-uso" element={<UseCasesView />} />
          <Route path="/objetos" element={<DocsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
