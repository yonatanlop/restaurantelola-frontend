import httpClient from '@/shared/api/httpClient';
import { Mesa, Comanda, CrearComandaDTO, TransferenciaMesaDTO } from '../types/mesas.types';

const API_URL = '/api';

export const mesasService = {
  // Mesas
  obtenerTodasLasMesas: async (): Promise<Mesa[]> => {
    const response = await httpClient.get(`${API_URL}/mesas`);
    return response.data;
  },

  obtenerMesasPorEstado: async (estado: string): Promise<Mesa[]> => {
    const response = await httpClient.get(`${API_URL}/mesas/estado/${estado}`);
    return response.data;
  },

  obtenerMesasPorUbicacion: async (ubicacion: string): Promise<Mesa[]> => {
    const response = await httpClient.get(`${API_URL}/mesas/ubicacion/${ubicacion}`);
    return response.data;
  },

  ocuparMesa: async (mesaId: number, ventaId: number): Promise<void> => {
    await httpClient.post(`${API_URL}/mesas/${mesaId}/ocupar?ventaId=${ventaId}`);
  },

  liberarMesa: async (mesaId: number): Promise<void> => {
    await httpClient.post(`${API_URL}/mesas/${mesaId}/liberar`);
  },

  transferirMesa: async (datos: TransferenciaMesaDTO): Promise<void> => {
    await httpClient.post(`${API_URL}/mesas/transferir`, datos);
  },

  cambiarEstadoMesa: async (mesaId: number, estado: string): Promise<void> => {
    await httpClient.patch(`${API_URL}/mesas/${mesaId}/estado?estado=${estado}`);
  },

  // Comandas
  crearComanda: async (datos: CrearComandaDTO): Promise<Comanda> => {
    const response = await httpClient.post(`${API_URL}/comandas`, datos);
    return response.data;
  },

  obtenerComandasPorMesa: async (mesaId: number): Promise<Comanda[]> => {
    const response = await httpClient.get(`${API_URL}/comandas/mesa/${mesaId}`);
    return response.data;
  },

  obtenerComandasPendientes: async (): Promise<Comanda[]> => {
    const response = await httpClient.get(`${API_URL}/comandas/pendientes`);
    return response.data;
  },

  obtenerComandasPorEstado: async (estado: string): Promise<Comanda[]> => {
    const response = await httpClient.get(`${API_URL}/comandas/estado/${estado}`);
    return response.data;
  },

  cambiarEstadoComanda: async (comandaId: number, estado: string): Promise<Comanda> => {
    const response = await httpClient.patch(`${API_URL}/comandas/${comandaId}/estado?estado=${estado}`);
    return response.data;
  },

  cambiarEstadoItem: async (comandaId: number, detalleId: number, estado: string): Promise<void> => {
    await httpClient.patch(`${API_URL}/comandas/${comandaId}/item/${detalleId}/estado?estado=${estado}`);
  },

  cancelarComanda: async (comandaId: number, motivo: string): Promise<void> => {
    await httpClient.post(`${API_URL}/comandas/${comandaId}/cancelar?motivo=${encodeURIComponent(motivo)}`);
  }
};
