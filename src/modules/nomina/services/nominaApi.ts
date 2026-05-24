import httpClient from '@/shared/api/httpClient'
import { Empleado, EmpleadoPayload } from '@/shared/types/nomina'

export const obtenerEmpleados = async (): Promise<Empleado[]> => {
  const response = await httpClient.get('/api/empleados')
  return response.data
}

export const obtenerEmpleadosActivos = async (): Promise<Empleado[]> => {
  const response = await httpClient.get('/api/empleados/activos')
  return response.data
}

export const obtenerEmpleadoPorId = async (id: number): Promise<Empleado> => {
  const response = await httpClient.get(`/api/empleados/${id}`)
  return response.data
}

export const crearEmpleado = async (empleadoData: EmpleadoPayload): Promise<Empleado> => {
  const response = await httpClient.post('/api/empleados', empleadoData)
  return response.data
}

export const actualizarEmpleado = async (id: number, empleadoData: EmpleadoPayload): Promise<Empleado> => {
  const response = await httpClient.put(`/api/empleados/${id}`, empleadoData)
  return response.data
}

export const cambiarEstadoEmpleado = async (id: number, activo: boolean): Promise<Empleado> => {
  const response = await httpClient.patch(`/api/empleados/${id}/estado`, { activo })
  return response.data
}

export const eliminarEmpleado = async (id: number): Promise<void> => {
  await httpClient.delete(`/api/empleados/${id}`)
}
