import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { login as loginApi } from '../services/authApi'

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login: authLogin } = useAuth()

  const login = async (usuario: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await loginApi(usuario, password)
      
      // Usar el login del AuthProvider
      authLogin(response.token, response.usuario)
      
      return response.usuario
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Usuario o contraseña incorrectos'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

export default useLogin
