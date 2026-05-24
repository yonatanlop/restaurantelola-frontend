import axios from 'axios';
import { Cliente, Credito, RegistrarCreditoDTO } from '../types/creditos.types';

const API_URL = 'http://localhost:8080/api/creditos';

export const creditosApi = {
  // Clientes
  obtenerClientes: async (): Promise<Cliente[]> => {
    const response = await axios.get(`${API_URL}/clientes`);
    return response.data;
  },

  obtenerClientePorId: async (id: number): Promise<Cliente> => {
    const response = await axios.get(`${API_URL}/clientes/${id}`);
    return response.data;
  },

  crearCliente: async (cliente: Omit<Cliente, 'id' | 'deudaTotal' | 'creditosPendientes'>): Promise<Cliente> => {
    const response = await axios.post(`${API_URL}/clientes`, cliente);
    return response.data;
  },

  actualizarCliente: async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
    const response = await axios.put(`${API_URL}/clientes/${id}`, cliente);
    return response.data;
  },

  // Créditos
  obtenerCreditosCliente: async (clienteId: number): Promise<Credito[]> => {
    const response = await axios.get(`${API_URL}/cliente/${clienteId}`);
    return response.data;
  },

  obtenerCreditosPendientes: async (): Promise<Credito[]> => {
    const response = await axios.get(`${API_URL}/pendientes`);
    return response.data;
  },

  registrarCredito: async (credito: RegistrarCreditoDTO): Promise<Credito> => {
    const response = await axios.post(`${API_URL}`, credito);
    return response.data;
  },

  marcarComoPagado: async (creditoId: number, usuarioId: number): Promise<any> => {
    const response = await axios.post(`${API_URL}/${creditoId}/pagar`, null, {
      params: { usuarioId }
    });
    return response.data;
  },

  obtenerDeudaTotal: async (clienteId: number): Promise<number> => {
    const response = await axios.get(`${API_URL}/cliente/${clienteId}/deuda`);
    return response.data;
  }
};
