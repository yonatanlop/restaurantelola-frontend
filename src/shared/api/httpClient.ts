import axios from 'axios'

// Por defecto se usan rutas relativas ("/api/...", mismo origen que sirvio
// el frontend): tanto "npm run dev" (proxy de vite.config.ts) como el Nginx
// del contenedor Docker (nginx.conf) ya reenvian /api al backend, asi que no
// hace falta saber su host:puerto de antemano. VITE_API_URL solo hace falta
// para un caso especial (backend en otro origen distinto al que sirve el
// frontend).
const getBaseURL = (): string => import.meta.env.VITE_API_URL || ''

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
