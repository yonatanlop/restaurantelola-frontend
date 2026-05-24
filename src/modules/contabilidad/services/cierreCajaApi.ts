import httpClient from '@/shared/api/httpClient'

export interface CierreCajaDetalle {
  id: number
  fecha: string
  usuarioNombre: string
  saldoInicial: number
  totalIngresos: number
  totalEgresos: number
  saldoEsperado: number
  efectivoContado: number
  tarjetas: number
  transferencias: number
  otrosMedios: number
  totalContado: number
  diferencia: number
  estado: string
  fechaApertura?: string
  fechaCierre?: string
}

export interface AlertaCierre {
  codigo: string
  mensaje: string
  severidad: 'INFO' | 'WARNING' | 'CRITICAL'
  fechaReferencia?: string
  fechaVenta?: string
}

export interface CierreCajaEstado {
  cierreAbierto: boolean
  cierreActual?: CierreCajaDetalle
  ultimoCierre?: CierreCajaDetalle
  diasSinCierre: number
  tieneVentasPosteriores: boolean
  ultimaVentaPosterior?: string
  alertas: AlertaCierre[]
}

export interface AperturaPayload {
  fecha?: string
  saldoInicial: number
  usuarioId: number
  usuarioNombre: string
}

export interface CierrePayload {
  usuarioId: number
  usuarioNombre?: string
  efectivoContado: number
  tarjetas: number
  transferencias: number
  otrosMedios: number
  observaciones?: string
  arqueoDetalle?: Record<string, number>
}

export const obtenerEstadoCierre = async (): Promise<CierreCajaEstado> => {
  const { data } = await httpClient.get('/api/cierre-caja/estado')
  return data
}

export const iniciarCierre = async (payload: AperturaPayload): Promise<CierreCajaDetalle> => {
  const { data } = await httpClient.post('/api/cierre-caja/iniciar', payload)
  return data
}

export const cerrarCierre = async (
  cierreId: number,
  payload: CierrePayload
): Promise<CierreCajaDetalle> => {
  const { data } = await httpClient.post(`/api/cierre-caja/${cierreId}/cerrar`, payload)
  return data
}

export const obtenerHistorial = async (
  inicio: string,
  fin: string
): Promise<CierreCajaDetalle[]> => {
  const { data } = await httpClient.get('/api/cierre-caja/historial', { params: { inicio, fin } })
  return data
}

export const generarReporteCierre = async (cierreId: number) => {
  const { data } = await httpClient.get(`/api/cierre-caja/${cierreId}/reporte`)
  return data
}

