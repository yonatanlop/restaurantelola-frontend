import httpClient from '@/shared/api/httpClient'
import { RegistroAsistenciaPayload, RegistroNomina } from '@/shared/types/nomina'

export const obtenerNominaPorFecha = async (fecha: string): Promise<RegistroNomina[]> => {
  const response = await httpClient.get(`/api/nomina/fecha/${fecha}`)
  return response.data
}

export const obtenerNominaPorPeriodo = async (inicio: string, fin: string): Promise<RegistroNomina[]> => {
  const response = await httpClient.get(`/api/nomina/periodo?inicio=${inicio}&fin=${fin}`)
  return response.data
}

export const obtenerNominaPorEmpleado = async (
  empleadoId: number,
  inicio: string,
  fin: string
): Promise<RegistroNomina[]> => {
  const response = await httpClient.get(`/api/nomina/empleado/${empleadoId}?inicio=${inicio}&fin=${fin}`)
  return response.data
}

export const obtenerNominaPendiente = async (): Promise<RegistroNomina[]> => {
  const response = await httpClient.get('/api/nomina/pendientes')
  return response.data
}

export const calcularTotalDia = async (fecha: string): Promise<number> => {
  const response = await httpClient.get(`/api/nomina/total/dia/${fecha}`)
  return Number(response.data?.total ?? 0)
}

export const calcularTotalPeriodo = async (inicio: string, fin: string): Promise<number> => {
  const response = await httpClient.get(`/api/nomina/total/periodo?inicio=${inicio}&fin=${fin}`)
  return Number(response.data?.total ?? 0)
}

export const registrarAsistencia = async (payload: RegistroAsistenciaPayload): Promise<RegistroNomina[]> => {
  const response = await httpClient.post('/api/nomina/registrar', payload)
  return response.data
}

export const marcarComoPagado = async (id: number, usuarioId: number): Promise<RegistroNomina> => {
  const response = await httpClient.patch(`/api/nomina/${id}/pagar`, { usuarioId })
  return response.data
}

export const marcarMultiplesComoPagado = async (ids: number[], usuarioId: number): Promise<RegistroNomina[]> => {
  const response = await httpClient.patch('/api/nomina/pagar-multiples', { ids, usuarioId })
  return response.data
}

export const eliminarRegistroNomina = async (id: number): Promise<void> => {
  await httpClient.delete(`/api/nomina/${id}`)
}
