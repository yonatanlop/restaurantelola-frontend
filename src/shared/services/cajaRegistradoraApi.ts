import axios from 'axios'

const API_URL = 'http://localhost:8080/api/caja-registradora'

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
  const response = await axios.post<RespuestaAbrirCajon>(`${API_URL}/abrir-cajon`)
  return response.data
}

/**
 * Obtiene el estado de la caja registradora
 */
export const obtenerEstado = async (): Promise<EstadoCajaRegistradora> => {
  const response = await axios.get<EstadoCajaRegistradora>(`${API_URL}/estado`)
  return response.data
}
