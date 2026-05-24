import httpClient from '@/shared/api/httpClient'

export interface LoginRequest {
  usuario: string
  password: string
}

export interface LoginResponse {
  token: string
  usuario: {
    id: number
    nombre: string
    usuario: string
    rol: 'DUENO' | 'CAJERO' | 'ADMIN'
  }
}

export const login = async (usuario: string, password: string): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>('/api/auth/login', {
    usuario,
    password
  })
  return response.data
}

export const loginCajero = async (): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>('/api/auth/login/cajero')
  return response.data
}

export const loginDueno = async (password: string): Promise<LoginResponse> => {
  const response = await httpClient.post<LoginResponse>('/api/auth/login/dueno', {
    password
  })
  return response.data
}

export const logout = async (): Promise<void> => {
  await httpClient.post('/api/auth/logout')
}

export const getCurrentUser = async () => {
  const response = await httpClient.get('/api/auth/me')
  return response.data
}
