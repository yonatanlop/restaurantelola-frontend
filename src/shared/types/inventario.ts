export interface Insumo {
  id: number
  nombre: string
  descripcion?: string
  unidadMedida: string
  cantidadActual: number
  cantidadMinima: number
  precioUnitario: number
  activo: boolean
  bajoStock: boolean
}

export interface InsumoPayload {
  nombre: string
  descripcion?: string
  unidadMedida: string
  cantidadActual?: number
  cantidadMinima: number
  precioUnitario: number
  activo?: boolean
}

export interface AjusteInventarioPayload {
  cantidad: number
  motivo: string
  usuarioId?: number
}
