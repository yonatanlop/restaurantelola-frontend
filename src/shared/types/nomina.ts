export interface Empleado {
  id: number
  nombre: string
  apellido: string
  nombreCompleto?: string
  documento?: string
  telefono?: string
  direccion?: string
  puesto?: string
  salarioDiario: number
  activo: boolean
  fechaIngreso: string
}

export interface EmpleadoPayload {
  nombre: string
  apellido: string
  documento?: string
  telefono?: string
  direccion?: string
  puesto?: string
  salarioDiario: number
  fechaIngreso: string
  activo?: boolean
}

export type EstadoNomina = 'PENDIENTE' | 'PAGADO'

export interface RegistroNomina {
  id: number
  empleadoId: number
  empleadoNombre?: string
  empleadoPuesto?: string
  fecha: string
  monto: number
  estado: EstadoNomina
  fechaPago?: string
  notas?: string
  registradoPor?: number
}

export interface RegistroAsistenciaPayload {
  fecha: string
  empleadosIds: number[]
  notas?: string
  registradoPor: number
}

