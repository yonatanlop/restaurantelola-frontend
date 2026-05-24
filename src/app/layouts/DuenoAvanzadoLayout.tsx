import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const DuenoAvanzadoLayout = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout-container">
      <nav className="navbar navbar-advanced">
        <div className="navbar-brand">
          <span className="navbar-icon">⚙️</span>
          <div>
            <h1>Restaurante Doña Lola</h1>
            <p className="navbar-subtitle">Administración Avanzada - {usuario?.nombre}</p>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/dueno/avanzado/menu" className="nav-link">
            🍽️ Menú
          </Link>
          <Link to="/dueno/avanzado/inventario" className="nav-link">
            📦 Inventario
          </Link>
          <Link to="/dueno/avanzado/compras" className="nav-link">
            🛒 Compras
          </Link>
          <Link to="/dueno/avanzado/nomina" className="nav-link">
            👥 Nómina
          </Link>
          <Link to="/dueno/avanzado/contabilidad" className="nav-link">
            📊 Contabilidad
          </Link>
          <Link to="/dueno/avanzado/cierre-caja" className="nav-link">
            📮 Cierre Caja
          </Link>
          <Link to="/dueno/avanzado/reportes" className="nav-link">
            📈 Reportes
          </Link>
          <Link to="/dueno/avanzado/creditos" className="nav-link">
            💳 Créditos
          </Link>
          <Link to="/dueno/avanzado/configuracion" className="nav-link">
            🔧 Configuración
          </Link>
          <Link to="/dueno/avanzado/auditoria" className="nav-link">
            🔍 Auditoría
          </Link>
          <Link to="/dueno" className="nav-link nav-link-back">
            ← Menú Rápido
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

export default DuenoAvanzadoLayout
