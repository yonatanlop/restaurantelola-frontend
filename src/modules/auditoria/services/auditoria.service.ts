import httpClient from '@/shared/api/httpClient';
import { AuditoriaLog, AuditoriaFiltro } from '../types/auditoria.types';

const API_URL = '/api/auditoria';

export const auditoriaService = {
  // Obtener logs por usuario
  obtenerPorUsuario: async (usuarioId: number): Promise<AuditoriaLog[]> => {
    const response = await httpClient.get(`${API_URL}/usuario/${usuarioId}`);
    return response.data;
  },

  // Obtener logs por entidad
  obtenerPorEntidad: async (entidad: string, entidadId: number): Promise<AuditoriaLog[]> => {
    const response = await httpClient.get(`${API_URL}/entidad/${entidad}/${entidadId}`);
    return response.data;
  },

  // Obtener logs por acción
  obtenerPorAccion: async (accion: string): Promise<AuditoriaLog[]> => {
    const response = await httpClient.get(`${API_URL}/accion/${accion}`);
    return response.data;
  },

  // Obtener logs por rango de fechas
  obtenerPorRango: async (inicio: string, fin: string): Promise<AuditoriaLog[]> => {
    const response = await httpClient.get(`${API_URL}/rango`, {
      params: { inicio, fin }
    });
    return response.data;
  },

  // Buscar con filtros
  buscarConFiltros: async (filtros: AuditoriaFiltro): Promise<AuditoriaLog[]> => {
    const response = await httpClient.post(`${API_URL}/buscar`, filtros);
    return response.data;
  }
};
