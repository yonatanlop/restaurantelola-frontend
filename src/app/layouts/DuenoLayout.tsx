import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const DuenoLayout = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-icon">🍽️</span>
          <div>
            <h1>Restaurante Doña Lola</h1>
            <p className="navbar-subtitle">Menú Rápido - {usuario?.nombre}</p>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/dueno/dashboard" className="nav-link">
            📊 Dashboard
          </Link>
          <Link to="/dueno/ventas-dia" className="nav-link">
            💰 Ventas del Día
          </Link>
          <Link to="/dueno/avanzado" className="nav-link nav-link-advanced">
            ⚙️ Menú Avanzado
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>Restaurante Doña Lola v1.1.0 © 2026 - Todos los derechos reservados</p>
      </footer>
    </div>
  )
}

export default DuenoLayout
