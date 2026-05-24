import httpClient from '@/shared/api/httpClient'

export const obtenerPlatos = async () => {
  const response = await httpClient.get('/api/platos')
  return response.data
}

export const obtenerPlatosPorCategoria = async (categoria: string) => {
  const response = await httpClient.get(`/api/platos/categoria/${categoria}`)
  return response.data
}

export const crearPlato = async (platoData: any) => {
  const response = await httpClient.post('/api/platos', platoData)
  return response.data
}

export const actualizarPlato = async (id: number, platoData: any) => {
  const response = await httpClient.put(`/api/platos/${id}`, platoData)
  return response.data
}

export const cambiarEstadoPlato = async (id: number, activo: boolean) => {
  const response = await httpClient.patch(`/api/platos/${id}/estado`, { activo })
  return response.data
}

export const eliminarPlato = async (id: number) => {
  const response = await httpClient.delete(`/api/platos/${id}`)
  return response.data
}
