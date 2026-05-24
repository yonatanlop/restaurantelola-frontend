import axios from 'axios'

// Detectar automáticamente la URL del backend
// Si se accede por IP, usar esa IP para el backend también
const getBaseURL = (): string => {
  // Prioridad 1: Variable de entorno (si está definida)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Prioridad 2: Detectar automáticamente desde la URL actual
  const hostname = window.location.hostname
  const port = '8080'
  
  // Si es localhost, usar localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`
  }
  
  // Si es una IP, usar esa IP
  return `http://${hostname}:${port}`
}

const httpClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default httpClient
