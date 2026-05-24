import httpClient from '@/shared/api/httpClient'
import { AjusteInventarioPayload, Insumo, InsumoPayload } from '@/shared/types/inventario'

export const obtenerInsumos = async (): Promise<Insumo[]> => {
  const response = await httpClient.get('/api/insumos')
  return response.data
}

export const obtenerInsumosActivos = async (): Promise<Insumo[]> => {
  const response = await httpClient.get('/api/insumos/activos')
  return response.data
}

export const obtenerBajoStock = async (): Promise<Insumo[]> => {
  const response = await httpClient.get('/api/insumos/bajo-stock')
  return response.data
}

export const crearInsumo = async (insumoData: InsumoPayload): Promise<Insumo> => {
  const response = await httpClient.post('/api/insumos', insumoData)
  return response.data
}

export const actualizarInsumo = async (id: number, insumoData: InsumoPayload): Promise<Insumo> => {
  const response = await httpClient.put(`/api/insumos/${id}`, insumoData)
  return response.data
}

export const ajustarStock = async (id: number, payload: AjusteInventarioPayload): Promise<Insumo> => {
  const response = await httpClient.patch(`/api/insumos/${id}/ajustar`, payload)
  return response.data
}

export const eliminarInsumo = async (id: number): Promise<void> => {
  await httpClient.delete(`/api/insumos/${id}`)
}

// Recetas
export const obtenerRecetasPorPlato = async (platoId: number) => {
  const response = await httpClient.get(`/api/recetas/plato/${platoId}`)
  return response.data
}

export const agregarInsumoAPlato = async (platoId: number, insumoId: number, cantidad: number) => {
  const response = await httpClient.post(`/api/recetas/plato/${platoId}`, {
    insumoId,
    cantidadNecesaria: cantidad
  })
  return response.data
}

export const eliminarInsumoDePlato = async (platoId: number, insumoId: number) => {
  const response = await httpClient.delete(`/api/recetas/plato/${platoId}/insumo/${insumoId}`)
  return response.data
}
