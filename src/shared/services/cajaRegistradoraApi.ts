import httpClient from '@/shared/api/httpClient'

const API_URL = '/api/caja-registradora'

export interface EstadoCajaRegistradora {
  habilitada: boolean
  puerto: string
}

export interface RespuestaAbrirCajon {
  exito: boolean
  mensaje: string
  puerto: string
}

/**
 * Abre el cajón de la caja registradora
 */
export const abrirCajon = async (): Promise<RespuestaAbrirCajon> => {
  const response = await httpClient.post<RespuestaAbrirCajon>(`${API_URL}/abrir-cajon`)
  return response.data
}

/**
 * Obtiene el estado de la caja registradora
 */
export const obtenerEstado = async (): Promise<EstadoCajaRegistradora> => {
  const response = await httpClient.get<EstadoCajaRegistradora>(`${API_URL}/estado`)
  return response.data
}
