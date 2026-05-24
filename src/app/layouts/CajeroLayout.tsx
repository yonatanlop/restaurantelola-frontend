import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const CajeroLayout = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout-container">
      <nav className="navbar navbar-cajero">
        <div className="navbar-brand">
          <span className="navbar-icon">💵</span>
          <div>
            <h1>Restaurante Doña Lola</h1>
            <p className="navbar-subtitle">Punto de Venta - {usuario?.nombre}</p>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/cajero/venta" className="nav-link nav-link-large">
            🛒 Nueva Venta
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

export default CajeroLayout
