import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'

const UnauthorizedPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">🚫</div>
        <h1>Acceso No Autorizado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        
        <div className="unauthorized-actions">
          <button onClick={handleGoBack} className="btn-secondary">
            Volver Atrás
          </button>
          <button onClick={handleLogout} className="btn-primary">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
