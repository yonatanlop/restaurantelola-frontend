import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Usuario {
  id: number
  nombre: string
  usuario: string
  rol: 'DUENO' | 'CAJERO' | 'ADMIN'
}

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, usuario: Usuario) => void
  logout: () => void
  hasRole: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar datos del localStorage al iniciar
    const storedToken = localStorage.getItem('token')
    const storedUsuario = localStorage.getItem('usuario')
    
    if (storedToken && storedUsuario) {
      setToken(storedToken)
      setUsuario(JSON.parse(storedUsuario))
    }
  }, [])

  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken)
    setUsuario(newUsuario)
    localStorage.setItem('token', newToken)
    localStorage.setItem('usuario', JSON.stringify(newUsuario))
  }

  const logout = () => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const hasRole = (roles: string[]): boolean => {
    if (!usuario) return false
    return roles.includes(usuario.rol)
  }

  const isAuthenticated = !!token && !!usuario

  return (
    <AuthContext.Provider value={{ usuario, token, isAuthenticated, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
