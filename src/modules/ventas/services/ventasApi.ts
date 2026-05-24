import httpClient from '@/shared/api/httpClient'

export const crearVenta = async (ventaData: any) => {
  const response = await httpClient.post('/api/ventas', ventaData)
  return response.data
}

export const obtenerVentasDelDia = async () => {
  const response = await httpClient.get('/api/ventas/dia')
  return response.data
}

export const obtenerTodasLasVentas = async () => {
  const response = await httpClient.get('/api/ventas')
  return response.data
}

export const obtenerPlatosActivos = async () => {
  const response = await httpClient.get('/api/platos/activos')
  return response.data
}
