export interface Usuario {
  id: number
  nombre: string
  rol: 'DUENO' | 'CAJERO' | 'ADMIN'
  email: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}
