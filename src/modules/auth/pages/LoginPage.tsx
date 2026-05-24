import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCajero, loginDueno } from '../services/authApi'
import { useAuth } from '@/app/providers/AuthProvider'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCajeroLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await loginCajero()
      login(response.token, response.usuario)
      navigate('/cajero/venta')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión como cajero')
    } finally {
      setLoading(false)
    }
  }

  const handleDuenoClick = () => {
    setShowPasswordModal(true)
    setPassword('')
    setError('')
  }

  const handleDuenoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      setError('Por favor ingrese la contraseña')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await loginDueno(password)
      login(response.token, response.usuario)
      navigate('/dueno/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Contraseña incorrecta')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowPasswordModal(false)
    setPassword('')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="restaurant-icon">🍽️</div>
          <h1>Restaurante Doña Lola</h1>
          <p className="login-subtitle">Sistema de Punto de Venta</p>
        </div>

        <div className="login-options">
          <h2 className="login-title">Seleccione su perfil</h2>
          
          <div className="role-buttons">
            <button 
              className="role-button role-button-cajero"
              onClick={handleCajeroLogin}
              disabled={loading}
            >
              <div className="role-icon">💰</div>
              <div className="role-info">
                <h3>Cajero</h3>
                <p>Acceso al punto de venta</p>
              </div>
            </button>

            <button 
              className="role-button role-button-dueno"
              onClick={handleDuenoClick}
              disabled={loading}
            >
              <div className="role-icon">👔</div>
              <div className="role-info">
                <h3>Dueño</h3>
                <p>Acceso al sistema</p>
              </div>
            </button>
          </div>

          {error && !showPasswordModal && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        <div className="login-footer">
          <p className="version">Versión 1.1.0</p>
          <p className="copyright">© 2026 Restaurante Doña Lola. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Modal de contraseña para dueño */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Acceso de Dueño</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleDuenoLogin} className="password-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field input-touch"
                  autoComplete="current-password"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading || !password}
                >
                  {loading ? 'Verificando...' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
